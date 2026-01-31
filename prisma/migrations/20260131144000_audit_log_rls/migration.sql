-- Enable RLS on audit_logs table
alter table public.audit_logs enable row level security;

-- Deny access to anon and authenticated roles (only service role can access)
drop policy if exists "deny anon audit_logs" on public.audit_logs;
drop policy if exists "deny auth audit_logs" on public.audit_logs;

create policy "deny anon audit_logs" on public.audit_logs
  for all to anon using (false) with check (false);
create policy "deny auth audit_logs" on public.audit_logs
  for all to authenticated using (false) with check (false);
