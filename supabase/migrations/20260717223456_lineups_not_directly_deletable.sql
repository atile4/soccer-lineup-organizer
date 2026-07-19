drop policy if exists "Users can delete own lineups" on lineups;

create or replace function change_game_split(p_game_id uuid, p_new_split split_by)
returns setof lineups
language plpgsql
security definer
set search_path = public
as $$
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

grant execute on function change_game_split(uuid, split_by) to authenticated;