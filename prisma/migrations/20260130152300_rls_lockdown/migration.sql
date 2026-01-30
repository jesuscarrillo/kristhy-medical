-- Enable RLS on all tables exposed via PostgREST
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.accounts enable row level security;
alter table public.verifications enable row level security;

alter table public.patients enable row level security;
alter table public.medical_records enable row level security;
alter table public.appointments enable row level security;
alter table public.prescriptions enable row level security;
alter table public.medical_images enable row level security;

drop policy if exists "deny anon users" on public.users;
drop policy if exists "deny auth users" on public.users;
create policy "deny anon users" on public.users
  for all to anon using (false) with check (false);
create policy "deny auth users" on public.users
  for all to authenticated using (false) with check (false);

drop policy if exists "deny anon sessions" on public.sessions;
drop policy if exists "deny auth sessions" on public.sessions;
create policy "deny anon sessions" on public.sessions
  for all to anon using (false) with check (false);
create policy "deny auth sessions" on public.sessions
  for all to authenticated using (false) with check (false);

drop policy if exists "deny anon accounts" on public.accounts;
drop policy if exists "deny auth accounts" on public.accounts;
create policy "deny anon accounts" on public.accounts
  for all to anon using (false) with check (false);
create policy "deny auth accounts" on public.accounts
  for all to authenticated using (false) with check (false);

drop policy if exists "deny anon verifications" on public.verifications;
drop policy if exists "deny auth verifications" on public.verifications;
create policy "deny anon verifications" on public.verifications
  for all to anon using (false) with check (false);
create policy "deny auth verifications" on public.verifications
  for all to authenticated using (false) with check (false);

drop policy if exists "deny anon patients" on public.patients;
drop policy if exists "deny auth patients" on public.patients;
create policy "deny anon patients" on public.patients
  for all to anon using (false) with check (false);
create policy "deny auth patients" on public.patients
  for all to authenticated using (false) with check (false);

drop policy if exists "deny anon medical_records" on public.medical_records;
drop policy if exists "deny auth medical_records" on public.medical_records;
create policy "deny anon medical_records" on public.medical_records
  for all to anon using (false) with check (false);
create policy "deny auth medical_records" on public.medical_records
  for all to authenticated using (false) with check (false);

drop policy if exists "deny anon appointments" on public.appointments;
drop policy if exists "deny auth appointments" on public.appointments;
create policy "deny anon appointments" on public.appointments
  for all to anon using (false) with check (false);
create policy "deny auth appointments" on public.appointments
  for all to authenticated using (false) with check (false);

drop policy if exists "deny anon prescriptions" on public.prescriptions;
drop policy if exists "deny auth prescriptions" on public.prescriptions;
create policy "deny anon prescriptions" on public.prescriptions
  for all to anon using (false) with check (false);
create policy "deny auth prescriptions" on public.prescriptions
  for all to authenticated using (false) with check (false);

drop policy if exists "deny anon medical_images" on public.medical_images;
drop policy if exists "deny auth medical_images" on public.medical_images;
create policy "deny anon medical_images" on public.medical_images
  for all to anon using (false) with check (false);
create policy "deny auth medical_images" on public.medical_images
  for all to authenticated using (false) with check (false);
