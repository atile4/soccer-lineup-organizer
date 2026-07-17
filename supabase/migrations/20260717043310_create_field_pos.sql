-- One row per player, per lineup (quarter/half).
create table if not exists field_positions (
  id         uuid primary key default gen_random_uuid(),
  lineup_id  uuid references lineups(id) on delete cascade not null,
  player_id  uuid references players(id) on delete cascade not null,
  x          numeric(5,2), -- percentage from left, 0-100
  y          numeric(5,2), -- percentage from top, 0-100
  bench      boolean not null default true,
  created_at timestamptz default now() not null,

  unique (lineup_id, player_id), -- A player can only occupy one spot within a given lineup/period.

  -- On-field players (bench = false) must have coordinates.
  constraint on_field_needs_coords check (
    bench = true or (x is not null and y is not null)
  ),

  -- Keep coordinates within the valid 0-100 percentage range.
  constraint coords_in_range check (
    (x is null or (x >= 0 and x <= 100)) and
    (y is null or (y >= 0 and y <= 100))
  )
);

create index if not exists field_positions_lineup_id_idx on field_positions(lineup_id);
create index if not exists field_positions_player_id_idx on field_positions(player_id);

alter table field_positions enable row level security;

-- Mirrors owns_game() from the lineups migration, one join hop deeper:
-- field_positions -> lineup -> game -> team -> user.
create or replace function owns_lineup(check_lineup_id uuid)
returns boolean as $$
  select exists (
    select 1 from lineups l
    join games g on g.id = l.game_id
    join teams t on t.id = g.team_id
    where l.id = check_lineup_id and t.user_id = auth.uid()
  );
$$ language sql security definer stable;

create policy "Users can view own field positions" on field_positions
  for select using (owns_lineup(lineup_id));

create policy "Users can insert own field positions" on field_positions
  for insert with check (owns_lineup(lineup_id));

create policy "Users can update own field positions" on field_positions
  for update using (owns_lineup(lineup_id));

create policy "Users can delete own field positions" on field_positions
  for delete using (owns_lineup(lineup_id));