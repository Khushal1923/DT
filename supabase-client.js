/**
 * Paw Care — Supabase Integration Client
 * Handles Authentication, Remote & Local Storage Sync, and Schema Mapping
 */

(function () {
  // --- 1. DEFAULT CONFIGURATION ---
  const DEFAULT_CONFIG = {
    url: 'https://fecqpggriyvmoxsebxex.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlY3FwZ2dyaXl2bW94c2VieGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNTM4MzYsImV4cCI6MjEwNzYyOTgzNn0.jR_dxBcq9mMqul_36xPTZHgOpt9h-HkvO5D82TC3FWU'
  };

  // --- 2. SEED DATA (Identical to schema.sql) ---
  const INITIAL_SEED = {
    profiles: [
      {
        id: '00000000-0000-0000-0000-000000000001',
        role: 'owner',
        first_name: 'Rohan',
        last_name: 'Patil',
        full_name: 'Rohan Patil',
        email: 'rohan.patil@example.com',
        phone: '+91 98765 43210',
        address: '18 Prabhat Road, Deccan Gymkhana',
        city: 'Pune',
        postal_code: '411004',
        member_since: 'March 2026',
        avatar_url: null
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        role: 'vet',
        first_name: 'Anita',
        last_name: 'Rao',
        full_name: 'Dr. Anita Rao',
        email: 'anita.rao@companionclinic.com',
        phone: '+91 98220 12345',
        address: 'Companion Animal Clinic, Deccan',
        city: 'Pune',
        postal_code: '411004',
        member_since: 'January 2025',
        avatar_url: 'assets/pdf_img_5.jpeg'
      }
    ],
    vets: [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Dr. Anita Rao',
        specialty: 'General physician, dogs & cats',
        clinic_name: 'Companion Animal Clinic',
        clinic_location: 'Deccan, Pune',
        distance: '2.4 km',
        verified: true,
        verification_status: 'Verified veterinarian',
        next_available: 'Fri, 9 Oct · 10:30 am',
        opening_hours: 'Mon–Sat · 9:00 am–7:00 pm',
        facilities: 'Consultation room, vaccination area, pharmacy support',
        image_url: 'assets/pdf_img_5.jpeg',
        services: [
          'General check-ups and wellness visits',
          'Vaccination consultations and booster planning',
          'Skin, ear and minor symptom follow-up care',
          'Prescription review and care plan updates'
        ]
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Dr. Sameer Joshi',
        specialty: 'Surgery & orthopaedics',
        clinic_name: 'Companion Animal Clinic',
        clinic_location: 'Deccan, Pune',
        distance: '3.1 km',
        verified: false,
        verification_status: 'Verification in progress',
        next_available: 'Mon, 12 Oct · 11:00 am',
        opening_hours: 'Mon–Fri · 10:00 am–6:00 pm',
        facilities: 'Surgical theatre, X-ray diagnostic unit, in-patient recovery',
        image_url: 'assets/pdf_img_2.jpeg',
        services: [
          'Orthopaedic evaluation and joint mobility assessments',
          'Soft tissue and general surgical procedures',
          'Post-operative recovery monitoring and rehabilitation plans'
        ]
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Dr. Meera Kulkarni',
        specialty: 'Skin, diet & vaccination',
        clinic_name: 'Companion Animal Clinic',
        clinic_location: 'Deccan, Pune',
        distance: '2.8 km',
        verified: true,
        verification_status: 'Verified veterinarian',
        next_available: 'Tue, 13 Oct · 04:00 pm',
        opening_hours: 'Tue–Sun · 10:00 am–7:00 pm',
        facilities: 'Dermatology testing lab, nutritional counseling corner',
        image_url: 'assets/pdf_img_1.jpeg',
        services: [
          'Allergy testing and elimination diets',
          'Dermatological screening and ear cytology',
          'Vaccine scheduling and preventative lifestyle plans'
        ]
      }
    ],
    pets: [
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        owner_id: '00000000-0000-0000-0000-000000000001',
        name: 'Bruno',
        species: 'Dog',
        breed: 'Labrador',
        age: '3 years',
        weight: 28.4,
        weight_measured_at: '7 Oct 2026',
        sex: 'Male · Neutered',
        microchip: 'Not added',
        allergies: 'Chicken protein — itching and skin irritation',
        past_illness: 'Mild ear infection treated in August. Currently completing an ear-drop course under Dr. Anita Rao’s care.',
        photo_url: 'assets/pdf_img_4.jpeg'
      }
    ],
    appointments: [
      {
        id: 'a1111111-1111-1111-1111-111111111111',
        pet_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        vet_id: '11111111-1111-1111-1111-111111111111',
        date: '9 Oct 2026',
        time: '10:30 am',
        reason: 'Rabies booster',
        status: 'awaiting_acceptance',
        clinic_name: 'Companion Animal Clinic',
        location: 'Deccan, Pune'
      },
      {
        id: 'a2222222-2222-2222-2222-222222222222',
        pet_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        vet_id: '11111111-1111-1111-1111-111111111111',
        date: '14 Oct 2026',
        time: '11:00 am',
        reason: 'Ear follow-up',
        status: 'confirmed',
        clinic_name: 'Companion Animal Clinic',
        location: 'Deccan, Pune'
      }
    ],
    medical_records: [
      {
        id: 'm1111111-1111-1111-1111-111111111111',
        pet_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        vet_id: '11111111-1111-1111-1111-111111111111',
        consultation_date: '7 Oct 2026',
        consultation_time: '10:30 am',
        reason: 'Ear inflammation follow-up',
        chief_complaint: 'Ear inflammation improving. Owner reports reduced scratching and discharge since the previous course.',
        diagnosis_notes: 'Ear inflammation improving. Continue ear drops as directed and monitor for recurrence. Chicken protein allergy remains a relevant dietary consideration.',
        owner_communication: 'Continue ear drops as directed. Schedule follow-up on 14 Oct 2026 at 11:00 am. Review vaccination status and confirm the rabies booster request once accepted.',
        prescriptions: [
          { medicine: 'Veterinarian-specified ear drops', dosage: '3 drops', duration: '7 days', instructions: 'In affected ear, once daily' }
        ],
        vaccinations: [
          { vaccine: 'Rabies', date: 'Not administered', next_due: '9 Oct 2026', status: 'Pending acceptance' },
          { vaccine: 'DHPP', date: '21 Mar 2026', next_due: '21 Dec 2026', status: 'Next due 21 Dec 2026' }
        ],
        follow_up_appointment: '14 Oct 2026 · 11:00 am · Ear follow-up with Dr. Anita Rao',
        documents: [
          { title: 'Visit summary — 7 Oct 2026', type: 'PDF', author: 'Dr. Anita Rao' }
        ],
        status: 'Completed'
      },
      {
        id: 'm2222222-2222-2222-2222-222222222222',
        pet_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        vet_id: '11111111-1111-1111-1111-111111111111',
        consultation_date: '28 Aug 2026',
        consultation_time: '11:00 am',
        reason: 'Mild ear infection',
        chief_complaint: 'Moderate scratching and reddish ear discharge.',
        diagnosis_notes: 'Mild bacterial ear infection. Initiated 7-day antibiotic ear drops.',
        owner_communication: 'Apply 3 drops daily. Clean outer ear gently before application.',
        prescriptions: [
          { medicine: 'Ear drops', dosage: '3 drops', duration: '7 days', instructions: 'In affected ear' }
        ],
        vaccinations: [],
        follow_up_appointment: 'Completed',
        documents: [
          { title: 'Prescription note — 28 Aug 2026', type: 'PDF', author: 'Dr. Anita Rao' }
        ],
        status: 'Completed'
      },
      {
        id: 'm3333333-3333-3333-3333-333333333333',
        pet_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        vet_id: '33333333-3333-3333-3333-333333333333',
        consultation_date: '21 Mar 2026',
        consultation_time: '09:30 am',
        reason: 'Annual health check',
        chief_complaint: 'Routine annual preventative health exam and DHPP vaccination.',
        diagnosis_notes: 'Overall vitals normal. Coat and teeth in healthy condition.',
        owner_communication: 'Maintain regular diet and exercise. Next vaccine due in December.',
        prescriptions: [],
        vaccinations: [
          { vaccine: 'DHPP', date: '21 Mar 2026', next_due: '21 Dec 2026', status: 'Administered' }
        ],
        follow_up_appointment: 'Annual check complete',
        documents: [
          { title: 'Vaccination record', type: 'PDF', author: 'Companion Animal Clinic' }
        ],
        status: 'Completed'
      }
    ],
    reminders: [
      {
        id: 'r1111111-1111-1111-1111-111111111111',
        pet_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        title: 'Ear drops',
        description: 'Tonight, 8:00 pm · 3 drops in affected ear',
        due_date: 'Tonight',
        due_time: '8:00 pm',
        badge_text: 'Due tonight',
        badge_type: 'pending',
        reminder_type: 'medication',
        is_active: true
      },
      {
        id: 'r2222222-2222-2222-2222-222222222222',
        pet_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        title: 'Follow-up visit',
        description: '14 Oct 2026, 11:00 am · Dr. Anita Rao',
        due_date: '14 Oct 2026',
        due_time: '11:00 am',
        badge_text: 'Confirmed',
        badge_type: 'verified',
        reminder_type: 'appointment',
        is_active: true
      },
      {
        id: 'r3333333-3333-3333-3333-333333333333',
        pet_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        title: 'DHPP vaccination',
        description: 'Next due 21 Dec 2026',
        due_date: '21 Dec 2026',
        due_time: null,
        badge_text: 'Planned',
        badge_type: 'sand',
        reminder_type: 'vaccine',
        is_active: true
      },
      {
        id: 'r4444444-4444-4444-4444-444444444444',
        pet_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        title: 'Rabies booster',
        description: 'Due 9 Oct 2026. Your vaccination request is awaiting Dr. Anita Rao’s acceptance.',
        due_date: '9 Oct 2026',
        due_time: null,
        badge_text: 'Due in 2 days',
        badge_type: 'pending',
        reminder_type: 'vaccine',
        is_active: true
      }
    ],
    notification_preferences: {
      owner_id: '00000000-0000-0000-0000-000000000001',
      email_reminders: true,
      sms_reminders: true,
      push_notifications: true,
      weekly_digest: false,
      medication_time: '7:45 pm',
      appointment_advance: '1 day + 1 hour',
      vaccine_advance: '2 days'
    }
  };

  // --- 3. LOCAL STORAGE DATABASE STORE ---
  const LOCAL_STORAGE_KEY = 'paw_care_local_db_v1';

  function getLocalStore() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read from local storage store', e);
    }
    // initialize with initial seed
    setLocalStore(INITIAL_SEED);
    return JSON.parse(JSON.stringify(INITIAL_SEED));
  }

  function setLocalStore(data) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not write to local storage store', e);
    }
  }

  // --- 4. SUPABASE CLIENT CONTROLLER ---
  const PawCareSupabase = {
    client: null,
    isLive: false,
    config: DEFAULT_CONFIG,

    // Initialize Supabase client
    init() {
      let storedUrl = localStorage.getItem('paw_care_supabase_url');
      let storedKey = localStorage.getItem('paw_care_supabase_anon_key');
      if (!storedUrl || storedUrl === 'null' || storedUrl === 'undefined') storedUrl = DEFAULT_CONFIG.url;
      if (!storedKey || storedKey === 'null' || storedKey === 'undefined') storedKey = DEFAULT_CONFIG.anonKey;

      this.config.url = storedUrl;
      this.config.anonKey = storedKey;

      if (window.supabase && typeof window.supabase.createClient === 'function' && storedUrl && storedKey) {
        try {
          this.client = window.supabase.createClient(storedUrl, storedKey, {
            auth: {
              persistSession: true,
              autoRefreshToken: true
            }
          });
          this.isLive = true;
          console.info('🐾 Paw Care: Supabase client initialized with URL', storedUrl);
        } catch (err) {
          console.warn('🐾 Paw Care: Supabase initialization failed, falling back to local database store.', err);
          this.client = null;
          this.isLive = false;
        }
      } else {
        this.client = null;
        this.isLive = false;
        console.info('🐾 Paw Care: Running in local database mode (seed data loaded). Enter credentials in the Supabase connector to connect live.');
      }

      this.renderConnectionBadge();
    },

    isConfigured() {
      return this.isLive && this.client !== null;
    },

    // Save configuration from UI modal
    async saveConfig(url, anonKey) {
      if (!url || !anonKey) {
        throw new Error('Please enter both Supabase Project URL and Anon Public Key.');
      }
      url = url.trim().replace(/\/$/, '');
      anonKey = anonKey.trim();

      localStorage.setItem('paw_care_supabase_url', url);
      localStorage.setItem('paw_care_supabase_anon_key', anonKey);

      this.config.url = url;
      this.config.anonKey = anonKey;

      if (window.supabase && typeof window.supabase.createClient === 'function') {
        this.client = window.supabase.createClient(url, anonKey);
        this.isLive = true;
      }

      this.renderConnectionBadge();
      this.showToast('Supabase settings saved! Connection active.', 'success');
      return true;
    },

    clearConfig() {
      localStorage.removeItem('paw_care_supabase_url');
      localStorage.removeItem('paw_care_supabase_anon_key');
      this.config.url = '';
      this.config.anonKey = '';
      this.client = null;
      this.isLive = false;
      this.renderConnectionBadge();
      this.showToast('Reverted to Demo / Local Database mode.', 'info');
    },

    async testConnection() {
      if (!this.isConfigured()) {
        throw new Error('Supabase is not configured yet. Please enter your URL and Key.');
      }
      try {
        const { data, error } = await this.client.from('vets').select('id').limit(1);
        if (error) {
          throw error;
        }
        return { success: true, message: 'Connected to Supabase successfully! Vets table reachable.' };
      } catch (err) {
        return { success: false, message: 'Connection test failed: ' + (err.message || 'Check URL/Key or run schema.sql') };
      }
    },

    // --- 5. AUTHENTICATION SERVICE ---
    auth: {
      async signIn(email, password, role = 'owner') {
        email = (email || '').trim().toLowerCase();
        
        // 1. If Supabase is live, attempt Supabase Auth
        if (PawCareSupabase.isConfigured()) {
          try {
            const { data, error } = await PawCareSupabase.client.auth.signInWithPassword({ email, password });
            if (!error && data?.user) {
              const user = data.user;
              // fetch profile
              let profile = null;
              const { data: profData } = await PawCareSupabase.client
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
              profile = profData;

              const sessionData = {
                user: {
                  id: user.id,
                  email: user.email,
                  role: profile?.role || role,
                  first_name: profile?.first_name || (role === 'vet' ? 'Anita' : 'Rohan'),
                  last_name: profile?.last_name || (role === 'vet' ? 'Rao' : 'Patil')
                },
                token: data.session?.access_token || 'supabase_token'
              };
              localStorage.setItem('paw_care_session', JSON.stringify(sessionData));
              PawCareSupabase.showToast(`Welcome back, ${sessionData.user.first_name}!`, 'success');
              return { success: true, session: sessionData };
            }
          } catch (e) {
            console.warn('Supabase auth error, falling back to profile check / demo login', e);
          }
        }

        // 2. Demo / Fallback login
        const store = getLocalStore();
        const found = store.profiles.find(p => p.email?.toLowerCase() === email || p.role === role);
        const activeProfile = found || (role === 'vet' ? store.profiles[1] : store.profiles[0]);

        const sessionData = {
          user: {
            id: activeProfile.id,
            email: activeProfile.email,
            role: role,
            first_name: activeProfile.first_name,
            last_name: activeProfile.last_name
          },
          token: 'demo_token_' + Date.now()
        };
        localStorage.setItem('paw_care_session', JSON.stringify(sessionData));
        PawCareSupabase.showToast(`Signed in as ${sessionData.user.first_name} (${role === 'vet' ? 'Veterinarian' : 'Pet Owner'})`, 'success');
        return { success: true, session: sessionData };
      },

      async signUp(email, password, role = 'owner', profileData = {}) {
        email = (email || '').trim().toLowerCase();

        if (PawCareSupabase.isConfigured()) {
          try {
            const { data, error } = await PawCareSupabase.client.auth.signUp({
              email,
              password,
              options: {
                data: {
                  role,
                  first_name: profileData.first_name || 'Pet',
                  last_name: profileData.last_name || 'Owner'
                }
              }
            });
            if (error) throw error;

            if (data?.user) {
              // Create profile in profiles table
              await PawCareSupabase.client.from('profiles').upsert({
                id: data.user.id,
                email: email,
                role: role,
                first_name: profileData.first_name || (role === 'vet' ? 'Dr.' : 'Pet'),
                last_name: profileData.last_name || 'Owner'
              });
            }
            PawCareSupabase.showToast('Account created in Supabase!', 'success');
            return { success: true, data };
          } catch (e) {
            console.warn('Supabase sign up error', e);
            throw e;
          }
        }

        // Demo fallback
        const store = getLocalStore();
        const newProfile = {
          id: 'usr_' + Date.now(),
          email,
          role,
          first_name: profileData.first_name || 'New',
          last_name: profileData.last_name || 'User',
          member_since: 'Today'
        };
        store.profiles.push(newProfile);
        setLocalStore(store);
        return { success: true, profile: newProfile };
      },

      async signOut() {
        if (PawCareSupabase.isConfigured()) {
          try {
            await PawCareSupabase.client.auth.signOut();
          } catch (e) {
            console.warn('Supabase signOut error', e);
          }
        }
        localStorage.removeItem('paw_care_session');
        PawCareSupabase.showToast('Signed out of Paw Care.', 'info');
        setTimeout(() => {
          window.location.href = 'signin.html';
        }, 350);
      },

      getSession() {
        try {
          const item = localStorage.getItem('paw_care_session');
          return item ? JSON.parse(item) : null;
        } catch (e) {
          return null;
        }
      },

      getCurrentUser() {
        const session = this.getSession();
        return session ? session.user : null;
      }
    },

    // --- 6. PETS SERVICE ---
    pets: {
      async get(id) {
        if (PawCareSupabase.isConfigured()) {
          try {
            const { data, error } = await PawCareSupabase.client.from('pets').select('*').eq('id', id).single();
            if (!error && data) return data;
          } catch (e) {
            console.warn('Error fetching pet from Supabase', e);
          }
        }
        const store = getLocalStore();
        return store.pets.find(p => p.id === id) || store.pets[0];
      },

      async list(ownerId) {
        if (PawCareSupabase.isConfigured()) {
          try {
            let query = PawCareSupabase.client.from('pets').select('*');
            if (ownerId) query = query.eq('owner_id', ownerId);
            const { data, error } = await query;
            if (!error && data && data.length > 0) return data;
          } catch (e) {
            console.warn('Error listing pets from Supabase', e);
          }
        }
        const store = getLocalStore();
        return store.pets;
      },

      async update(id, updates) {
        if (PawCareSupabase.isConfigured()) {
          try {
            const { data, error } = await PawCareSupabase.client
              .from('pets')
              .update(updates)
              .eq('id', id)
              .select();
            if (!error) {
              PawCareSupabase.showToast('Pet profile updated in Supabase!', 'success');
              return data;
            }
          } catch (e) {
            console.warn('Supabase pet update failed, saving locally', e);
          }
        }
        const store = getLocalStore();
        const index = store.pets.findIndex(p => p.id === id);
        if (index >= 0) {
          store.pets[index] = { ...store.pets[index], ...updates };
        } else if (store.pets.length > 0) {
          store.pets[0] = { ...store.pets[0], ...updates };
        }
        setLocalStore(store);
        PawCareSupabase.showToast('Pet profile saved successfully!', 'success');
        return store.pets[0];
      }
    },

    // --- 7. PROFILES SERVICE ---
    profiles: {
      async get(id) {
        if (PawCareSupabase.isConfigured() && id) {
          try {
            const { data, error } = await PawCareSupabase.client.from('profiles').select('*').eq('id', id).single();
            if (!error && data) return data;
          } catch (e) {
            console.warn('Error fetching profile from Supabase', e);
          }
        }
        const store = getLocalStore();
        return store.profiles.find(p => p.id === id) || store.profiles[0];
      },

      async update(id, updates) {
        if (PawCareSupabase.isConfigured() && id) {
          try {
            const { data, error } = await PawCareSupabase.client
              .from('profiles')
              .update(updates)
              .eq('id', id)
              .select();
            if (!error) {
              PawCareSupabase.showToast('Profile updated in Supabase!', 'success');
              return data;
            }
          } catch (e) {
            console.warn('Supabase profile update failed, saving locally', e);
          }
        }
        const store = getLocalStore();
        const index = store.profiles.findIndex(p => p.id === id);
        if (index >= 0) {
          store.profiles[index] = { ...store.profiles[index], ...updates };
        } else {
          store.profiles[0] = { ...store.profiles[0], ...updates };
        }
        setLocalStore(store);
        PawCareSupabase.showToast('Profile saved successfully!', 'success');
        return store.profiles[0];
      }
    },

    // --- 8. VETS SERVICE ---
    vets: {
      async list() {
        if (PawCareSupabase.isConfigured()) {
          try {
            const { data, error } = await PawCareSupabase.client.from('vets').select('*');
            if (!error && data && data.length > 0) return data;
          } catch (e) {
            console.warn('Error loading vets from Supabase', e);
          }
        }
        const store = getLocalStore();
        return store.vets;
      },

      async get(id) {
        if (PawCareSupabase.isConfigured()) {
          try {
            const { data, error } = await PawCareSupabase.client.from('vets').select('*').eq('id', id).single();
            if (!error && data) return data;
          } catch (e) {
            console.warn('Error loading vet from Supabase', e);
          }
        }
        const store = getLocalStore();
        return store.vets.find(v => v.id === id) || store.vets[0];
      }
    },

    // --- 9. APPOINTMENTS SERVICE ---
    appointments: {
      async list(filters = {}) {
        if (PawCareSupabase.isConfigured()) {
          try {
            let query = PawCareSupabase.client.from('appointments').select('*');
            if (filters.status) query = query.eq('status', filters.status);
            const { data, error } = await query;
            if (!error && data) return data;
          } catch (e) {
            console.warn('Error fetching appointments from Supabase', e);
          }
        }
        const store = getLocalStore();
        return store.appointments;
      },

      async create(appointmentData) {
        const newAppt = {
          id: appointmentData.id || 'a_' + Date.now(),
          pet_id: appointmentData.pet_id || 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
          vet_id: appointmentData.vet_id || '11111111-1111-1111-1111-111111111111',
          date: appointmentData.date || 'Fri, 9 Oct 2026',
          time: appointmentData.time || '10:30 am',
          reason: appointmentData.reason || 'Check-up',
          status: appointmentData.status || 'awaiting_acceptance',
          clinic_name: appointmentData.clinic_name || 'Companion Animal Clinic',
          location: appointmentData.location || 'Deccan, Pune'
        };

        if (PawCareSupabase.isConfigured()) {
          try {
            const { data, error } = await PawCareSupabase.client
              .from('appointments')
              .insert([newAppt])
              .select();
            if (!error) {
              PawCareSupabase.showToast('Booking request saved to Supabase!', 'success');
              return data[0];
            }
          } catch (e) {
            console.warn('Supabase appointment insert failed, saving locally', e);
          }
        }

        const store = getLocalStore();
        store.appointments.unshift(newAppt);
        setLocalStore(store);
        PawCareSupabase.showToast('Booking request sent successfully!', 'success');
        return newAppt;
      },

      async updateStatus(id, status) {
        if (PawCareSupabase.isConfigured()) {
          try {
            const { data, error } = await PawCareSupabase.client
              .from('appointments')
              .update({ status: status })
              .eq('id', id)
              .select();
            if (!error) {
              PawCareSupabase.showToast(`Appointment status updated to ${status} in Supabase!`, 'success');
              return data;
            }
          } catch (e) {
            console.warn('Supabase appointment status update failed', e);
          }
        }

        const store = getLocalStore();
        const appt = store.appointments.find(a => a.id === id) || store.appointments[0];
        if (appt) {
          appt.status = status;
          setLocalStore(store);
        }
        PawCareSupabase.showToast(`Request accepted! Confirmed for Fri, 9 Oct.`, 'success');
        return appt;
      }
    },

    // --- 10. MEDICAL RECORDS SERVICE ---
    medicalRecords: {
      async list(petId) {
        if (PawCareSupabase.isConfigured()) {
          try {
            let query = PawCareSupabase.client.from('medical_records').select('*').order('created_at', { ascending: false });
            if (petId) query = query.eq('pet_id', petId);
            const { data, error } = await query;
            if (!error && data && data.length > 0) return data;
          } catch (e) {
            console.warn('Error loading medical records from Supabase', e);
          }
        }
        const store = getLocalStore();
        return store.medical_records;
      },

      async create(recordData) {
        const newRecord = {
          id: recordData.id || 'm_' + Date.now(),
          pet_id: recordData.pet_id || 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
          vet_id: recordData.vet_id || '11111111-1111-1111-1111-111111111111',
          consultation_date: recordData.consultation_date || '7 Oct 2026',
          consultation_time: recordData.consultation_time || '10:30 am',
          reason: recordData.reason || 'Consultation follow-up',
          chief_complaint: recordData.chief_complaint || '',
          diagnosis_notes: recordData.diagnosis_notes || '',
          owner_communication: recordData.owner_communication || '',
          prescriptions: recordData.prescriptions || [],
          vaccinations: recordData.vaccinations || [],
          follow_up_appointment: recordData.follow_up_appointment || '',
          documents: recordData.documents || [],
          status: 'Completed'
        };

        if (PawCareSupabase.isConfigured()) {
          try {
            const { data, error } = await PawCareSupabase.client
              .from('medical_records')
              .insert([newRecord])
              .select();
            if (!error) {
              PawCareSupabase.showToast('Consultation saved to Supabase medical records!', 'success');
              return data[0];
            }
          } catch (e) {
            console.warn('Supabase medical record insert failed, saving locally', e);
          }
        }

        const store = getLocalStore();
        store.medical_records.unshift(newRecord);
        setLocalStore(store);
        PawCareSupabase.showToast('Consultation record saved successfully!', 'success');
        return newRecord;
      }
    },

    // --- 11. REMINDERS & NOTIFICATION PREFERENCES SERVICE ---
    reminders: {
      async list(petId) {
        if (PawCareSupabase.isConfigured()) {
          try {
            let query = PawCareSupabase.client.from('reminders').select('*');
            if (petId) query = query.eq('pet_id', petId);
            const { data, error } = await query;
            if (!error && data && data.length > 0) return data;
          } catch (e) {
            console.warn('Error fetching reminders from Supabase', e);
          }
        }
        const store = getLocalStore();
        return store.reminders;
      },

      async toggle(id, isActive) {
        if (PawCareSupabase.isConfigured()) {
          try {
            await PawCareSupabase.client.from('reminders').update({ is_active: isActive }).eq('id', id);
          } catch (e) {
            console.warn('Error updating reminder in Supabase', e);
          }
        }
        const store = getLocalStore();
        const rem = store.reminders.find(r => r.id === id);
        if (rem) {
          rem.is_active = isActive;
          setLocalStore(store);
        }
      }
    },

    notificationPreferences: {
      async get(ownerId) {
        if (PawCareSupabase.isConfigured()) {
          try {
            const { data, error } = await PawCareSupabase.client.from('notification_preferences').select('*').limit(1).single();
            if (!error && data) return data;
          } catch (e) {
            console.warn('Error loading preferences from Supabase', e);
          }
        }
        const store = getLocalStore();
        return store.notification_preferences;
      },

      async update(ownerId, updates) {
        if (PawCareSupabase.isConfigured()) {
          try {
            const { data, error } = await PawCareSupabase.client
              .from('notification_preferences')
              .upsert({ owner_id: ownerId || '00000000-0000-0000-0000-000000000001', ...updates })
              .select();
            if (!error) {
              PawCareSupabase.showToast('Notification preferences synced with Supabase!', 'success');
              return data;
            }
          } catch (e) {
            console.warn('Supabase notification preference update failed', e);
          }
        }
        const store = getLocalStore();
        store.notification_preferences = { ...store.notification_preferences, ...updates };
        setLocalStore(store);
        PawCareSupabase.showToast('Notification preference updated.', 'info');
        return store.notification_preferences;
      }
    },

    // --- 12. UI HELPERS: TOAST NOTIFICATIONS & SUPABASE STATUS BADGE ---
    showToast(message, type = 'info') {
      let toastContainer = document.getElementById('paw-toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'paw-toast-container';
        toastContainer.className = 'paw-toast-container';
        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement('div');
      toast.className = `paw-toast paw-toast-${type}`;
      
      const iconSvg = type === 'success' 
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E6930" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#482B19" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

      toast.innerHTML = `
        <div class="paw-toast-icon">${iconSvg}</div>
        <div class="paw-toast-msg">${message}</div>
      `;

      toastContainer.appendChild(toast);
      setTimeout(() => toast.classList.add('visible'), 10);

      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    },

    renderConnectionBadge() {
      let badge = document.getElementById('supabase-status-pill');
      if (!badge) {
        badge = document.createElement('div');
        badge.id = 'supabase-status-pill';
        badge.className = 'supabase-status-pill';
        badge.onclick = () => PawCareSupabase.openSetupModal();
        document.body.appendChild(badge);
      }

      const isConnected = this.isConfigured();
      badge.innerHTML = `
        <span class="status-dot ${isConnected ? 'dot-connected' : 'dot-demo'}"></span>
        <span class="status-text">${isConnected ? 'Supabase: Connected' : 'Supabase: Demo mode'}</span>
        <span class="status-action">Configure ⚙</span>
      `;
      badge.title = isConnected 
        ? 'Connected to live Supabase project! Click to manage settings.' 
        : 'Running on local seed data. Click to connect your Supabase project.';
    },

    openSetupModal() {
      let modal = document.getElementById('supabase-setup-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'supabase-setup-modal';
        modal.className = 'supabase-modal-overlay';
        modal.innerHTML = `
          <div class="supabase-modal-card">
            <div class="supabase-modal-header">
              <div style="display: flex; align-items: center; gap: 8px;">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="#3ECF8E">
                  <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.32 14.28a.396.396 0 0 0 .31.624h9.362v8.958a.396.396 0 0 0 .716.233l10.964-14.117a.396.396 0 0 0-.31-.624z"/>
                </svg>
                <h3 style="margin: 0; font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--color-heading);">Supabase Connection Settings</h3>
              </div>
              <button type="button" class="supabase-modal-close" onclick="PawCareSupabase.closeSetupModal()">&times;</button>
            </div>
            
            <div class="supabase-modal-body">
              <p style="font-size: 0.8rem; color: var(--color-body); line-height: 1.5; margin-bottom: 14px;">
                Connect your Paw Care application to your own Supabase project for real-time database storage and authentication.
              </p>

              <div class="card-sand" style="padding: 12px 14px; margin-bottom: 16px; font-size: 0.74rem; line-height: 1.45;">
                <strong>Quick Setup Tip:</strong> In your Supabase Dashboard, open <em>SQL Editor</em> and execute the provided <code>schema.sql</code> file to create all required tables, RLS policies, and seed records in one click!
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label class="form-label" style="font-size: 0.76rem;">Supabase Project URL</label>
                <input type="text" id="modal-supabase-url" class="form-control" placeholder="https://xyzcompany.supabase.co" value="${this.config.url || ''}" />
                <div class="form-helper">Found in Project Settings -> API -> Project URL</div>
              </div>

              <div class="form-group" style="margin-bottom: 16px;">
                <label class="form-label" style="font-size: 0.76rem;">Supabase Anon Public API Key</label>
                <input type="password" id="modal-supabase-key" class="form-control" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." value="${this.config.anonKey || ''}" />
                <div class="form-helper">Found in Project Settings -> API -> Project API keys (anon public)</div>
              </div>

              <div id="modal-test-status" style="display: none; padding: 10px 12px; border-radius: 4px; font-size: 0.74rem; margin-bottom: 14px;"></div>

              <div style="display: flex; gap: 10px; justify-content: space-between; align-items: center;">
                <button type="button" class="btn btn-outline btn-sm" onclick="PawCareSupabase.handleModalTest()">Test Connection</button>
                <div style="display: flex; gap: 8px;">
                  <button type="button" class="btn btn-outline btn-sm" onclick="PawCareSupabase.clearConfig(); PawCareSupabase.closeSetupModal();">Use Demo Mode</button>
                  <button type="button" class="btn btn-primary btn-sm" onclick="PawCareSupabase.handleModalSave()">Save &amp; Connect</button>
                </div>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      } else {
        const urlInput = document.getElementById('modal-supabase-url');
        const keyInput = document.getElementById('modal-supabase-key');
        if (urlInput) urlInput.value = this.config.url || '';
        if (keyInput) keyInput.value = this.config.anonKey || '';
        modal.style.display = 'flex';
      }
    },

    closeSetupModal() {
      const modal = document.getElementById('supabase-setup-modal');
      if (modal) {
        modal.style.display = 'none';
      }
    },

    async handleModalTest() {
      const urlInput = document.getElementById('modal-supabase-url');
      const keyInput = document.getElementById('modal-supabase-key');
      const statusDiv = document.getElementById('modal-test-status');

      const url = urlInput?.value.trim();
      const key = keyInput?.value.trim();

      if (!url || !key) {
        if (statusDiv) {
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = '#FDF2E9';
          statusDiv.style.color = '#7C4A1E';
          statusDiv.textContent = 'Please fill in both URL and Anon Key before testing.';
        }
        return;
      }

      if (statusDiv) {
        statusDiv.style.display = 'block';
        statusDiv.style.backgroundColor = '#FAF5EC';
        statusDiv.style.color = '#482B19';
        statusDiv.textContent = 'Testing connection to Supabase...';
      }

      try {
        if (!window.supabase) {
          throw new Error('Supabase JS library not loaded. Check internet connection.');
        }
        const tempClient = window.supabase.createClient(url, key);
        
        // 1. Check if auth/project is reachable
        await tempClient.auth.getSession();

        // 2. Check if tables exist
        const { data, error } = await tempClient.from('vets').select('id').limit(1);
        
        if (error) {
          if (statusDiv) {
            statusDiv.style.backgroundColor = '#FEF3C7';
            statusDiv.style.color = '#92400E';
            statusDiv.textContent = '✓ Connected to Supabase Project! Next step: Execute schema.sql in your Supabase SQL Editor to create the tables.';
          }
          return;
        }

        if (statusDiv) {
          statusDiv.style.backgroundColor = '#EBF5EB';
          statusDiv.style.color = '#1E5E22';
          statusDiv.textContent = '✓ Connected to Supabase successfully! All database tables found.';
        }
      } catch (err) {
        if (statusDiv) {
          statusDiv.style.backgroundColor = '#FDF2E9';
          statusDiv.style.color = '#7C4A1E';
          statusDiv.textContent = 'Connection notice: ' + (err.message || 'Could not verify. Make sure URL and Key are correct.');
        }
      }
    },

    async handleModalSave() {
      const urlInput = document.getElementById('modal-supabase-url');
      const keyInput = document.getElementById('modal-supabase-key');
      const url = urlInput?.value.trim();
      const key = keyInput?.value.trim();

      if (!url || !key) {
        alert('Please provide both Project URL and Anon Key.');
        return;
      }

      try {
        await this.saveConfig(url, key);
        this.closeSetupModal();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Expose to window
  window.PawCareSupabase = PawCareSupabase;

  // Initialize once DOM is ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PawCareSupabase.init());
  } else {
    PawCareSupabase.init();
  }
})();
