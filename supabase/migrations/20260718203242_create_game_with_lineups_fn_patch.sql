-- Atomically creates a game plus its required lineups (one per period),
-- and points current_lineup_id at period 0.
--
-- SECURITY DEFINER functions run with the privileges of the function's
-- owner, which means they bypass Row Level Security. Since we're
-- intentionally stepping around RLS here, we re-implement the
-- "do you actually own this?" check by hand inside the function body --
-- otherwise any logged-in user could create a game under someone else's
-- team_id.
create or replace function create_game_with_lineups(
  p_team_id uuid,
  p_name text,
  p_split text default 'none',
  p_notes text default null
)
returns games
language plpgsql
security definer
set search_path = public
as $$
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

-- Functions aren't auto-exposed to API roles the way tables are --
-- this grant is what lets the "authenticated" role (i.e. any logged-in
-- user) call it via supabase.rpc(...).
grant execute on function create_game_with_lineups(uuid, text, text, text) to authenticated;