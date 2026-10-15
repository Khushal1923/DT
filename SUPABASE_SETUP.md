# Paw Care — Supabase Integration & Setup Guide

This guide walks you through connecting **Supabase** for user authentication and cloud database storage across all 12 pages of the **Paw Care** application.

---

## 🚀 1. Quick Start in 3 Steps

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **"New project"**, choose an organization, and name your project (e.g., `paw-care`).
3. Set a database password and select a region close to your users.
4. Click **"Create new project"**.

---

### Step 2: Run the Database Schema
1. In your Supabase dashboard, click on **"SQL Editor"** (terminal icon in the left menu).
2. Click **"New query"**.
3. Open [`schema.sql`](./schema.sql) from this project, copy its entire contents, paste it into the SQL Editor, and click **"Run"**.
4. This will create:
   - `public.profiles` (User metadata & roles: `owner`, `vet`)
   - `public.vets` (Veterinarian & clinic details)
   - `public.pets` (Companion profiles, allergies, history)
   - `public.appointments` (Bookings & status tracking)
   - `public.medical_records` (Clinical notes, prescriptions, vaccinations)
   - `public.reminders` (Medication, visit, and vaccine reminders)
   - `public.notification_preferences` (Email, SMS, push toggles)
   - Complete Row Level Security (RLS) policies for authenticated and demo access
   - Initial seed data matching all 12 PDF screens accurately.

---

### Step 3: Connect the Web App
1. In Supabase, go to **Project Settings** (gear icon) &rarr; **API**.
2. Copy your:
   - **Project URL** (e.g., `https://abcdefghijklm.supabase.co`)
   - **Project API Key (anon / public)** (e.g., `eyJhbGciOiJIUzI1NiIsIn...`)
3. Open any page of the Paw Care website (e.g., `index.html` or `signin.html`) in your browser.
4. Click the floating **"Supabase: Demo mode (Configure ⚙)"** pill in the bottom-left corner.
5. Paste your **Project URL** and **Anon Key**, click **"Test Connection"**, and then **"Save & Connect"**.
6. The status pill will turn green: **"Supabase: Connected"**!

---

## 🗄️ Database Tables Overview

| Table | Purpose | Connected Frontend Pages |
| :--- | :--- | :--- |
| `profiles` | User accounts (`owner` or `vet`), contact info, address | `signin.html`, `my-profile.html`, `overview.html` |
| `vets` | Veterinarians, clinic address, distance, availability, services | `index.html`, `vet-profile.html`, `book-appointment.html`, `overview.html` |
| `pets` | Pet profiles (species, breed, age, weight, allergies, past illness) | `pet-profile.html`, `overview.html`, `book-appointment.html`, `health-records.html` |
| `appointments` | Booking requests, time slots, clinic name, acceptance status | `book-appointment.html`, `booking-sent.html`, `vet-overview.html`, `reminders.html` |
| `medical_records` | Clinical notes, chief complaints, prescriptions, vaccines | `health-records.html`, `vet-consultation.html` |
| `reminders` | Active reminders, dosage schedules, booster due dates | `reminders.html`, `overview.html` |
| `notification_preferences` | Toggles for Email, SMS, Push, and Weekly digest | `reminders.html` |

---

## 🔐 Authentication & Roles

Paw Care supports two distinct workspaces:

1. **Pet Owner Workspace** (`role: 'owner'`):
   - Default demo credentials: `rohan.patil@example.com`
   - Access to `overview.html`, `pet-profile.html`, `my-profile.html`, `book-appointment.html`, `booking-sent.html`, `health-records.html`, `reminders.html`.
2. **Veterinarian Workspace** (`role: 'vet'`):
   - Default demo credentials: `anita.rao@companionclinic.com`
   - Access to `vet-overview.html`, `vet-consultation.html`, `vet-profile.html`.

Signing in via `signin.html` automatically authenticates with `supabase.auth.signInWithPassword` when connected, stores the session securely in browser storage, and routes the user to the correct workspace dashboard.

---

## 🛠️ Offline & Demo Mode Fallback

If Supabase credentials are not entered or if the user is testing offline, the application gracefully falls back to an in-memory/localStorage seed store pre-populated with identical data from `schema.sql`. 
- No pages crash.
- Form submissions (profile editing, booking, saving consultation notes) still work interactively.
- Clicking **"Configure ⚙"** allows instant live connection at any time.

---

## 📁 Architecture

- **`schema.sql`**: Complete PostgreSQL schema, table definitions, foreign keys, RLS policies, and seed data.
- **`supabase-client.js`**: Reusable Supabase service module initializing the JS client (`@supabase/supabase-js@2`), handling auth, profile management, and CRUD operations.
- **`script.js`**: Interactive event listeners connecting HTML forms, buttons, and switches to Supabase methods.
- **`style.css`**: Design system matching the Figma PDF export, including toast alerts and Supabase configuration modal.
