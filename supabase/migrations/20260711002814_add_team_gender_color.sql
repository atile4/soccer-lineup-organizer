-- adds gender and team color columns onto the teams table
alter table teams
  add column gender text not null default 'Coed',
  add column color text not null default '#2563eb';

alter table teams
  add constraint teams_gender_check
  check (gender in ('Boys', 'Girls', 'Coed'));

alter table teams
  add constraint teams_color_check
  check (color ~ '^#[0-9A-Fa-f]{6}$');