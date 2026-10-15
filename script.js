// Paw Care — Complete Interactive Logic, Supabase Integration & Page Navigation

let currentSignInRole = 'owner';
let authMode = 'signin'; // 'signin' | 'signup'

function switchRole(role) {
  currentSignInRole = role;
  const tabOwner = document.getElementById('tab-owner');
  const tabVet = document.getElementById('tab-vet');
  const wsTitle = document.getElementById('workspace-title');
  const wsDesc = document.getElementById('workspace-desc');
  const emailInput = document.getElementById('signin-email');
  const passInput = document.getElementById('signin-password');
  const nameInput = document.getElementById('signin-name');
  const btnText = document.getElementById('signin-btn-text');
  const form = document.getElementById('signin-form');

  if (!tabOwner || !tabVet) return;

  if (role === 'vet') {
    tabVet.classList.add('active');
    tabOwner.classList.remove('active');
    if (wsTitle) wsTitle.textContent = 'Your veterinarian workspace';
    if (wsDesc) wsDesc.textContent = 'Review today’s schedule, respond to requests and update medical records.';
    if (btnText) btnText.textContent = authMode === 'signup' ? 'Create veterinarian account' : 'Sign in as veterinarian';
    if (form) form.action = 'vet-overview.html';

    if (authMode === 'signup') {
      if (emailInput) {
        emailInput.value = '';
        emailInput.placeholder = 'e.g. dr.anita@clinic.com';
      }
      if (passInput) {
        passInput.value = '';
        passInput.placeholder = 'Create a secure password (min. 6 chars)';
      }
      if (nameInput) {
        nameInput.placeholder = 'e.g. Dr. Anita Rao';
      }
    } else {
      if (emailInput && !emailInput.value) {
        emailInput.placeholder = 'e.g. anita.rao@companionclinic.com';
      }
    }
  } else {
    tabOwner.classList.add('active');
    tabVet.classList.remove('active');
    if (wsTitle) wsTitle.textContent = 'Your pet owner workspace';
    if (wsDesc) wsDesc.textContent = 'Manage your pets, appointments, records and reminders.';
    if (btnText) btnText.textContent = authMode === 'signup' ? 'Create pet owner account' : 'Sign in as pet owner';
    if (form) form.action = 'overview.html';

    if (authMode === 'signup') {
      if (emailInput) {
        emailInput.value = '';
        emailInput.placeholder = 'e.g. rohan.patil@example.com';
      }
      if (passInput) {
        passInput.value = '';
        passInput.placeholder = 'Create a secure password (min. 6 chars)';
      }
      if (nameInput) {
        nameInput.placeholder = 'e.g. Rohan Patil';
      }
    } else {
      if (emailInput && !emailInput.value) {
        emailInput.placeholder = 'e.g. rohan.patil@example.com';
      }
    }
  }
}

function toggleAuthMode() {
  authMode = authMode === 'signin' ? 'signup' : 'signin';
  const title = document.querySelector('.signin-form-title');
  const subtitle = document.querySelector('.signin-form-subtitle');
  const nameGroup = document.getElementById('signup-name-group');
  const nameInput = document.getElementById('signin-name');
  const emailInput = document.getElementById('signin-email');
  const passInput = document.getElementById('signin-password');
  const signinOptions = document.getElementById('signin-options');
  const btnText = document.getElementById('signin-btn-text');
  const togglePrompt = document.getElementById('auth-toggle-prompt');
  const toggleBtn = document.getElementById('auth-toggle-btn');
  const errorBox = document.getElementById('auth-error-msg');
  if (errorBox) errorBox.style.display = 'none';

  if (authMode === 'signup') {
    if (title) title.textContent = 'Join Paw Care today.';
    if (subtitle) subtitle.textContent = 'Create your account to get started.';
    if (nameGroup) nameGroup.style.display = 'block';
    if (signinOptions) signinOptions.style.display = 'none';
    if (btnText) btnText.textContent = currentSignInRole === 'vet' ? 'Create veterinarian account' : 'Create pet owner account';
    if (togglePrompt) togglePrompt.textContent = 'Already have an account?';
    if (toggleBtn) toggleBtn.textContent = 'Sign in';

    // Clear email, password, and name inputs when creating account
    if (emailInput) {
      emailInput.value = '';
      emailInput.placeholder = currentSignInRole === 'vet' ? 'e.g. dr.anita@clinic.com' : 'e.g. yourname@example.com';
    }
    if (passInput) {
      passInput.value = '';
      passInput.placeholder = 'Create a secure password (min. 6 chars)';
      passInput.autocomplete = 'new-password';
    }
    if (nameInput) {
      nameInput.value = '';
      nameInput.placeholder = currentSignInRole === 'vet' ? 'e.g. Dr. Anita Rao' : 'e.g. Rohan Patil';
      nameInput.required = true;
    }
  } else {
    if (title) title.textContent = 'Good to see you again.';
    if (subtitle) subtitle.textContent = 'Sign in to your Paw Care workspace.';
    if (nameGroup) nameGroup.style.display = 'none';
    if (signinOptions) signinOptions.style.display = 'flex';
    if (btnText) btnText.textContent = currentSignInRole === 'vet' ? 'Sign in as veterinarian' : 'Sign in as pet owner';
    if (togglePrompt) togglePrompt.textContent = 'New to Paw Care?';
    if (toggleBtn) toggleBtn.textContent = 'Create an account';

    if (nameInput) {
      nameInput.required = false;
    }
    if (passInput) {
      passInput.autocomplete = 'current-password';
      passInput.placeholder = '••••••••••••';
    }
    if (emailInput) {
      emailInput.placeholder = currentSignInRole === 'vet' ? 'e.g. anita.rao@companionclinic.com' : 'e.g. rohan.patil@example.com';
    }
  }
}

async function handleAuthSubmit(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById('signin-email');
  const passInput = document.getElementById('signin-password');
  const nameInput = document.getElementById('signin-name');
  const errorBox = document.getElementById('auth-error-msg');
  const submitBtn = document.getElementById('signin-submit');

  const email = emailInput ? emailInput.value.trim() : '';
  const password = passInput ? passInput.value.trim() : '';
  const fullName = nameInput ? nameInput.value.trim() : '';

  if (errorBox) errorBox.style.display = 'none';

  if (!email) {
    if (errorBox) {
      errorBox.style.display = 'block';
      errorBox.style.backgroundColor = '#FDF2E9';
      errorBox.style.color = '#7C4A1E';
      errorBox.textContent = 'Please enter an email address.';
    }
    return;
  }

  if (!password) {
    if (errorBox) {
      errorBox.style.display = 'block';
      errorBox.style.backgroundColor = '#FDF2E9';
      errorBox.style.color = '#7C4A1E';
      errorBox.textContent = 'Please enter a password.';
    }
    return;
  }

  if (authMode === 'signup' && password.length < 6) {
    if (errorBox) {
      errorBox.style.display = 'block';
      errorBox.style.backgroundColor = '#FDF2E9';
      errorBox.style.color = '#7C4A1E';
      errorBox.textContent = 'Password must be at least 6 characters long.';
    }
    return;
  }

  if (submitBtn) submitBtn.disabled = true;

  try {
    if (authMode === 'signup') {
      const parts = fullName.split(' ');
      const firstName = parts[0] || (currentSignInRole === 'vet' ? 'Dr. Anita' : 'Pet');
      const lastName = parts.slice(1).join(' ') || (currentSignInRole === 'vet' ? 'Rao' : 'Owner');

      const res = await window.PawCareSupabase.auth.signUp(email, password, currentSignInRole, {
        first_name: firstName,
        last_name: lastName
      });

      if (res && res.requiresEmailConfirmation) {
        if (errorBox) {
          errorBox.style.display = 'block';
          errorBox.style.backgroundColor = '#EBF5EB';
          errorBox.style.color = '#1E5E22';
          errorBox.innerHTML = `✓ Account created in Supabase! If confirmation is required, check <strong>${email}</strong>, or sign in now.`;
        }
      } else {
        setTimeout(() => {
          window.location.href = currentSignInRole === 'vet' ? 'vet-overview.html' : 'overview.html';
        }, 500);
      }
    } else {
      // Sign in mode
      const res = await window.PawCareSupabase.auth.signIn(email, password, currentSignInRole);
      if (res && res.success) {
        setTimeout(() => {
          window.location.href = currentSignInRole === 'vet' ? 'vet-overview.html' : 'overview.html';
        }, 500);
      } else if (res && res.error) {
        if (errorBox) {
          errorBox.style.display = 'block';
          errorBox.style.backgroundColor = '#FEF3C7';
          errorBox.style.color = '#92400E';
          errorBox.innerHTML = `Supabase Auth Notice: <strong>${res.error}</strong>.<br><br>Haven't created an account with this email in your new Supabase project yet? <a href="javascript:void(0)" onclick="toggleAuthMode()" style="text-decoration: underline; font-weight: 800; color: #78350F;">Click here to Create Account</a> with this email, or sign in with Demo Mode.`;
        }
      }
    }
  } catch (err) {
    if (errorBox) {
      errorBox.style.display = 'block';
      errorBox.style.backgroundColor = '#FDF2E9';
      errorBox.style.color = '#7C4A1E';
      errorBox.textContent = err.message || 'Authentication error occurred.';
    }
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

// Backwards-compatible alias
const handleSignIn = handleAuthSubmit;

function selectSlot(btn, slotTime) {
  document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const timeSelect = document.getElementById('booking-time-select');
  if (timeSelect) timeSelect.value = slotTime;

  const stepVal = document.getElementById('step-time-val');
  if (stepVal) stepVal.textContent = 'Fri, 9 Oct · ' + slotTime;

  const summaryVal = document.getElementById('summary-time-val');
  if (summaryVal) summaryVal.textContent = 'Fri, 9 Oct 2026 · ' + slotTime;
}

async function acceptRequest(cardId) {
  const actionsDiv = document.getElementById('request-actions');
  const countSpan = document.getElementById('pending-count');
  if (actionsDiv) {
    actionsDiv.innerHTML = '<span class="badge badge-verified">Accepted · Confirmed for Fri, 9 Oct · 10:30 am</span>';
  }
  if (countSpan) {
    const text = countSpan.textContent.trim();
    if (text.startsWith('2')) {
      countSpan.textContent = '1 request';
    } else {
      countSpan.textContent = '0 requests';
    }
  }

  if (window.PawCareSupabase) {
    await window.PawCareSupabase.appointments.updateStatus('a1111111-1111-1111-1111-111111111111', 'confirmed');
  }
}

// Interactive Mockup Slot Picker in Pillar 1 (Care & Visits)
function highlightPillarSlot(slotBtn, slotTime) {
  const container = slotBtn.closest('.preview-slots');
  if (container) {
    container.querySelectorAll('.preview-slot').forEach(b => b.classList.remove('active'));
  }
  slotBtn.classList.add('active');

  const statusBox = document.getElementById('care-slot-status');
  if (statusBox) {
    statusBox.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span>Selected: <strong>${slotTime}</strong> · Ready for booking request</span>
    `;
  }
}

// Save Pet Profile to Supabase
async function savePetProfile(e) {
  if (e) e.preventDefault();
  const nameEl = document.getElementById('pet-name');
  const speciesEl = document.getElementById('pet-species');
  const breedEl = document.getElementById('pet-breed');
  const ageEl = document.getElementById('pet-age');
  const weightEl = document.getElementById('pet-weight');
  const sexEl = document.getElementById('pet-sex');
  const microchipEl = document.getElementById('pet-microchip');
  const allergiesEl = document.getElementById('pet-allergies');
  const illnessEl = document.getElementById('pet-past-illness');

  const updates = {
    name: nameEl ? nameEl.value : 'Bruno',
    species: speciesEl ? speciesEl.value : 'Dog',
    breed: breedEl ? breedEl.value : 'Labrador',
    age: ageEl ? ageEl.value : '3 years',
    weight: weightEl ? parseFloat(weightEl.value) || 28.4 : 28.4,
    sex: sexEl ? sexEl.value : 'Male · Neutered',
    microchip: microchipEl ? microchipEl.value : 'Not added',
    allergies: allergiesEl ? allergiesEl.value : '',
    past_illness: illnessEl ? illnessEl.value : ''
  };

  if (window.PawCareSupabase) {
    await window.PawCareSupabase.pets.update('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', updates);
  }

  setTimeout(() => {
    window.location.href = 'overview.html';
  }, 600);
}

// Save User Profile to Supabase
async function saveUserProfile(e) {
  if (e) e.preventDefault();
  const firstEl = document.getElementById('profile-first-name');
  const lastEl = document.getElementById('profile-last-name');
  const emailEl = document.getElementById('profile-email');
  const phoneEl = document.getElementById('profile-phone');
  const addressEl = document.getElementById('profile-address');
  const cityEl = document.getElementById('profile-city');
  const postalEl = document.getElementById('profile-postal');

  const updates = {
    first_name: firstEl ? firstEl.value : 'Rohan',
    last_name: lastEl ? lastEl.value : 'Patil',
    email: emailEl ? emailEl.value : 'rohan.patil@example.com',
    phone: phoneEl ? phoneEl.value : '+91 98765 43210',
    address: addressEl ? addressEl.value : '18 Prabhat Road, Deccan Gymkhana',
    city: cityEl ? cityEl.value : 'Pune',
    postal_code: postalEl ? postalEl.value : '411004'
  };

  if (window.PawCareSupabase) {
    await window.PawCareSupabase.profiles.update('00000000-0000-0000-0000-000000000001', updates);
  }

  setTimeout(() => {
    window.location.href = 'overview.html';
  }, 600);
}

// Submit Booking Request to Supabase
async function submitBookingRequest(e) {
  if (e) e.preventDefault();
  const dateEl = document.getElementById('booking-date-select');
  const timeEl = document.getElementById('booking-time-select');
  const reasonEl = document.getElementById('booking-reason-input');

  const appointmentData = {
    date: dateEl ? dateEl.value : 'Fri, 9 Oct 2026',
    time: timeEl ? timeEl.value : '10:30 am',
    reason: reasonEl ? reasonEl.value : 'Rabies booster',
    status: 'awaiting_acceptance'
  };

  if (window.PawCareSupabase) {
    await window.PawCareSupabase.appointments.create(appointmentData);
  }

  setTimeout(() => {
    window.location.href = 'booking-sent.html';
  }, 500);
}

// Save Consultation Record to Supabase
async function saveConsultationRecord(e) {
  if (e) e.preventDefault();
  const dateEl = document.getElementById('consult-date');
  const timeEl = document.getElementById('consult-time');
  const complaintEl = document.getElementById('consult-chief-complaint');
  const diagnosisEl = document.getElementById('consult-diagnosis');
  const commEl = document.getElementById('consult-communication');
  const followupEl = document.getElementById('consult-followup');

  const recordData = {
    consultation_date: dateEl ? dateEl.value : '7 Oct 2026',
    consultation_time: timeEl ? timeEl.value : '10:30 am',
    chief_complaint: complaintEl ? complaintEl.value : '',
    diagnosis_notes: diagnosisEl ? diagnosisEl.value : '',
    owner_communication: commEl ? commEl.value : '',
    follow_up_appointment: followupEl ? followupEl.value : '',
    prescriptions: [
      { medicine: 'Veterinarian-specified ear drops', dosage: '3 drops', duration: '7 days', instructions: 'In affected ear, once daily' }
    ],
    vaccinations: [
      { vaccine: 'Rabies', date: 'Not administered', next_due: '9 Oct 2026', status: 'Pending acceptance' },
      { vaccine: 'DHPP', date: '21 Mar 2026', next_due: '21 Dec 2026', status: 'Next due 21 Dec 2026' }
    ]
  };

  if (window.PawCareSupabase) {
    await window.PawCareSupabase.medicalRecords.create(recordData);
  }

  setTimeout(() => {
    window.location.href = 'vet-overview.html';
  }, 600);
}

// Toggle Notification Preference
async function handlePreferenceToggle(prefKey, toggleEl) {
  if (!toggleEl) return;
  toggleEl.classList.toggle('on');
  const isOn = toggleEl.classList.contains('on');

  if (window.PawCareSupabase) {
    const updates = {};
    updates[prefKey] = isOn;
    await window.PawCareSupabase.notificationPreferences.update('00000000-0000-0000-0000-000000000001', updates);
  }
}

// Dynamic Hydration of Pet & Profile data across Workspace Pages
async function hydrateWorkspaceData() {
  if (!window.PawCareSupabase) return;

  try {
    // 1. Hydrate Pet Data (Overview, Health Records, Pet Profile)
    const pet = await window.PawCareSupabase.pets.get('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
    if (pet) {
      // Pet Profile Form (pet-profile.html)
      if (document.getElementById('pet-name')) document.getElementById('pet-name').value = pet.name || '';
      if (document.getElementById('pet-breed')) document.getElementById('pet-breed').value = pet.breed || '';
      if (document.getElementById('pet-age')) document.getElementById('pet-age').value = pet.age || '';
      if (document.getElementById('pet-weight')) document.getElementById('pet-weight').value = pet.weight || '';
      if (document.getElementById('pet-allergies')) document.getElementById('pet-allergies').value = pet.allergies || '';
      if (document.getElementById('pet-past-illness')) document.getElementById('pet-past-illness').value = pet.past_illness || '';

      // Overview Pet Summary Card (overview.html)
      const overviewName = document.querySelector('.pet-summary-name');
      if (overviewName) overviewName.textContent = pet.name || 'Bruno';
      const overviewMeta = document.querySelector('.pet-summary-meta');
      if (overviewMeta) overviewMeta.textContent = `${pet.species || 'Dog'} · ${pet.breed || 'Labrador'} · ${pet.age || '3 years'}`;
      const overviewWeight = document.querySelector('.pet-stats-row .stat-value');
      if (overviewWeight) overviewWeight.textContent = `${pet.weight || '28.4'} kg`;

      // Health Records Hero Card (health-records.html)
      const recordName = document.querySelector('.pet-hero-name');
      if (recordName) recordName.textContent = pet.name || 'Bruno';
      const recordBadge = document.querySelector('.pet-hero-name-row .badge');
      if (recordBadge) recordBadge.textContent = `${pet.species || 'Dog'} · ${pet.breed || 'Labrador'}`;
      const recordMeta = document.querySelector('.pet-hero-meta');
      if (recordMeta) recordMeta.textContent = `${pet.age || '3 years'} · ${pet.weight || '28.4'} kg`;
      const recordAllergy = document.querySelector('.pet-hero-allergy span');
      if (recordAllergy && pet.allergies) {
        recordAllergy.textContent = pet.allergies;
      }
    }
  } catch (e) {
    console.warn('Could not hydrate pet details', e);
  }

  try {
    // 2. Hydrate User Profile Form (my-profile.html)
    if (document.getElementById('profile-first-name')) {
      const user = window.PawCareSupabase.auth.getCurrentUser();
      const profile = await window.PawCareSupabase.profiles.get(user?.id || '00000000-0000-0000-0000-000000000001');
      if (profile) {
        if (document.getElementById('profile-first-name')) document.getElementById('profile-first-name').value = profile.first_name || '';
        if (document.getElementById('profile-last-name')) document.getElementById('profile-last-name').value = profile.last_name || '';
        if (document.getElementById('profile-email')) document.getElementById('profile-email').value = profile.email || '';
        if (document.getElementById('profile-phone')) document.getElementById('profile-phone').value = profile.phone || '';
        if (document.getElementById('profile-address')) document.getElementById('profile-address').value = profile.address || '';
        if (document.getElementById('profile-city')) document.getElementById('profile-city').value = profile.city || '';
        if (document.getElementById('profile-postal')) document.getElementById('profile-postal').value = profile.postal_code || '';
      }
    }
  } catch (e) {
    console.warn('Could not hydrate user profile', e);
  }

  // 3. Topbar User Name across all workspace pages
  try {
    const user = window.PawCareSupabase.auth.getCurrentUser();
    if (user && user.first_name) {
      const userSpan = document.querySelector('.topbar-user span:not(.user-avatar-sm)');
      const avatarSpan = document.querySelector('.topbar-user .user-avatar-sm');
      if (userSpan) userSpan.textContent = `${user.first_name} ${user.last_name || ''}`;
      if (avatarSpan) {
        avatarSpan.textContent = `${user.first_name[0] || 'R'}${user.last_name ? user.last_name[0] : 'P'}`;
      }
    }
  } catch (e) {
    console.warn('Could not update topbar user name', e);
  }

  // 4. Wire Notification Preferences toggles if on reminders page
  const prefToggles = document.querySelectorAll('.pref-row .toggle-switch');
  if (prefToggles && prefToggles.length >= 4) {
    const prefKeys = ['email_reminders', 'sms_reminders', 'push_notifications', 'weekly_digest'];
    prefToggles.forEach((tog, idx) => {
      tog.removeAttribute('onclick');
      tog.onclick = () => handlePreferenceToggle(prefKeys[idx], tog);
    });
  }

  // 5. Wire Health records filter tabs
  const filterTabs = document.querySelectorAll('.role-tabs a.role-tab');
  filterTabs.forEach(tab => {
    tab.onclick = function (ev) {
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    };
  });
}

// Seamless Client-Side Navigation for Workspace Pages
function initSeamlessNavigation() {
  document.addEventListener('click', async (e) => {
    const link = e.target.closest('.sidebar-link');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;

    const workspacePages = [
      'overview.html',
      'pet-profile.html',
      'health-records.html',
      'reminders.html',
      'my-profile.html',
      'book-appointment.html',
      'vet-overview.html',
      'vet-schedule.html',
      'vet-week-schedule.html',
      'vet-requests-availability.html',
      'vet-consultation.html'
    ];

    const targetBase = href.split('?')[0].split('#')[0];
    if (!workspacePages.includes(targetBase)) return;

    // Check if running on http/https (local file:// disallows fetch due to browser CORS policies)
    if (window.location.protocol === 'file:') {
      return; // allow standard browser navigation
    }

    e.preventDefault();

    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error('Fetch failed');
      const htmlText = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      const newMain = doc.querySelector('.app-main');
      const currentMain = document.querySelector('.app-main');

      if (newMain && currentMain) {
        currentMain.innerHTML = newMain.innerHTML;

        // Update active link in sidebar
        document.querySelectorAll('.sidebar-link').forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === href || l.getAttribute('href') === targetBase) {
            l.classList.add('active');
          }
        });

        if (doc.title) document.title = doc.title;
        window.history.pushState({ url: href }, '', href);

        // Hydrate data into newly swapped content
        await hydrateWorkspaceData();

        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        window.location.href = href;
      }
    } catch (err) {
      console.warn('Seamless navigation fallback to native reload:', err);
      window.location.href = href;
    }
  });

  window.addEventListener('popstate', () => {
    if (window.location.protocol !== 'file:') {
      window.location.reload();
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Check URL query parameters for ?role=vet or ?mode=signup on Sign In page
  const params = new URLSearchParams(window.location.search);
  if (params.get('role') === 'vet') {
    switchRole('vet');
  }
  if (params.get('mode') === 'signup' || params.get('action') === 'signup') {
    if (authMode !== 'signup') {
      toggleAuthMode();
    }
  }

  // 2. Accordion Logic on Landing Page
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      accordionItems.forEach(other => {
        other.classList.remove('active');
        const btn = other.querySelector('.accordion-header');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 3. Attach Sign Out to sidebar signout links
  const signoutLinks = document.querySelectorAll('.sidebar-signout');
  signoutLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.PawCareSupabase) {
        window.PawCareSupabase.auth.signOut();
      } else {
        window.location.href = 'signin.html';
      }
    });
  });

  // 4. Hydrate Workspace Data across all pages
  await hydrateWorkspaceData();

  // 5. Initialize Seamless Client-Side Navigation
  initSeamlessNavigation();
});

// ==========================================================================
// VETERINARIAN RECORDS: PATIENT SELECTOR, SEARCH & PRESCRIPTION BUILDER
// ==========================================================================

const patientRecordsData = {
  bruno: {
    name: 'Bruno',
    species: 'Dog',
    breed: 'Labrador',
    age: '3 years',
    weight: '28.4 kg',
    sex: 'Male · Neutered',
    owner: 'Rohan Patil',
    photo: 'assets/pdf_img_4.jpeg',
    badge: 'Dog · Labrador',
    allergyTitle: 'Key allergy',
    allergyText: 'Chicken protein allergy causing itching and skin irritation. Strictly hypoallergenic diet recommended.',
    consultDate: '7 Oct 2026',
    consultTime: '9:00 am',
    status: '9:00 am · Completed',
    chiefComplaint: 'Ear inflammation follow-up. Owner reports reduced scratching and discharge since previous drops.',
    diagnosis: 'Otitis externa improving significantly. Right ear canal clear; minimal erythema remaining in left ear. Continue targeted ear drops for 7 days to eliminate residual inflammation.',
    clinicalNotes: 'Temperature: 38.4°C. Weight stable at 28.4 kg. Otoscopic inspection reveals 80% reduction in discharge. No sign of systemic infection.',
    prescriptions: [
      { medicine: 'Otomax Ear Drops', dosage: '3 drops', duration: '7 days', instructions: 'In left ear once daily' },
      { medicine: 'Chlorhexidine Cleanser', dosage: '2 ml', duration: '10 days', instructions: 'Clean ear canal prior to drops' }
    ],
    vaccinations: [
      { vaccine: 'Rabies booster', date: 'Pending acceptance', nextDue: '9 Oct 2026', status: 'Pending clinic confirmation' },
      { vaccine: 'DHPP Core', date: '21 Mar 2026', nextDue: '21 Dec 2026', status: 'Up to date' }
    ],
    followup: '14 Oct 2026 · 11:00 am · Ear follow-up recheck with Dr. Anita Rao',
    communication: 'Advised Rohan to maintain strict chicken-free diet. Follow up in 7 days. Rabies booster scheduled for Fri, 9 Oct.',
    history: [
      { date: '7 Oct 2026', title: 'Ear inflammation follow-up', desc: 'Otitis externa resolving. Prescribed Otomax drops.' },
      { date: '28 Aug 2026', title: 'Mild ear infection & redness', desc: 'Presented with head shaking. Swab confirmed fungal otitis.' },
      { date: '21 Mar 2026', title: 'Annual wellness examination', desc: 'Overall health excellent. DHPP core booster administered.' }
    ]
  },
  mishti: {
    name: 'Mishti',
    species: 'Cat',
    breed: 'Persian cat',
    age: '2 years',
    weight: '4.2 kg',
    sex: 'Female · Spayed',
    owner: 'Priya Deshmukh',
    photo: 'assets/cat.jpg',
    badge: 'Cat · Persian',
    allergyTitle: 'Key sensitivity',
    allergyText: 'Flea saliva hypersensitivity. Requires regular monthly preventative spot-on treatments.',
    consultDate: '7 Oct 2026',
    consultTime: '11:30 am',
    status: '11:30 am · Upcoming',
    chiefComplaint: 'Annual vaccination review and routine feline health examination.',
    diagnosis: 'Healthy feline on physical examination. Clear eyes, ears, and lungs; mild tartar on upper premolars. Due for annual FVRCP booster today.',
    clinicalNotes: 'Temperature: 38.6°C. Heart rate: 160 bpm. Mucous membranes pink. Abdominal palpation unremarkable. Hydration normal.',
    prescriptions: [
      { medicine: 'FVRCP Feline Booster', dosage: '1 vial (0.5 ml)', duration: 'Single dose', instructions: 'Administered subcutaneously today' },
      { medicine: 'Revolution Plus Spot-On', dosage: '1 pipette (4.2 kg)', duration: 'Monthly', instructions: 'Apply topically to back of neck' }
    ],
    vaccinations: [
      { vaccine: 'FVRCP (Rhinotracheitis)', date: '7 Oct 2026', nextDue: '7 Oct 2027', status: 'Administered today' },
      { vaccine: 'Rabies Feline', date: '12 Oct 2025', nextDue: '12 Oct 2026', status: 'Due next week' }
    ],
    followup: '12 Oct 2026 · 10:00 am · Annual Rabies booster appointment',
    communication: 'Advised Priya on home dental brushing routine for cats and monthly flea preventative application schedule.',
    history: [
      { date: '7 Oct 2026', title: 'Vaccination review & checkup', desc: 'Annual wellness check; FVRCP booster administered.' },
      { date: '15 May 2026', title: 'Deworming & hairball check', desc: 'Deworming paste administered; hairball diet recommended.' },
      { date: '12 Oct 2025', title: 'Primary feline vaccination series', desc: 'FVRCP + Rabies first round completed with no adverse reactions.' }
    ]
  },
  coco: {
    name: 'Coco',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '1 year',
    weight: '24.1 kg',
    sex: 'Male · Intact',
    owner: 'Aarav Mehta',
    photo: 'assets/pdf_img_2.jpeg',
    badge: 'Dog · Golden Retriever',
    allergyTitle: 'No known allergies',
    allergyText: 'No known drug or dietary allergies recorded to date.',
    consultDate: '7 Oct 2026',
    consultTime: '2:00 pm',
    status: '2:00 pm · Upcoming',
    chiefComplaint: 'Routine post-adoption wellness follow-up and dietary plan consultation.',
    diagnosis: 'Excellent overall physical condition. Healthy coat and skin. Body condition score 5/9 (ideal). Weight gain optimal for juvenile Golden Retriever.',
    clinicalNotes: 'Temperature: 38.2°C. Auscultation clear. Musculoskeletal development symmetrical. Demeanor friendly and alert.',
    prescriptions: [
      { medicine: 'Omega-3 Fish Oil Supplement', dosage: '2 capsules', duration: '30 days', instructions: 'Give with morning meal for coat health' },
      { medicine: 'Simparica Trio Chewable', dosage: '1 tablet (20-40 kg)', duration: 'Monthly', instructions: 'Chewable tablet for tick, flea & heartworm' }
    ],
    vaccinations: [
      { vaccine: 'Bordetella Oral', date: '14 Apr 2026', nextDue: '14 Apr 2027', status: 'Up to date' },
      { vaccine: 'DHPP Annual', date: '15 Jan 2026', nextDue: '15 Jan 2027', status: 'Up to date' }
    ],
    followup: '7 Jan 2027 · 2:00 pm · Annual core vaccination and neutering consultation',
    communication: 'Provided Aarav with portion guide for juvenile Golden Retrievers and answered training nutrition queries.',
    history: [
      { date: '7 Oct 2026', title: 'Post-adoption wellness & diet', desc: 'Ideal body condition score. Nutrition plan provided.' },
      { date: '14 Apr 2026', title: 'Adoption health screening', desc: 'Health certificate issued. Bordetella vaccine administered.' },
      { date: '15 Jan 2026', title: 'Puppy core vaccination completion', desc: 'DHPP booster and microchip check passed.' }
    ]
  }
};

let currentRecordKey = 'bruno';

function selectPatientRecord(petKey) {
  const patient = patientRecordsData[petKey];
  if (!patient) return;

  currentRecordKey = petKey;

  // 1. Highlight active small div
  document.querySelectorAll('.today-patient-small-div').forEach(div => {
    div.classList.remove('active');
  });
  const activeDiv = document.getElementById(`small-div-${petKey}`);
  if (activeDiv) activeDiv.classList.add('active');

  // 2. Update Left Patient Column
  const photoEl = document.getElementById('detail-pet-photo');
  const nameEl = document.getElementById('detail-pet-name');
  const badgeEl = document.getElementById('detail-pet-badge');
  const ownerEl = document.getElementById('detail-pet-owner');
  const ageEl = document.getElementById('detail-pet-age');
  const weightEl = document.getElementById('detail-pet-weight');
  const sexEl = document.getElementById('detail-pet-sex');
  const allergyTitleEl = document.getElementById('detail-allergy-title');
  const allergyTextEl = document.getElementById('detail-allergy-text');

  if (photoEl) photoEl.src = patient.photo;
  if (nameEl) nameEl.textContent = patient.name;
  if (badgeEl) badgeEl.textContent = patient.badge;
  if (ownerEl) ownerEl.textContent = patient.owner;
  if (ageEl) ageEl.textContent = patient.age;
  if (weightEl) weightEl.textContent = patient.weight;
  if (sexEl) sexEl.textContent = patient.sex;
  if (allergyTitleEl) allergyTitleEl.textContent = patient.allergyTitle;
  if (allergyTextEl) allergyTextEl.textContent = patient.allergyText;

  // 3. Update History List
  const historyListEl = document.getElementById('detail-history-list');
  if (historyListEl && patient.history) {
    historyListEl.innerHTML = patient.history.map(item => `
      <div class="history-item">
        <div class="history-date">${item.date}</div>
        <div class="history-title">${item.title}</div>
        <div class="history-sub">${item.desc}</div>
      </div>
    `).join('');
  }

  // 4. Update Consultation Details
  const statusEl = document.getElementById('detail-visit-status');
  const dateEl = document.getElementById('consult-date');
  const timeEl = document.getElementById('consult-time');
  const complaintEl = document.getElementById('consult-chief-complaint');
  const diagEl = document.getElementById('consult-diagnosis');
  const notesEl = document.getElementById('consult-clinical-notes');
  const followupEl = document.getElementById('consult-followup');
  const commEl = document.getElementById('consult-communication');

  if (statusEl) statusEl.textContent = patient.status;
  if (dateEl) dateEl.value = patient.consultDate;
  if (timeEl) timeEl.value = patient.consultTime;
  if (complaintEl) complaintEl.value = patient.chiefComplaint;
  if (diagEl) diagEl.value = patient.diagnosis;
  if (notesEl) notesEl.value = patient.clinicalNotes;
  if (followupEl) followupEl.value = patient.followup;
  if (commEl) commEl.value = patient.communication;

  // 5. Update Prescription Table
  const prescBody = document.getElementById('prescription-table-body');
  if (prescBody && patient.prescriptions) {
    prescBody.innerHTML = patient.prescriptions.map(p => `
      <tr>
        <td><input type="text" class="prescription-input" value="${p.medicine}" /></td>
        <td><input type="text" class="prescription-input" value="${p.dosage}" /></td>
        <td><input type="text" class="prescription-input" value="${p.duration}" /></td>
        <td><input type="text" class="prescription-input" value="${p.instructions}" /></td>
        <td style="text-align: center;">
          <button type="button" class="btn btn-sm" style="color: #A33A3A; padding: 2px 6px;" onclick="removePrescriptionRow(this)" title="Remove item">&times;</button>
        </td>
      </tr>
    `).join('');
  }

  // 6. Update Vaccinations Table
  const vaccBody = document.getElementById('vaccinations-table-body');
  if (vaccBody && patient.vaccinations) {
    vaccBody.innerHTML = patient.vaccinations.map(v => `
      <tr>
        <td>${v.vaccine}</td>
        <td>${v.date}</td>
        <td>${v.nextDue}</td>
        <td>${v.status}</td>
      </tr>
    `).join('');
  }

  // Hide toast when switching patient
  const toastEl = document.getElementById('consult-save-toast');
  if (toastEl) toastEl.style.display = 'none';
}

function handleRecordSearch(query) {
  const q = (query || '').trim().toLowerCase();
  const clearBtn = document.getElementById('record-search-clear');
  const smallDivs = document.querySelectorAll('.today-patient-small-div');
  const noFoundEl = document.getElementById('no-patients-found');
  const queryDisplay = document.getElementById('search-query-display');

  if (clearBtn) {
    clearBtn.style.display = q ? 'block' : 'none';
  }

  let matchCount = 0;
  smallDivs.forEach(div => {
    const petName = (div.getAttribute('data-pet') || '').toLowerCase();
    const ownerName = (div.getAttribute('data-owner') || '').toLowerCase();

    if (!q || petName.includes(q) || ownerName.includes(q)) {
      div.style.display = 'flex';
      matchCount++;
    } else {
      div.style.display = 'none';
    }
  });

  if (noFoundEl) {
    if (matchCount === 0 && q) {
      noFoundEl.style.display = 'block';
      if (queryDisplay) queryDisplay.textContent = query;
    } else {
      noFoundEl.style.display = 'none';
    }
  }
}

function clearRecordSearch() {
  const searchInput = document.getElementById('record-search-input');
  if (searchInput) searchInput.value = '';
  handleRecordSearch('');
  if (searchInput) searchInput.focus();
}

function addPrescriptionRow() {
  const prescBody = document.getElementById('prescription-table-body');
  if (!prescBody) return;

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="prescription-input" placeholder="e.g. Amoxicillin Drops" /></td>
    <td><input type="text" class="prescription-input" placeholder="e.g. 5 mg / 2.5 ml" /></td>
    <td><input type="text" class="prescription-input" placeholder="e.g. 5 days" /></td>
    <td><input type="text" class="prescription-input" placeholder="e.g. Twice daily with meals" /></td>
    <td style="text-align: center;">
      <button type="button" class="btn btn-sm" style="color: #A33A3A; padding: 2px 6px;" onclick="removePrescriptionRow(this)" title="Remove item">&times;</button>
    </td>
  `;
  prescBody.appendChild(tr);

  const firstInput = tr.querySelector('input');
  if (firstInput) firstInput.focus();
}

function removePrescriptionRow(btn) {
  const row = btn.closest('tr');
  if (row) row.remove();
}

function saveConsultationRecord(e) {
  if (e) e.preventDefault();
  const patient = patientRecordsData[currentRecordKey];
  const petName = patient ? patient.name : 'Patient';

  // Read current diagnosis and store in memory
  const diagInput = document.getElementById('consult-diagnosis');
  if (diagInput && patient) {
    patient.diagnosis = diagInput.value.trim();
  }

  const toastEl = document.getElementById('consult-save-toast');
  if (toastEl) {
    toastEl.style.display = 'block';
    toastEl.innerHTML = `✓ Medical record, diagnosis, and prescription saved successfully for <strong>${petName}</strong>! Shared with care circle.`;
    setTimeout(() => {
      toastEl.style.display = 'none';
    }, 4500);
  }
}

