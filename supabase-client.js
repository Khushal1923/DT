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
        first_name: 'Pet',
        last_name: 'Owner',
        full_name: 'Pet Owner',
        username: 'owner',
        email: 'owner@example.com',
        password: 'password123',
        phone: '+91 98765 43210',
        address: '18 Prabhat Road, Deccan Gymkhana',
        city: 'Pune',
        postal_code: '411004',
        member_since: 'March 2026',
        avatar_url: null,
        profile_completed: true
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        role: 'vet',
        first_name: 'Anita',
        last_name: 'Rao',
        full_name: 'Dr. Anita Rao',
        email: 'anita.rao@companionclinic.com',
        username: 'anita',
        password: 'password123',
        phone: '+91 98220 12345',
        address: 'Companion Animal Clinic, Deccan',
        city: 'Pune',
        postal_code: '411004',
        member_since: 'January 2025',
        avatar_url: 'assets/pdf_img_5.jpeg',
        profile_completed: true
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
        id: 'c1111111-1111-1111-1111-111111111111',
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
        id: 'c2222222-2222-2222-2222-222222222222',
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
        id: 'c3333333-3333-3333-3333-333333333333',
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
        id: 'd1111111-1111-1111-1111-111111111111',
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
        id: 'd2222222-2222-2222-2222-222222222222',
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
        id: 'd3333333-3333-3333-3333-333333333333',
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
        id: 'd4444444-4444-4444-4444-444444444444',
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

  function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getLocalStore() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && Array.isArray(parsed.profiles)) {
          let modified = false;
          parsed.profiles.forEach(p => {
            if (p.first_name === 'Rohan' && p.last_name === 'Patil') {
              p.first_name = 'Pet';
              p.last_name = 'Owner';
              p.full_name = 'Pet Owner';
              p.username = 'owner';
              p.email = 'owner@example.com';
              p.password = 'password123';
              modified = true;
            }
            if (!p.password) {
              p.password = 'password123';
              modified = true;
            }
          });
          if (modified) {
            setLocalStore(parsed);
          }
        }
        return parsed;
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
    generateUUID: generateUUID,

    // Initialize Supabase client
    init() {
      // Clean up any legacy 'Rohan' values
      const legacyName = localStorage.getItem('pawcare_display_name');
      if (legacyName && (legacyName.trim() === 'Rohan Patil' || legacyName.trim() === 'Rohan')) {
        localStorage.removeItem('pawcare_display_name');
      }
      const legacyEmail = localStorage.getItem('pawcare_email');
      if (legacyEmail && legacyEmail.includes('rohan.patil')) {
        localStorage.removeItem('pawcare_email');
      }
      const legacySession = localStorage.getItem('paw_care_session');
      if (legacySession && legacySession.includes('Rohan')) {
        try {
          const s = JSON.parse(legacySession);
          if (s.user && (s.user.first_name === 'Rohan' || s.user.email === 'rohan.patil@example.com')) {
            s.user.first_name = 'Pet';
            s.user.last_name = 'Owner';
            s.user.full_name = 'Pet Owner';
            s.user.email = 'owner@example.com';
            localStorage.setItem('paw_care_session', JSON.stringify(s));
          }
        } catch (e) {}
      }

      const url = DEFAULT_CONFIG.url;
      const key = DEFAULT_CONFIG.anonKey;

      this.config.url = url;
      this.config.anonKey = key;

      // Ensure any existing status pill or setup modal is removed
      const oldBadge = document.getElementById('supabase-status-pill');
      if (oldBadge) oldBadge.remove();
      const oldModal = document.getElementById('supabase-setup-modal');
      if (oldModal) oldModal.remove();

      if (window.supabase && typeof window.supabase.createClient === 'function' && url && key) {
        try {
          this.client = window.supabase.createClient(url, key, {
            auth: {
              persistSession: true,
              autoRefreshToken: true
            }
          });
          this.isLive = true;
          console.info('🐾 Paw Care: Supabase client connected to', url);
        } catch (err) {
          console.warn('🐾 Paw Care: Supabase initialization failed, falling back to local database store.', err);
          this.client = null;
          this.isLive = false;
        }
      } else {
        this.client = null;
        this.isLive = false;
      }
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
      async signIn(identifier, password, role = 'owner') {
        identifier = (identifier || '').trim();
        password = (password || '').trim();
        const lowerIdent = identifier.toLowerCase();
        
        if (!identifier) {
          return { success: false, error: 'Please enter your username or email address.' };
        }
        if (!password) {
          return { success: false, error: 'Please enter your password.' };
        }

        // 1. If Supabase is live, attempt Supabase Auth if identifier is an email
        if (PawCareSupabase.isConfigured() && lowerIdent.includes('@')) {
          try {
            const { data, error } = await PawCareSupabase.client.auth.signInWithPassword({ email: lowerIdent, password });
            if (error) {
              console.info('Supabase remote auth notice:', error.message, '- falling back to check registered local profiles');
            } else if (data?.user) {
              const user = data.user;
              // fetch profile
              let profile = null;
              const { data: profData } = await PawCareSupabase.client
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
              profile = profData;

              const fName = profile?.first_name || (role === 'vet' ? 'Anita' : 'Pet');
              const lName = profile?.last_name || (role === 'vet' ? 'Rao' : 'Owner');
              const fullName = profile?.full_name || `${fName} ${lName}`.trim();

              const sessionData = {
                user: {
                  id: user.id,
                  email: user.email,
                  username: profile?.username || user.email.split('@')[0],
                  role: profile?.role || role,
                  first_name: fName,
                  last_name: lName,
                  full_name: fullName
                },
                token: data.session?.access_token || 'supabase_token'
              };
              localStorage.setItem('paw_care_session', JSON.stringify(sessionData));
              localStorage.setItem('pawcare_display_name', fullName);
              localStorage.setItem('pawcare_email', user.email);
              localStorage.setItem('pawcare_role', sessionData.user.role);
              PawCareSupabase.showToast(`Welcome back, ${fName}!`, 'success');
              return { success: true, session: sessionData };
            }
          } catch (e) {
            console.warn('Supabase auth network error, checking local store', e);
          }
        }

        // 2. Local database store lookup with real credential validation
        const store = getLocalStore();
        
        // Find existing profile by email, username, or full name
        let found = store.profiles.find(p => 
          (p.email && p.email.toLowerCase() === lowerIdent) ||
          (p.username && p.username.toLowerCase() === lowerIdent) ||
          (p.full_name && p.full_name.toLowerCase() === lowerIdent)
        );

        if (!found) {
          return {
            success: false,
            error: 'No account found with this username or email. Please check your credentials or click "Create an account" below.'
          };
        }

        // Validate Password
        const storedPassword = found.password || 'password123';
        if (password !== storedPassword) {
          return {
            success: false,
            error: 'Incorrect password. Please verify your password and try again.'
          };
        }

        // Validate Role match
        if (role && found.role && found.role !== role) {
          return {
            success: false,
            error: `This account is registered as a ${found.role === 'vet' ? 'Veterinarian' : 'Pet Owner'}. Please switch tabs to log in.`
          };
        }

        // Ensure this owner has an associated pet in store
        const hasPet = store.pets.some(p => p.owner_id === found.id);
        const isCompleted = found.profile_completed === true || (found.id === '00000000-0000-0000-0000-000000000001') || (found.role === 'owner' && hasPet) || (found.role === 'vet');

        const fullName = found.full_name || `${found.first_name || ''} ${found.last_name || ''}`.trim() || identifier;
        const sessionData = {
          user: {
            id: found.id,
            email: found.email || '',
            username: found.username || identifier,
            role: found.role || role,
            first_name: found.first_name || identifier,
            last_name: found.last_name || '',
            full_name: fullName,
            profile_completed: isCompleted
          },
          token: 'token_' + Date.now()
        };

        localStorage.setItem('paw_care_session', JSON.stringify(sessionData));
        localStorage.setItem('pawcare_display_name', fullName);
        localStorage.setItem('pawcare_email', sessionData.user.email);
        localStorage.setItem('pawcare_role', sessionData.user.role);

        // Set or clear pet keys based on whether user has an existing pet
        const userPet = store.pets.find(p => p.owner_id === found.id);
        if (userPet) {
          localStorage.setItem('pawcare_pet_name', userPet.name);
          localStorage.setItem('pawcare_pet_breed', `${userPet.breed}${userPet.age ? ' · ' + userPet.age : ''}`);
        } else if (found.id !== '00000000-0000-0000-0000-000000000001') {
          localStorage.removeItem('pawcare_pet_name');
          localStorage.removeItem('pawcare_pet_breed');
        }

        PawCareSupabase.showToast(`Signed in as ${sessionData.user.first_name}!`, 'success');
        return { success: true, session: sessionData };
      },

      async signUp(identifier, password, role = 'owner', profileData = {}) {
        identifier = (identifier || '').trim();
        password = (password || '').trim();
        const lowerIdent = identifier.toLowerCase();
        const fullName = profileData.full_name || `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
        const parts = fullName ? fullName.split(/\s+/) : [];
        const firstName = profileData.first_name || parts[0] || identifier.charAt(0).toUpperCase() + identifier.slice(1);
        const lastName = profileData.last_name !== undefined ? profileData.last_name : parts.slice(1).join(' ');
        const finalFullName = `${firstName} ${lastName}`.trim();

        if (!identifier) {
          return { success: false, error: 'Please enter a username or email.' };
        }
        if (!password || password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters long.' };
        }

        const store = getLocalStore();
        let existing = store.profiles.find(p => 
          (p.email && p.email.toLowerCase() === lowerIdent) ||
          (p.username && p.username.toLowerCase() === lowerIdent)
        );

        if (existing) {
          return {
            success: false,
            error: 'An account with this username or email already exists. Please sign in instead.'
          };
        }

        if (PawCareSupabase.isConfigured() && lowerIdent.includes('@')) {
          try {
            const { data, error } = await PawCareSupabase.client.auth.signUp({
              email: lowerIdent,
              password,
              options: {
                data: {
                  role,
                  first_name: firstName,
                  last_name: lastName,
                  full_name: finalFullName,
                  username: identifier
                }
              }
            });
            if (error) {
              console.warn('Supabase sign up error:', error.message);
              return { success: false, error: error.message };
            }

            if (data?.user) {
              await PawCareSupabase.client.from('profiles').upsert({
                id: data.user.id,
                email: lowerIdent,
                role: role,
                first_name: firstName,
                last_name: lastName,
                username: identifier
              });
            }
            const hasSession = !!data?.session;
            if (hasSession) {
              const sessionData = {
                user: {
                  id: data.user.id,
                  email: data.user.email,
                  username: identifier,
                  role: role,
                  first_name: firstName,
                  last_name: lastName,
                  full_name: finalFullName,
                  profile_completed: false
                },
                token: data.session.access_token
              };
              localStorage.setItem('paw_care_session', JSON.stringify(sessionData));
              localStorage.setItem('pawcare_display_name', finalFullName);
              localStorage.setItem('pawcare_email', lowerIdent);
              localStorage.setItem('pawcare_role', role);
              localStorage.removeItem('pawcare_pet_name');
              localStorage.removeItem('pawcare_pet_breed');
              localStorage.removeItem('pawcare_phone');
            }
            PawCareSupabase.showToast('Account created in Supabase!', 'success');
            return { success: true, data, requiresEmailConfirmation: !hasSession };
          } catch (e) {
            console.warn('Supabase sign up error, continuing with local store', e);
          }
        }

        // Local store registration
        const newProfile = {
          id: generateUUID(),
          role: role,
          username: identifier,
          password: password,
          first_name: firstName,
          last_name: lastName,
          full_name: finalFullName,
          email: lowerIdent.includes('@') ? lowerIdent : `${lowerIdent}@pawcare.local`,
          phone: '',
          address: '',
          city: '',
          postal_code: '',
          member_since: 'October 2026',
          avatar_url: null,
          profile_completed: false
        };

        store.profiles.push(newProfile);
        // Note: We do NOT auto-create a mock pet for new users, so they can enter their own pet's details in Step 2.
        setLocalStore(store);

        const sessionData = {
          user: {
            id: newProfile.id,
            email: newProfile.email,
            username: newProfile.username || identifier,
            role: role,
            first_name: newProfile.first_name,
            last_name: newProfile.last_name,
            full_name: newProfile.full_name,
            profile_completed: false
          },
          token: 'token_' + Date.now()
        };
        localStorage.setItem('paw_care_session', JSON.stringify(sessionData));
        localStorage.setItem('pawcare_display_name', newProfile.full_name);
        localStorage.setItem('pawcare_email', newProfile.email);
        localStorage.setItem('pawcare_role', role);
        localStorage.removeItem('pawcare_pet_name');
        localStorage.removeItem('pawcare_pet_breed');
        localStorage.removeItem('pawcare_phone');

        return { success: true, profile: newProfile, requiresEmailConfirmation: false };
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
        localStorage.removeItem('pawcare_display_name');
        localStorage.removeItem('pawcare_email');
        localStorage.removeItem('pawcare_role');
        localStorage.removeItem('pawcare_last_appointment');
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
        if (PawCareSupabase.isConfigured() && id) {
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

      async getForOwner(ownerId) {
        const currentUser = PawCareSupabase.auth.getCurrentUser();
        const targetOwnerId = ownerId || currentUser?.id;

        if (PawCareSupabase.isConfigured() && targetOwnerId) {
          try {
            const { data, error } = await PawCareSupabase.client
              .from('pets')
              .select('*')
              .eq('owner_id', targetOwnerId)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            if (!error && data) return data;
          } catch (e) {
            console.warn('Error fetching owner pet from Supabase', e);
          }
        }

        const store = getLocalStore();
        if (targetOwnerId) {
          const found = store.pets.find(p => p.owner_id === targetOwnerId);
          if (found) return found;
        }

        // Only return default demo pet if targetOwnerId is the demo owner ID, or no owner specified
        if (!targetOwnerId || targetOwnerId === '00000000-0000-0000-0000-000000000001') {
          return store.pets[0] || null;
        }

        // For newly registered accounts that haven't created a pet yet, return null
        return null;
      },

      async saveForOwner(ownerId, petData) {
        const currentUser = PawCareSupabase.auth.getCurrentUser();
        const targetOwnerId = ownerId || currentUser?.id || '00000000-0000-0000-0000-000000000001';

        const store = getLocalStore();
        let existingIndex = store.pets.findIndex(p => p.owner_id === targetOwnerId);
        let petId = existingIndex >= 0 ? store.pets[existingIndex].id : generateUUID();
        const existingPet = existingIndex >= 0 ? store.pets[existingIndex] : null;

        const petName = petData.name && petData.name.trim() ? petData.name.trim() : (existingPet ? existingPet.name : 'My Companion');
        const petSpecies = petData.species || (existingPet ? existingPet.species : 'Dog');
        const petBreed = petData.breed && petData.breed.trim() ? petData.breed.trim() : (existingPet ? existingPet.breed : 'Companion');
        const petAge = petData.age && petData.age.trim() ? petData.age.trim() : (existingPet ? existingPet.age : '');
        const petWeight = (petData.weight !== undefined && petData.weight !== '' && !isNaN(parseFloat(petData.weight))) ? parseFloat(petData.weight) : (existingPet ? existingPet.weight : 0);
        const petSex = petData.sex || (existingPet ? existingPet.sex : 'Male · Neutered');
        const petMicrochip = petData.microchip && petData.microchip.trim() ? petData.microchip.trim() : 'Not added';
        const petAllergies = petData.allergies && petData.allergies.trim() ? petData.allergies.trim() : 'None reported';
        const petIllness = petData.past_illness && petData.past_illness.trim() ? petData.past_illness.trim() : 'None';
        const defaultPhoto = petSpecies === 'Cat' ? 'assets/cat.jpg' : 'assets/pdf_img_4.jpeg';
        const petPhoto = petData.photo_url || (existingPet ? existingPet.photo_url : defaultPhoto);

        const fullPetRecord = {
          id: petId,
          owner_id: targetOwnerId,
          name: petName,
          species: petSpecies,
          breed: petBreed,
          age: petAge,
          weight: petWeight,
          weight_measured_at: 'Today',
          sex: petSex,
          microchip: petMicrochip,
          allergies: petAllergies,
          past_illness: petIllness,
          photo_url: petPhoto
        };

        if (PawCareSupabase.isConfigured()) {
          try {
            const { data, error } = await PawCareSupabase.client
              .from('pets')
              .upsert(fullPetRecord)
              .select();
            if (!error && data) {
              PawCareSupabase.showToast('Pet profile synced to Supabase!', 'success');
            }
          } catch (e) {
            console.warn('Supabase pet save failed, stored locally', e);
          }
        }

        if (existingIndex >= 0) {
          store.pets[existingIndex] = { ...store.pets[existingIndex], ...fullPetRecord };
        } else {
          store.pets.unshift(fullPetRecord);
        }

        // Mark profile as completed on owner profile
        const pIndex = store.profiles.findIndex(p => p.id === targetOwnerId);
        if (pIndex >= 0) {
          store.profiles[pIndex].profile_completed = true;
        }

        // Update active session user
        const session = PawCareSupabase.auth.getSession();
        if (session && session.user && (session.user.id === targetOwnerId || !session.user.id)) {
          session.user.profile_completed = true;
          localStorage.setItem('paw_care_session', JSON.stringify(session));
        }

        setLocalStore(store);

        // Also save convenient helper keys in localStorage
        localStorage.setItem('pawcare_pet_name', fullPetRecord.name);
        localStorage.setItem('pawcare_pet_breed', `${fullPetRecord.breed}${fullPetRecord.age ? ' · ' + fullPetRecord.age : ''}`);

        PawCareSupabase.showToast('Pet profile saved successfully!', 'success');
        if (window.PawCareRealtime) {
          window.PawCareRealtime.notifyProfileUpdated({ type: 'pet', owner_id: targetOwnerId, pet: fullPetRecord });
        }
        return fullPetRecord;
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
        const currentUser = PawCareSupabase.auth.getCurrentUser();
        const targetId = id || currentUser?.id;

        if (PawCareSupabase.isConfigured() && targetId) {
          try {
            const { data, error } = await PawCareSupabase.client.from('profiles').select('*').eq('id', targetId).single();
            if (!error && data) return data;
          } catch (e) {
            console.warn('Error fetching profile from Supabase', e);
          }
        }
        const store = getLocalStore();
        if (targetId) {
          const found = store.profiles.find(p => p.id === targetId || (currentUser && p.email?.toLowerCase() === currentUser.email?.toLowerCase()));
          if (found) return found;
        }

        // If this is an authenticated user but not yet in local profiles list, generate their profile record
        if (currentUser) {
          const newProfile = {
            id: currentUser.id,
            role: currentUser.role || 'owner',
            first_name: currentUser.first_name || 'Pet',
            last_name: currentUser.last_name || 'Owner',
            full_name: currentUser.full_name || `${currentUser.first_name || 'Pet'} ${currentUser.last_name || 'Owner'}`.trim(),
            email: currentUser.email || '',
            username: currentUser.username || currentUser.email,
            phone: '',
            address: '',
            city: '',
            postal_code: '',
            member_since: 'October 2026'
          };
          store.profiles.push(newProfile);
          setLocalStore(store);
          return newProfile;
        }

        return store.profiles[0] || {
          id: 'usr_default',
          role: 'owner',
          first_name: 'Pet',
          last_name: 'Owner',
          full_name: 'Pet Owner',
          email: '',
          username: 'owner'
        };
      },

      async update(id, updates) {
        const currentUser = PawCareSupabase.auth.getCurrentUser();
        const targetId = id || currentUser?.id || 'usr_default';

        if (PawCareSupabase.isConfigured() && targetId) {
          try {
            const { data, error } = await PawCareSupabase.client
              .from('profiles')
              .upsert({ id: targetId, ...updates })
              .select();
            if (!error) {
              PawCareSupabase.showToast('Profile updated in Supabase!', 'success');
            }
          } catch (e) {
            console.warn('Supabase profile update failed, saving locally', e);
          }
        }

        const store = getLocalStore();
        const index = store.profiles.findIndex(p => p.id === targetId);
        if (index >= 0) {
          store.profiles[index] = { ...store.profiles[index], ...updates };
        } else {
          store.profiles.push({ id: targetId, ...updates });
        }
        setLocalStore(store);

        // Update active session user if names or email changed
        const session = PawCareSupabase.auth.getSession();
        if (session && session.user) {
          if (updates.first_name) session.user.first_name = updates.first_name;
          if (updates.last_name !== undefined) session.user.last_name = updates.last_name;
          const full = `${session.user.first_name || ''} ${session.user.last_name || ''}`.trim();
          session.user.full_name = full;
          if (updates.email) session.user.email = updates.email;
          if (updates.profile_completed !== undefined) session.user.profile_completed = updates.profile_completed;
          localStorage.setItem('paw_care_session', JSON.stringify(session));
          localStorage.setItem('pawcare_display_name', full);
          if (updates.email) localStorage.setItem('pawcare_email', updates.email);
          if (updates.phone) localStorage.setItem('pawcare_phone', updates.phone);
        }

        PawCareSupabase.showToast('Profile saved successfully!', 'success');
        if (window.PawCareRealtime) {
          window.PawCareRealtime.notifyProfileUpdated({ type: 'profile', id: targetId, updates });
        }
        return updates;
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
      },

      async getForUser(userId) {
        const currentUser = PawCareSupabase.auth.getCurrentUser();
        const targetId = userId || currentUser?.id;

        if (PawCareSupabase.isConfigured() && targetId) {
          try {
            const { data, error } = await PawCareSupabase.client
              .from('vets')
              .select('*')
              .eq('profile_id', targetId)
              .maybeSingle();
            if (!error && data) return data;
          } catch (e) {}
        }

        const store = getLocalStore();
        const found = store.vets.find(v => v.profile_id === targetId || v.id === targetId);
        if (found) return found;

        if (currentUser && currentUser.role === 'vet') {
          return {
            id: 'vet_' + currentUser.id,
            profile_id: currentUser.id,
            name: `Dr. ${currentUser.first_name || 'Anita'} ${currentUser.last_name || 'Rao'}`.trim(),
            specialty: 'General physician, dogs & cats',
            clinic_name: 'Companion Animal Clinic',
            clinic_location: 'Deccan, Pune',
            distance: '2.4 km',
            verified: true,
            verification_status: 'Verified veterinarian',
            next_available: 'Fri, 9 Oct · 10:30 am',
            opening_hours: 'Mon–Sat · 9:00 am–7:00 pm',
            facilities: 'Consultation room, vaccination area, pharmacy support',
            image_url: 'assets/pdf_img_5.jpeg'
          };
        }

        return store.vets[0];
      },

      async saveForVet(userId, vetData) {
        const currentUser = PawCareSupabase.auth.getCurrentUser();
        const targetId = userId || currentUser?.id;

        const store = getLocalStore();
        let existingIndex = store.vets.findIndex(v => v.profile_id === targetId || v.id === targetId);
        const vetRecord = {
          id: existingIndex >= 0 ? store.vets[existingIndex].id : generateUUID(),
          profile_id: targetId,
          ...vetData
        };

        if (PawCareSupabase.isConfigured()) {
          try {
            await PawCareSupabase.client.from('vets').upsert(vetRecord);
          } catch (e) {
            console.warn('Supabase vet save failed', e);
          }
        }

        if (existingIndex >= 0) {
          store.vets[existingIndex] = { ...store.vets[existingIndex], ...vetRecord };
        } else {
          store.vets.unshift(vetRecord);
        }
        setLocalStore(store);

        PawCareSupabase.showToast('Clinic profile saved!', 'success');
        if (window.PawCareRealtime) {
          window.PawCareRealtime.notifyProfileUpdated({ type: 'vet', userId: targetId, vet: vetRecord });
        }
        return vetRecord;
      }
    },

    // --- 9. APPOINTMENTS SERVICE ---
    appointments: {
      async list(filters = {}) {
        if (PawCareSupabase.isConfigured()) {
          try {
            let query = PawCareSupabase.client.from('appointments').select('*').order('created_at', { ascending: false });
            if (filters.status) query = query.eq('status', filters.status);
            if (filters.owner_id) query = query.eq('owner_id', filters.owner_id);
            const { data, error } = await query;
            if (!error && data && data.length > 0) return data;
          } catch (e) {
            console.warn('Error fetching appointments from Supabase', e);
          }
        }
        const store = getLocalStore();
        let list = store.appointments || [];
        if (filters.owner_id) {
          list = list.filter(a => a.owner_id === filters.owner_id || !a.owner_id || a.owner_id === '00000000-0000-0000-0000-000000000001');
        }
        if (filters.status) {
          list = list.filter(a => a.status === filters.status);
        }
        return list;
      },

      async create(appointmentData) {
        const currentUser = PawCareSupabase.auth.getCurrentUser();
        const apptId = (appointmentData.id && appointmentData.id.length === 36) ? appointmentData.id : generateUUID();
        const validStatus = (appointmentData.status === 'pending' || !appointmentData.status) ? 'awaiting_acceptance' : appointmentData.status;

        const newAppt = {
          id: apptId,
          owner_id: appointmentData.owner_id || currentUser?.id || '00000000-0000-0000-0000-000000000001',
          owner_name: appointmentData.owner_name || (currentUser ? (currentUser.full_name || `${currentUser.first_name} ${currentUser.last_name || ''}`.trim()) : 'Pet Owner'),
          pet_id: appointmentData.pet_id || 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
          pet_name: appointmentData.pet_name || 'Bruno',
          pet_breed: appointmentData.pet_breed || 'Labrador',
          pet_age: appointmentData.pet_age || '3 years',
          vet_id: appointmentData.vet_id || '11111111-1111-1111-1111-111111111111',
          vet_name: appointmentData.vet_name || 'Dr. Anita Rao',
          clinic_name: appointmentData.clinic_name || 'Companion Animal Clinic',
          location: appointmentData.location || 'Deccan, Pune',
          date: appointmentData.date || 'Fri, 9 Oct 2026',
          time: appointmentData.time || '10:30 am',
          reason: appointmentData.reason || 'Check-up',
          status: validStatus,
          created_at: new Date().toISOString()
        };

        if (PawCareSupabase.isConfigured()) {
          try {
            // Map remote payload to valid PostgreSQL columns in public.appointments
            // Only use owner_id if it is a real UUID and not the mock seed ID
            const remoteOwnerId = (newAppt.owner_id && newAppt.owner_id !== '00000000-0000-0000-0000-000000000001') ? newAppt.owner_id : null;
            const remoteApptRecord = {
              id: newAppt.id,
              owner_id: remoteOwnerId,
              pet_id: (newAppt.pet_id && newAppt.pet_id.length === 36) ? newAppt.pet_id : 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
              vet_id: (newAppt.vet_id && newAppt.vet_id.length === 36) ? newAppt.vet_id : '11111111-1111-1111-1111-111111111111',
              date: newAppt.date,
              time: newAppt.time,
              reason: newAppt.reason,
              status: newAppt.status,
              clinic_name: newAppt.clinic_name,
              location: newAppt.location
            };

            const { data, error } = await PawCareSupabase.client
              .from('appointments')
              .insert([remoteApptRecord])
              .select();
            if (!error && data) {
              PawCareSupabase.showToast('Booking request synced with Supabase in real-time!', 'success');
            } else if (error) {
              console.warn('Supabase appointment insert notice:', error);
            }
          } catch (e) {
            console.warn('Supabase appointment insert failed, saving locally', e);
          }
        }

        const store = getLocalStore();
        store.appointments.unshift(newAppt);
        setLocalStore(store);

        // Stash the latest appointment in localStorage for immediate hydration
        localStorage.setItem('pawcare_last_appointment', JSON.stringify(newAppt));

        // Broadcast appointment creation via Socket.io / BroadcastChannel
        if (window.PawCareRealtime) {
          window.PawCareRealtime.notifyAppointmentCreated(newAppt);
        }

        PawCareSupabase.showToast('Booking request sent to clinic in real-time!', 'success');
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
              PawCareSupabase.showToast(`Appointment status updated to ${status}!`, 'success');
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

        // Broadcast appointment status update via Socket.io / BroadcastChannel
        if (window.PawCareRealtime) {
          window.PawCareRealtime.notifyAppointmentAccepted({
            id: id,
            status: status,
            pet_name: appt?.pet_name || 'Bruno',
            owner_name: appt?.owner_name || 'Pet Owner',
            date: appt?.date || 'Fri, 9 Oct 2026',
            time: appt?.time || '10:30 am',
            reason: appt?.reason || 'Consultation'
          });
        }

        PawCareSupabase.showToast(`Appointment confirmed in real-time!`, 'success');
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
        const recordId = (recordData.id && recordData.id.length === 36) ? recordData.id : generateUUID();
        const newRecord = {
          id: recordId,
          pet_id: (recordData.pet_id && recordData.pet_id.length === 36) ? recordData.pet_id : 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
          vet_id: (recordData.vet_id && recordData.vet_id.length === 36) ? recordData.vet_id : '11111111-1111-1111-1111-111111111111',
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
      // Floating pill removed as requested
      const badge = document.getElementById('supabase-status-pill');
      if (badge) badge.remove();
    },

    openSetupModal() {
      // Setup modal removed
    },

    closeSetupModal() {
      const modal = document.getElementById('supabase-setup-modal');
      if (modal) modal.remove();
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
