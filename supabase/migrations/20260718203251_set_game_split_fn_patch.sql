-- Resizes an existing game's lineups when the coach changes split_by.
-- Adds missing periods, removes extra ones, and repoints
-- current_lineup_id back to period 0 if it got deleted.
create or replace function set_game_split(
  p_game_id uuid,
  p_split text
)
returns setof lineups
language plpgsql
security definer
set search_path = public
as $$
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

grant execute on function set_game_split(uuid, text) to authenticated;