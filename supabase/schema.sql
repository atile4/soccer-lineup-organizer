


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."split_by" AS ENUM (
    'none',
    'half',
    'quarter'
);


ALTER TYPE "public"."split_by" OWNER TO "postgres";


CREATE TYPE "public"."split_type" AS ENUM (
    'quarter',
    'half',
    'none'
);


ALTER TYPE "public"."split_type" OWNER TO "postgres";


COMMENT ON TYPE "public"."split_type" IS 'Options to split a game';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."lineups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "game_id" "uuid" NOT NULL,
    "period" smallint NOT NULL,
    "formation" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."lineups" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."change_game_split"("p_game_id" "uuid", "p_new_split" "public"."split_by") RETURNS SETOF "public"."lineups"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_target_count int;
  v_current_lineup uuid;
  v_new_current_lineup uuid;
begin
  if not exists (
    select 1 from games g
    join teams t on t.id = g.team_id
    where g.id = p_game_id and t.user_id = auth.uid()
  ) then
    raise exception 'Not authorized to modify this game';
  end if;

  if p_new_split = 'none' then
    v_target_count := 1;
  elsif p_new_split = 'half' then
    v_target_count := 2;
  elsif p_new_split = 'quarter' then
    v_target_count := 4;
  else
    raise exception 'Invalid split type: %', p_new_split;
  end if;

  insert into lineups (game_id, period)
  select p_game_id, gs
  from generate_series(1, v_target_count) as gs
  where not exists (
    select 1 from lineups where game_id = p_game_id and period = gs
  );

  delete from lineups
  where game_id = p_game_id
    and period > v_target_count;

  select current_lineup_id into v_current_lineup from games where id = p_game_id;

  if v_current_lineup is not null
     and not exists (select 1 from lineups where id = v_current_lineup) then
    select id into v_new_current_lineup
    from lineups where game_id = p_game_id and period = 1;
  else
    v_new_current_lineup := v_current_lineup;
  end if;

  update games
  set split_by = p_new_split,
      current_lineup_id = v_new_current_lineup
  where id = p_game_id;

  return query select * from lineups where game_id = p_game_id order by period;
end;
$$;


ALTER FUNCTION "public"."change_game_split"("p_game_id" "uuid", "p_new_split" "public"."split_by") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."games" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "team_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "split_by" "public"."split_type" DEFAULT 'none'::"public"."split_type" NOT NULL,
    "current_lineup_id" "uuid"
);


ALTER TABLE "public"."games" OWNER TO "postgres";


COMMENT ON COLUMN "public"."games"."split_by" IS 'How a game will be split (into quarters, halves, or none at all)';



CREATE OR REPLACE FUNCTION "public"."create_game_with_lineups"("p_team_id" "uuid", "p_name" "text", "p_split" "text" DEFAULT 'none'::"text", "p_notes" "text" DEFAULT NULL::"text") RETURNS "public"."games"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_game games;
  v_period_count int;
  v_first_lineup_id uuid;
begin
  -- Ownership check (see comment above)
  if not exists (
    select 1 from teams
    where id = p_team_id and user_id = auth.uid()
  ) then
    raise exception 'Team % not found or not owned by current user', p_team_id;
  end if;

  v_period_count := case p_split
    when 'none' then 1
    when 'half' then 2
    when 'quarter' then 4
    else null
  end;

  if v_period_count is null then
    raise exception 'Invalid split type: %', p_split;
  end if;

  -- 1. Create the game
  -- Same enum-cast note as set_game_split: split_by is a split_type
  -- enum, not text, so p_split needs an explicit cast here.
  insert into games (team_id, name, notes, split_by)
  values (p_team_id, p_name, p_notes, p_split::split_type)
  returning * into v_game;

  -- 2. Create N lineups, 0-indexed: period 0 = 1st quarter/half, 1 = 2nd, etc.
  insert into lineups (game_id, period)
  select v_game.id, gs
  from generate_series(0, v_period_count - 1) as gs;

  -- 3. Point current_lineup_id at period 0
  select id into v_first_lineup_id
  from lineups
  where game_id = v_game.id and period = 0;

  update games
  set current_lineup_id = v_first_lineup_id
  where id = v_game.id
  returning * into v_game;

  return v_game;
end;
$$;


ALTER FUNCTION "public"."create_game_with_lineups"("p_team_id" "uuid", "p_name" "text", "p_split" "text", "p_notes" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."owns_game"("check_game_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM games g
    JOIN teams t ON t.id = g.team_id
    WHERE g.id = check_game_id AND t.user_id = auth.uid()
  );
$$;


ALTER FUNCTION "public"."owns_game"("check_game_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."owns_lineup"("check_lineup_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  select exists (
    select 1 from lineups l
    join games g on g.id = l.game_id
    join teams t on t.id = g.team_id
    where l.id = check_lineup_id and t.user_id = auth.uid()
  );
$$;


ALTER FUNCTION "public"."owns_lineup"("check_lineup_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_game_split"("p_game_id" "uuid", "p_split" "text") RETURNS SETOF "public"."lineups"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_period_count int;
begin
  -- Reuse the ownership-check helper already defined alongside the
  -- lineups table (see 20260706042340_add_lineups_table.sql).
  if not owns_game(p_game_id) then
    raise exception 'Game % not found or not owned by current user', p_game_id;
  end if;

  v_period_count := case p_split
    when 'none' then 1
    when 'half' then 2
    when 'quarter' then 4
    else null
  end;

  if v_period_count is null then
    raise exception 'Invalid split type: %', p_split;
  end if;

  -- Add any periods that don't exist yet (e.g. none -> quarter adds 1,2,3).
  -- The "where not exists" guards against the UNIQUE(game_id, period)
  -- constraint if some periods are already there.
  insert into lineups (game_id, period)
  select p_game_id, gs
  from generate_series(0, v_period_count - 1) as gs
  where not exists (
    select 1 from lineups l
    where l.game_id = p_game_id and l.period = gs
  );

  -- Remove periods beyond the new count (e.g. quarter -> half removes 2,3).
  -- games.current_lineup_id is ON DELETE SET NULL, so if the coach's
  -- active lineup is among the ones deleted here, Postgres will null it
  -- out as a side effect of this delete. That's fine -- the update below
  -- doesn't depend on that side effect, it recomputes the correct value
  -- explicitly either way.
  delete from lineups
  where game_id = p_game_id and period >= v_period_count;

  -- Always leave current_lineup_id pointing at a lineup that still
  -- exists, defaulting to period 0 rather than null:
  --   - if the lineup it used to point at survived the resize, keep it
  --   - otherwise (deleted above, or never set to begin with), fall
  --     back to period 0, which is guaranteed to exist since
  --     v_period_count is always >= 1
  -- Doing this as an explicit lookup means the result doesn't depend on
  -- ON DELETE SET NULL having fired -- current_lineup_id is never left
  -- null as a result of calling this function.
  update games
  set
    current_lineup_id = coalesce(
      (select id from lineups
         where game_id = p_game_id and id = games.current_lineup_id),
      (select id from lineups
         where game_id = p_game_id and period = 0)
    ),
    -- split_by is a custom enum (split_type), not plain text. Postgres
    -- only auto-converts bare string literals to an enum, not a typed
    -- text parameter -- so this needs an explicit cast or you'll hit
    -- error 42804 ("column is of type split_type but expression is of
    -- type text").
    split_by = p_split::split_type
  where id = p_game_id;

  return query
  select * from lineups
  where game_id = p_game_id
  order by period;
end;
$$;


ALTER FUNCTION "public"."set_game_split"("p_game_id" "uuid", "p_split" "text") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."field_positions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lineup_id" "uuid" NOT NULL,
    "player_id" "uuid" NOT NULL,
    "x" numeric(5,2),
    "y" numeric(5,2),
    "bench" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "coords_in_range" CHECK (((("x" IS NULL) OR (("x" >= (0)::numeric) AND ("x" <= (100)::numeric))) AND (("y" IS NULL) OR (("y" >= (0)::numeric) AND ("y" <= (100)::numeric))))),
    CONSTRAINT "on_field_needs_coords" CHECK ((("bench" = true) OR (("x" IS NOT NULL) AND ("y" IS NOT NULL))))
);


ALTER TABLE "public"."field_positions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."players" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "team_id" "uuid",
    "name" "text" NOT NULL,
    "number" integer NOT NULL,
    "position" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."players" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "email" "text" NOT NULL,
    "current_team_id" "uuid",
    "current_game_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "division" "text",
    "gender" "text" DEFAULT 'Coed'::"text" NOT NULL,
    "color" "text" DEFAULT '#2563eb'::"text" NOT NULL,
    CONSTRAINT "teams_color_check" CHECK (("color" ~ '^#[0-9A-Fa-f]{6}$'::"text")),
    CONSTRAINT "teams_division_check" CHECK (("division" = ANY (ARRAY['U-8'::"text", 'U-10'::"text", 'U-12'::"text", 'U-14'::"text", 'U-16'::"text", 'U-18'::"text"]))),
    CONSTRAINT "teams_gender_check" CHECK (("gender" = ANY (ARRAY['Boys'::"text", 'Girls'::"text", 'Coed'::"text"])))
);


ALTER TABLE "public"."teams" OWNER TO "postgres";


ALTER TABLE ONLY "public"."field_positions"
    ADD CONSTRAINT "field_positions_lineup_id_player_id_key" UNIQUE ("lineup_id", "player_id");



ALTER TABLE ONLY "public"."field_positions"
    ADD CONSTRAINT "field_positions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lineups"
    ADD CONSTRAINT "lineups_game_id_period_key" UNIQUE ("game_id", "period");



ALTER TABLE ONLY "public"."lineups"
    ADD CONSTRAINT "lineups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."players"
    ADD CONSTRAINT "players_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");



CREATE INDEX "field_positions_lineup_id_idx" ON "public"."field_positions" USING "btree" ("lineup_id");



CREATE INDEX "field_positions_player_id_idx" ON "public"."field_positions" USING "btree" ("player_id");



CREATE INDEX "games_team_id_idx" ON "public"."games" USING "btree" ("team_id");



ALTER TABLE ONLY "public"."field_positions"
    ADD CONSTRAINT "field_positions_lineup_id_fkey" FOREIGN KEY ("lineup_id") REFERENCES "public"."lineups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."field_positions"
    ADD CONSTRAINT "field_positions_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_current_lineup_id_fkey" FOREIGN KEY ("current_lineup_id") REFERENCES "public"."lineups"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lineups"
    ADD CONSTRAINT "lineups_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."players"
    ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_current_game_id_fkey" FOREIGN KEY ("current_game_id") REFERENCES "public"."games"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_current_team_id_fkey" FOREIGN KEY ("current_team_id") REFERENCES "public"."teams"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Users can add players to their own teams" ON "public"."players" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."teams"
  WHERE (("teams"."id" = "players"."team_id") AND ("teams"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can create games for their teams" ON "public"."games" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."teams"
  WHERE (("teams"."id" = "games"."team_id") AND ("teams"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can create their own teams" ON "public"."teams" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can delete games for their teams" ON "public"."games" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."teams"
  WHERE (("teams"."id" = "games"."team_id") AND ("teams"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can delete own field positions" ON "public"."field_positions" FOR DELETE USING ("public"."owns_lineup"("lineup_id"));



CREATE POLICY "Users can delete players on their own teams" ON "public"."players" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."teams"
  WHERE (("teams"."id" = "players"."team_id") AND ("teams"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can delete their own teams" ON "public"."teams" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can insert own field positions" ON "public"."field_positions" FOR INSERT WITH CHECK ("public"."owns_lineup"("lineup_id"));



CREATE POLICY "Users can insert own lineups" ON "public"."lineups" FOR INSERT WITH CHECK ("public"."owns_game"("game_id"));



CREATE POLICY "Users can update games for their teams" ON "public"."games" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."teams"
  WHERE (("teams"."id" = "games"."team_id") AND ("teams"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."teams"
  WHERE (("teams"."id" = "games"."team_id") AND ("teams"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can update own field positions" ON "public"."field_positions" FOR UPDATE USING ("public"."owns_lineup"("lineup_id"));



CREATE POLICY "Users can update own lineups" ON "public"."lineups" FOR UPDATE USING ("public"."owns_game"("game_id"));



CREATE POLICY "Users can update players on their own teams" ON "public"."players" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."teams"
  WHERE (("teams"."id" = "players"."team_id") AND ("teams"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."teams"
  WHERE (("teams"."id" = "players"."team_id") AND ("teams"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("id" = "auth"."uid"())) WITH CHECK (("id" = "auth"."uid"()));



CREATE POLICY "Users can update their own teams" ON "public"."teams" FOR UPDATE USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view games for their teams" ON "public"."games" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."teams"
  WHERE (("teams"."id" = "games"."team_id") AND ("teams"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view own field positions" ON "public"."field_positions" FOR SELECT USING ("public"."owns_lineup"("lineup_id"));



CREATE POLICY "Users can view own lineups" ON "public"."lineups" FOR SELECT USING ("public"."owns_game"("game_id"));



CREATE POLICY "Users can view players on their own teams" ON "public"."players" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."teams"
  WHERE (("teams"."id" = "players"."team_id") AND ("teams"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("id" = "auth"."uid"()));



CREATE POLICY "Users can view their own teams" ON "public"."teams" FOR SELECT USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."field_positions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."games" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lineups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."players" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON TABLE "public"."lineups" TO "anon";
GRANT ALL ON TABLE "public"."lineups" TO "authenticated";
GRANT ALL ON TABLE "public"."lineups" TO "service_role";



GRANT ALL ON FUNCTION "public"."change_game_split"("p_game_id" "uuid", "p_new_split" "public"."split_by") TO "anon";
GRANT ALL ON FUNCTION "public"."change_game_split"("p_game_id" "uuid", "p_new_split" "public"."split_by") TO "authenticated";
GRANT ALL ON FUNCTION "public"."change_game_split"("p_game_id" "uuid", "p_new_split" "public"."split_by") TO "service_role";



GRANT ALL ON TABLE "public"."games" TO "anon";
GRANT ALL ON TABLE "public"."games" TO "authenticated";
GRANT ALL ON TABLE "public"."games" TO "service_role";



GRANT ALL ON FUNCTION "public"."create_game_with_lineups"("p_team_id" "uuid", "p_name" "text", "p_split" "text", "p_notes" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_game_with_lineups"("p_team_id" "uuid", "p_name" "text", "p_split" "text", "p_notes" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_game_with_lineups"("p_team_id" "uuid", "p_name" "text", "p_split" "text", "p_notes" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."owns_game"("check_game_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."owns_game"("check_game_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."owns_game"("check_game_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."owns_lineup"("check_lineup_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."owns_lineup"("check_lineup_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."owns_lineup"("check_lineup_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_game_split"("p_game_id" "uuid", "p_split" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."set_game_split"("p_game_id" "uuid", "p_split" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_game_split"("p_game_id" "uuid", "p_split" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."field_positions" TO "anon";
GRANT ALL ON TABLE "public"."field_positions" TO "authenticated";
GRANT ALL ON TABLE "public"."field_positions" TO "service_role";



GRANT ALL ON TABLE "public"."players" TO "anon";
GRANT ALL ON TABLE "public"."players" TO "authenticated";
GRANT ALL ON TABLE "public"."players" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































