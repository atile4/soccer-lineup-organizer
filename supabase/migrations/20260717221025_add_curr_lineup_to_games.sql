alter table games
  add column current_lineup_id uuid references lineups(id) on delete set null;