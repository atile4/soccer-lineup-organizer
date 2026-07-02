create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade not null,
  name text not null,
  notes text,
  created_at timestamptz default now() not null
);

create index if not exists games_team_id_idx on games(team_id);

alter table games enable row level security;

create policy "Users can view games for their teams"
  on games for select
  using (
    exists (
      select 1 from teams
      where teams.id = games.team_id
      and teams.user_id = auth.uid()
    )
  );

create policy "Users can create games for their teams"
  on games for insert
  with check (
    exists (
      select 1 from teams
      where teams.id = games.team_id
      and teams.user_id = auth.uid()
    )
  );

create policy "Users can update games for their teams"
  on games for update
  using (
    exists (
      select 1 from teams
      where teams.id = games.team_id
      and teams.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from teams
      where teams.id = games.team_id
      and teams.user_id = auth.uid()
    )
  );

create policy "Users can delete games for their teams"
  on games for delete
  using (
    exists (
      select 1 from teams
      where teams.id = games.team_id
      and teams.user_id = auth.uid()
    )
  );