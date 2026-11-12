-- Local development seed. Runs after migrations on `npm run db:reset`.
-- Settings defaults live in the migration so production has them; this keeps
-- them at the spec values after local experiments.
insert into public.settings (key, value) values
  ('min_notice_days', 3),
  ('report_due_days', 14)
on conflict (key) do update set value = excluded.value;
