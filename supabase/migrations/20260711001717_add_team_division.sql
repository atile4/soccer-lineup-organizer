-- Adds the `division` column that app/types.ts already assumes exists.
-- Run this in the Supabase SQL editor, or via `supabase db push` if you're
-- using the CLI with migrations.

alter table teams
  add column division text default NULL;

-- A CHECK constraint means bad data can't get in even if a bug in the
-- frontend sends something unexpected. Keep this list in sync with the
-- Division type in app/types.ts and the DIVISIONS array in app/formations.ts.
alter table teams
  add constraint teams_division_check
  check (division in ('U-8', 'U-10', 'U-12', 'U-14', 'U-16', 'U-18'));