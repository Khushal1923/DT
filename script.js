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
  const btnText = document.getElementById('signin-btn-text');
  const form = document.getElementById('signin-form');

  if (!tabOwner || !tabVet) return;

  if (role === 'vet') {
    tabVet.classList.add('active');
    tabOwner.classList.remove('active');
    if (wsTitle) wsTitle.textContent = 'Your veterinarian workspace';
    if (wsDesc) wsDesc.textContent = 'Review today’s schedule, respond to requests and update medical records.';
    if (emailInput) emailInput.value = 'anita.rao@companionclinic.com';
    if (btnText) btnText.textContent = authMode === 'signup' ? 'Create veterinarian account' : 'Sign in as veterinarian';
    if (form) form.action = 'vet-overview.html';
  } else {
    tabOwner.classList.add('active');
    tabVet.classList.remove('active');
    if (wsTitle) wsTitle.textContent = 'Your pet owner workspace';
    if (wsDesc) wsDesc.textContent = 'Manage your pets, appointments, records and reminders.';
    if (emailInput) emailInput.value = 'rohan.patil@example.com';
    if (btnText) btnText.textContent = authMode === 'signup' ? 'Create pet owner account' : 'Sign in as pet owner';
    if (form) form.action = 'overview.html';
  }
}

function toggleAuthMode() {
  authMode = authMode === 'signin' ? 'signup' : 'signin';
  const title = document.querySelector('.signin-form-title');
  const subtitle = document.querySelector('.signin-form-subtitle');
  const nameGroup = document.getElementById('signup-name-group');
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
  } else {
    if (title) title.textContent = 'Good to see you again.';
    if (subtitle) subtitle.textContent = 'Sign in to your Paw Care workspace.';
    if (nameGroup) nameGroup.style.display = 'none';
    if (signinOptions) signinOptions.style.display = 'flex';
    if (btnText) btnText.textContent = currentSignInRole === 'vet' ? 'Sign in as veterinarian' : 'Sign in as pet owner';
    if (togglePrompt) togglePrompt.textContent = 'New to Paw Care?';
    if (toggleBtn) toggleBtn.textContent = 'Create an account';
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
  if (submitBtn) submitBtn.disabled = true;

  try {
    if (authMode === 'signup') {
      const parts = fullName.split(' ');
      const firstName = parts[0] || (currentSignInRole === 'vet' ? 'Dr. Anita' : 'Rohan');
      const lastName = parts.slice(1).join(' ') || (currentSignInRole === 'vet' ? 'Rao' : 'Patil');

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

async function acceptRequest() {
  const actionsDiv = document.getElementById('request-actions');
  const countSpan = document.getElementById('pending-count');
  if (actionsDiv) {
    actionsDiv.innerHTML = '<span class="badge badge-verified">Accepted · Confirmed for Fri, 9 Oct · 10:30 am</span>';
  }
  if (countSpan) {
    countSpan.textContent = '0 requests';
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

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Check URL query parameter for ?role=vet on Sign In page
  const params = new URLSearchParams(window.location.search);
  if (params.get('role') === 'vet') {
    switchRole('vet');
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

  // 3. Filter tabs active state on Health Records page
  const filterTabs = document.querySelectorAll('.role-tabs a.role-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // 4. Attach Sign Out to sidebar signout links
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

  // 5. Hydrate Pet Profile form if present
  if (document.getElementById('pet-name') && window.PawCareSupabase) {
    try {
      const pet = await window.PawCareSupabase.pets.get('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
      if (pet) {
        if (document.getElementById('pet-name')) document.getElementById('pet-name').value = pet.name || '';
        if (document.getElementById('pet-breed')) document.getElementById('pet-breed').value = pet.breed || '';
        if (document.getElementById('pet-age')) document.getElementById('pet-age').value = pet.age || '';
        if (document.getElementById('pet-weight')) document.getElementById('pet-weight').value = pet.weight || '';
        if (document.getElementById('pet-allergies')) document.getElementById('pet-allergies').value = pet.allergies || '';
        if (document.getElementById('pet-past-illness')) document.getElementById('pet-past-illness').value = pet.past_illness || '';
      }
    } catch (e) {
      console.warn('Could not hydrate pet profile', e);
    }
  }

  // 6. Hydrate User Profile form if present
  if (document.getElementById('profile-first-name') && window.PawCareSupabase) {
    try {
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
    } catch (e) {
      console.warn('Could not hydrate user profile', e);
    }
  }

  // 7. Wire Notification Preferences toggles if on reminders page
  const prefToggles = document.querySelectorAll('.pref-row .toggle-switch');
  if (prefToggles && prefToggles.length >= 4) {
    const prefKeys = ['email_reminders', 'sms_reminders', 'push_notifications', 'weekly_digest'];
    prefToggles.forEach((tog, idx) => {
      // Remove any inline onclick to avoid double toggling
      tog.removeAttribute('onclick');
      tog.addEventListener('click', () => {
        handlePreferenceToggle(prefKeys[idx], tog);
      });
    });
  }

  // 8. Update topbar user name if session exists
  if (window.PawCareSupabase) {
    const user = window.PawCareSupabase.auth.getCurrentUser();
    if (user && user.first_name) {
      const userSpan = document.querySelector('.topbar-user span:not(.user-avatar-sm)');
      const avatarSpan = document.querySelector('.topbar-user .user-avatar-sm');
      if (userSpan) userSpan.textContent = `${user.first_name} ${user.last_name || ''}`;
      if (avatarSpan) {
        avatarSpan.textContent = `${user.first_name[0] || 'R'}${user.last_name ? user.last_name[0] : 'P'}`;
      }
    }
  }
});
