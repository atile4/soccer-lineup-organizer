-- Step 0: Drop policies that depend on teams.user_id's current type
drop policy if exists "coaches_own_teams" on teams;
drop policy if exists "coaches_own_players" on players;

-- Step 1: Clear dummy data (also clears players via cascade)
truncate table teams cascade;

-- Step 2: Change the column type
alter table teams
  alter column user_id type uuid using user_id::uuid;

-- Step 3: Link it to Supabase's actual auth users
alter table teams
  add constraint teams_user_id_fkey
  foreign key (user_id) references auth.users(id)
  on delete cascade;

-- Step 4: Recreate RLS on teams, explicit per-operation
alter table teams enable row level security;

create policy "Users can view their own teams"
  on teams for select
  using (user_id = auth.uid());

create policy "Users can create their own teams"
  on teams for insert
  with check (user_id = auth.uid());

create policy "Users can update their own teams"
  on teams for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete their own teams"
  on teams for delete
  using (user_id = auth.uid());

-- Step 5: Recreate RLS on players — now a clean uuid = uuid comparison
alter table players enable row level security;

create policy "Users can view players on their own teams"
  on players for select
  using (
    exists (
      select 1 from teams
      where teams.id = players.team_id
      and teams.user_id = auth.uid()
    )
  );

create policy "Users can add players to their own teams"
  on players for insert
  with check (
    exists (
      select 1 from teams
      where teams.id = players.team_id
      and teams.user_id = auth.uid()
    )
  );

create policy "Users can update players on their own teams"
  on players for update
  using (
    exists (
      select 1 from teams
      where teams.id = players.team_id
      and teams.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from teams
      where teams.id = players.team_id
      and teams.user_id = auth.uid()
    )
  );

create policy "Users can delete players on their own teams"
  on players for delete
  using (
    exists (
      select 1 from teams
      where teams.id = players.team_id
      and teams.user_id = auth.uid()
    )
  );