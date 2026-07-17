do $$
begin
  create type split_by as enum ('none', 'half', 'quarter');
exception
  when duplicate_object then
    null;
end $$;

alter table games
  add column if not exists split_by split_by not null default 'none';