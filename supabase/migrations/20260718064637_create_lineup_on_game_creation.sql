create or replace function create_game_with_lineups(
  p_team_id uuid,
  p_name text,
  p_split text default 'none',
  p_notes text default null
)
returns games
language plpgsql
security definer
as $$
declare
  v_game games;
  v_period_count int;
  v_first_lineup_id uuid;
begin
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
  insert into games (team_id, name, notes, split_by)
  values (p_team_id, p_name, p_notes, p_split)
  returning * into v_game;

  -- 2. Create N lineups, 0-indexed: period 0 = 1st quarter, 1 = 2nd, etc.
  insert into lineups (game_id, period)
  select v_game.id, gs
  from generate_series(0, v_period_count - 1) as gs;

  -- 3. Point current_lineup_id at period 0 (the first period)
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