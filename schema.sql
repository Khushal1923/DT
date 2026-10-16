-- ==========================================================================
-- Paw Care — Complete Supabase Database Schema & Seed Data
-- Run this in your Supabase Project: SQL Editor -> New Query -> Run
-- ==========================================================================

-- 1. Enable pgcrypto / uuid extensions (native in Supabase)
create extension if not exists "pgcrypto";

-- 2. Create User Profiles Table (Linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('owner', 'vet')) default 'owner',
  first_name text not null default 'Pet',
  last_name text not null default 'Owner',
  full_name text generated always as (first_name || ' ' || last_name) stored,
  email text unique,
  phone text default '+91 98765 43210',
  address text default '18 Prabhat Road, Deccan Gymkhana',
  city text default 'Pune',
  postal_code text default '411004',
  member_since text default 'March 2026',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Create Veterinarians & Clinics Table
create table if not exists public.vets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  specialty text not null,
  clinic_name text not null default 'Companion Animal Clinic',
  clinic_location text not null default 'Deccan, Pune',
  distance text default '2.4 km',
  verified boolean default true,
  verification_status text default 'Verified veterinarian',
  next_available text default 'Fri, 9 Oct · 10:30 am',
  opening_hours text default 'Mon–Sat · 9:00 am–7:00 pm',
  facilities text default 'Consultation room, vaccination area, pharmacy support',
  image_url text,
  services jsonb default '[
    "General check-ups and wellness visits",
    "Vaccination consultations and booster planning",
    "Skin, ear and minor symptom follow-up care",
    "Prescription review and care plan updates"
  ]'::jsonb,
  created_at timestamptz default now()
);

-- 4. Create Pets Table
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  species text not null default 'Dog',
  breed text default 'Labrador',
  age text default '3 years',
  weight numeric(4,1) default 28.4,
  weight_measured_at text default '7 Oct 2026',
  sex text default 'Male · Neutered',
  microchip text default 'Not added',
  allergies text default 'Chicken protein — itching and skin irritation',
  past_illness text default 'Mild ear infection treated in August. Currently completing an ear-drop course under Dr. Anita Rao''s care.',
  photo_url text default 'assets/pdf_img_4.jpeg',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Create Appointments / Bookings Table
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete cascade,
  vet_id uuid references public.vets(id) on delete set null,
  date text not null,
  time text not null,
  reason text not null,
  status text check (status in ('awaiting_acceptance', 'confirmed', 'completed', 'cancelled')) default 'awaiting_acceptance',
  clinic_name text default 'Companion Animal Clinic',
  location text default 'Deccan, Pune',
  created_at timestamptz default now()
);

-- 6. Create Medical Records & Consultations Table
create table if not exists public.medical_records (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade,
  vet_id uuid references public.vets(id) on delete set null,
  consultation_date text not null,
  consultation_time text default '10:30 am',
  reason text not null default 'Ear inflammation follow-up',
  chief_complaint text,
  diagnosis_notes text,
  owner_communication text,
  prescriptions jsonb default '[]'::jsonb,
  vaccinations jsonb default '[]'::jsonb,
  follow_up_appointment text,
  documents jsonb default '[]'::jsonb,
  status text default 'Completed',
  created_at timestamptz default now()
);

-- 7. Create Reminders Table
create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete cascade,
  title text not null,
  description text,
  due_date text,
  due_time text,
  badge_text text,
  badge_type text default 'pending', -- 'pending' | 'verified' | 'sand'
  reminder_type text default 'medication', -- 'medication' | 'appointment' | 'vaccine'
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 8. Create Notification Preferences Table
create table if not exists public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade unique,
  email_reminders boolean default true,
  sms_reminders boolean default true,
  push_notifications boolean default true,
  weekly_digest boolean default false,
  medication_time text default '7:45 pm',
  appointment_advance text default '1 day + 1 hour',
  vaccine_advance text default '2 days',
  updated_at timestamptz default now()
);

-- ==========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================================

alter table public.profiles enable row level security;
alter table public.vets enable row level security;
alter table public.pets enable row level security;
alter table public.appointments enable row level security;
alter table public.medical_records enable row level security;
alter table public.reminders enable row level security;
alter table public.notification_preferences enable row level security;

-- Drop existing policies if any (ensures rerunning never fails)
drop policy if exists "Allow public read access to vets" on public.vets;
drop policy if exists "Allow public read access to pets" on public.pets;
drop policy if exists "Allow public read access to profiles" on public.profiles;
drop policy if exists "Allow public read access to appointments" on public.appointments;
drop policy if exists "Allow public read access to medical records" on public.medical_records;
drop policy if exists "Allow public read access to reminders" on public.reminders;
drop policy if exists "Allow public read access to notification preferences" on public.notification_preferences;

drop policy if exists "Allow full access for authenticated users to own profile" on public.profiles;
drop policy if exists "Allow owners to insert/update pets" on public.pets;
drop policy if exists "Allow creating and updating appointments" on public.appointments;
drop policy if exists "Allow creating and updating medical records" on public.medical_records;
drop policy if exists "Allow updating notification preferences" on public.notification_preferences;
drop policy if exists "Allow managing reminders" on public.reminders;

-- Create read access policies
create policy "Allow public read access to vets" on public.vets for select using (true);
create policy "Allow public read access to pets" on public.pets for select using (true);
create policy "Allow public read access to profiles" on public.profiles for select using (true);
create policy "Allow public read access to appointments" on public.appointments for select using (true);
create policy "Allow public read access to medical records" on public.medical_records for select using (true);
create policy "Allow public read access to reminders" on public.reminders for select using (true);
create policy "Allow public read access to notification preferences" on public.notification_preferences for select using (true);

-- Authenticated owner / vet full control policies
create policy "Allow full access for authenticated users to own profile" on public.profiles
  for all using (auth.uid() = id or auth.uid() is null);

create policy "Allow owners to insert/update pets" on public.pets
  for all using (true) with check (true);

create policy "Allow creating and updating appointments" on public.appointments
  for all using (true) with check (true);

create policy "Allow creating and updating medical records" on public.medical_records
  for all using (true) with check (true);

create policy "Allow updating notification preferences" on public.notification_preferences
  for all using (true) with check (true);

create policy "Allow managing reminders" on public.reminders
  for all using (true) with check (true);

-- ==========================================================================
-- SEED DATA (Valid Hex UUIDs matching all 12 PDF screens accurately)
-- ==========================================================================

-- Seed Vets
insert into public.vets (id, name, specialty, clinic_name, clinic_location, distance, verified, verification_status, next_available, image_url)
values 
  ('11111111-1111-1111-1111-111111111111', 'Dr. Anita Rao', 'General physician, dogs & cats', 'Companion Animal Clinic', 'Deccan, Pune', '2.4 km', true, 'Verified veterinarian', 'Fri, 9 Oct · 10:30 am', 'assets/pdf_img_5.jpeg'),
  ('22222222-2222-2222-2222-222222222222', 'Dr. Sameer Joshi', 'Surgery & orthopaedics', 'Companion Animal Clinic', 'Deccan, Pune', '3.1 km', false, 'Verification in progress', 'Mon, 12 Oct · 11:00 am', 'assets/pdf_img_2.jpeg'),
  ('33333333-3333-3333-3333-333333333333', 'Dr. Meera Kulkarni', 'Skin, diet & vaccination', 'Companion Animal Clinic', 'Deccan, Pune', '2.8 km', true, 'Verified veterinarian', 'Tue, 13 Oct · 04:00 pm', 'assets/pdf_img_1.jpeg')
on conflict (id) do nothing;

-- Seed Demo Pet (Bruno)
insert into public.pets (id, name, species, breed, age, weight, weight_measured_at, sex, microchip, allergies, past_illness, photo_url)
values (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Bruno',
  'Dog',
  'Labrador',
  '3 years',
  28.4,
  '7 Oct 2026',
  'Male · Neutered',
  'Not added',
  'Chicken protein — itching and skin irritation',
  'Mild ear infection treated in August. Currently completing an ear-drop course under Dr. Anita Rao''s care.',
  'assets/pdf_img_4.jpeg'
) on conflict (id) do nothing;

-- Seed Appointments
insert into public.appointments (id, pet_id, vet_id, date, time, reason, status, clinic_name, location)
values 
  (
    'a1111111-1111-1111-1111-111111111111',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    '9 Oct 2026',
    '10:30 am',
    'Rabies booster',
    'awaiting_acceptance',
    'Companion Animal Clinic',
    'Deccan, Pune'
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    '14 Oct 2026',
    '11:00 am',
    'Ear follow-up',
    'confirmed',
    'Companion Animal Clinic',
    'Deccan, Pune'
  )
on conflict (id) do nothing;

-- Seed Medical Records (UUID hex prefix c)
insert into public.medical_records (id, pet_id, vet_id, consultation_date, consultation_time, reason, chief_complaint, diagnosis_notes, owner_communication, prescriptions, vaccinations, follow_up_appointment, documents, status)
values 
  (
    'c1111111-1111-1111-1111-111111111111',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    '7 Oct 2026',
    '10:30 am',
    'Ear inflammation follow-up',
    'Ear inflammation improving. Owner reports reduced scratching and discharge since the previous course.',
    'Ear inflammation improving. Continue ear drops as directed and monitor for recurrence. Chicken protein allergy remains a relevant dietary consideration.',
    'Continue ear drops as directed. Schedule follow-up on 14 Oct 2026 at 11:00 am. Review vaccination status and confirm the rabies booster request once accepted.',
    '[{"medicine": "Veterinarian-specified ear drops", "dosage": "3 drops", "duration": "7 days", "instructions": "In affected ear, once daily"}]'::jsonb,
    '[{"vaccine": "Rabies", "date": "Not administered", "next_due": "9 Oct 2026", "status": "Pending acceptance"}, {"vaccine": "DHPP", "date": "21 Mar 2026", "next_due": "21 Dec 2026", "status": "Next due 21 Dec 2026"}]'::jsonb,
    '14 Oct 2026 · 11:00 am · Ear follow-up with Dr. Anita Rao',
    '[{"title": "Visit summary — 7 Oct 2026", "type": "PDF", "author": "Dr. Anita Rao"}]'::jsonb,
    'Completed'
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    '28 Aug 2026',
    '11:00 am',
    'Mild ear infection',
    'Moderate scratching and reddish ear discharge.',
    'Mild bacterial ear infection. Initiated 7-day antibiotic ear drops.',
    'Apply 3 drops daily. Clean outer ear gently before application.',
    '[{"medicine": "Ear drops", "dosage": "3 drops", "duration": "7 days", "instructions": "In affected ear"}]'::jsonb,
    '[]'::jsonb,
    'Completed',
    '[{"title": "Prescription note — 28 Aug 2026", "type": "PDF", "author": "Dr. Anita Rao"}]'::jsonb,
    'Completed'
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '33333333-3333-3333-3333-333333333333',
    '21 Mar 2026',
    '09:30 am',
    'Annual health check',
    'Routine annual preventative health exam and DHPP vaccination.',
    'Overall vitals normal. Coat and teeth in healthy condition.',
    'Maintain regular diet and exercise. Next vaccine due in December.',
    '[]'::jsonb,
    '[{"vaccine": "DHPP", "date": "21 Mar 2026", "next_due": "21 Dec 2026", "status": "Administered"}]'::jsonb,
    'Annual check complete',
    '[{"title": "Vaccination record", "type": "PDF", "author": "Companion Animal Clinic"}]'::jsonb,
    'Completed'
  )
on conflict (id) do nothing;

-- Seed Reminders (UUID hex prefix d)
insert into public.reminders (id, pet_id, title, description, due_date, due_time, badge_text, badge_type, reminder_type)
values 
  (
    'd1111111-1111-1111-1111-111111111111',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Ear drops',
    'Tonight, 8:00 pm · 3 drops in affected ear',
    'Tonight',
    '8:00 pm',
    'Due tonight',
    'pending',
    'medication'
  ),
  (
    'd2222222-2222-2222-2222-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Follow-up visit',
    '14 Oct 2026, 11:00 am · Dr. Anita Rao',
    '14 Oct 2026',
    '11:00 am',
    'Confirmed',
    'verified',
    'appointment'
  ),
  (
    'd3333333-3333-3333-3333-333333333333',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'DHPP vaccination',
    'Next due 21 Dec 2026',
    '21 Dec 2026',
    null,
    'Planned',
    'sand',
    'vaccine'
  ),
  (
    'd4444444-4444-4444-4444-444444444444',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Rabies booster',
    'Due 9 Oct 2026. Your vaccination request is awaiting Dr. Anita Rao''s acceptance.',
    '9 Oct 2026',
    null,
    'Due in 2 days',
    'pending',
    'vaccine'
  )
on conflict (id) do nothing;
