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
        emailInput.placeholder = 'e.g. you@example.com or username';
      }
      if (passInput) {
        passInput.value = '';
        passInput.placeholder = 'Create a secure password (min. 6 chars)';
      }
      if (nameInput) {
        nameInput.placeholder = 'e.g. Alex Morgan or your full name';
      }
    } else {
      if (emailInput && !emailInput.value) {
        emailInput.placeholder = 'e.g. you@example.com or username';
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
      emailInput.placeholder = currentSignInRole === 'vet' ? 'e.g. dr.anita@clinic.com' : 'e.g. you@example.com or username';
    }
    if (passInput) {
      passInput.value = '';
      passInput.placeholder = 'Create a secure password (min. 6 chars)';
      passInput.autocomplete = 'new-password';
    }
    if (nameInput) {
      nameInput.value = '';
      nameInput.placeholder = currentSignInRole === 'vet' ? 'e.g. Dr. Anita Rao' : 'e.g. Alex Morgan or your full name';
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
      emailInput.placeholder = currentSignInRole === 'vet' ? 'e.g. anita.rao@companionclinic.com' : 'e.g. you@example.com or username';
    }
  }
}

async function handleAuthSubmit(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const emailInput = document.getElementById('signin-email');
  const passInput = document.getElementById('signin-password');
  const nameInput = document.getElementById('signin-name');
  const errorBox = document.getElementById('auth-error-msg');
  const submitBtn = document.getElementById('signin-submit');

  const email = emailInput ? emailInput.value.trim() : '';
  const password = passInput ? passInput.value.trim() : '';
  const fullName = nameInput ? nameInput.value.trim() : '';

  if (errorBox) {
    errorBox.style.display = 'none';
    errorBox.innerHTML = '';
  }

  if (!email) {
    if (errorBox) {
      errorBox.style.display = 'block';
      errorBox.style.backgroundColor = '#FDF2E9';
      errorBox.style.color = '#7C4A1E';
      errorBox.textContent = 'Please enter your username or email address.';
    }
    return;
  }

  if (!password) {
    if (errorBox) {
      errorBox.style.display = 'block';
      errorBox.style.backgroundColor = '#FDF2E9';
      errorBox.style.color = '#7C4A1E';
      errorBox.textContent = 'Please enter your password.';
    }
    return;
  }

  if (authMode === 'signup') {
    if (!fullName) {
      if (errorBox) {
        errorBox.style.display = 'block';
        errorBox.style.backgroundColor = '#FDF2E9';
        errorBox.style.color = '#7C4A1E';
        errorBox.textContent = 'Please enter your full name.';
      }
      return;
    }
    if (password.length < 6) {
      if (errorBox) {
        errorBox.style.display = 'block';
        errorBox.style.backgroundColor = '#FDF2E9';
        errorBox.style.color = '#7C4A1E';
        errorBox.textContent = 'Password must be at least 6 characters long.';
      }
      return;
    }
  }

  if (submitBtn) submitBtn.disabled = true;

  try {
    if (authMode === 'signup') {
      const parts = fullName.trim().split(/\s+/);
      const firstName = parts[0] || (currentSignInRole === 'vet' ? 'Dr. Anita' : 'Pet');
      const lastName = parts.slice(1).join(' ') || (currentSignInRole === 'vet' ? 'Rao' : 'Owner');

      const res = await window.PawCareSupabase.auth.signUp(email, password, currentSignInRole, {
        first_name: firstName,
        last_name: lastName,
        full_name: fullName.trim()
      });

      if (res && res.success) {
        if (res.requiresEmailConfirmation) {
          if (errorBox) {
            errorBox.style.display = 'block';
            errorBox.style.backgroundColor = '#EBF5EB';
            errorBox.style.color = '#1E5E22';
            errorBox.innerHTML = `✓ Account created! If confirmation is required, check <strong>${email}</strong>, or sign in now.`;
          }
        } else {
          setTimeout(() => {
            // When any user creates an account, direct him first to fill his data, then pets data, and create a profile
            window.location.href = currentSignInRole === 'vet' ? 'vet-profile.html?setup=1' : 'my-profile.html?setup=1';
          }, 400);
        }
      } else {
        if (errorBox) {
          errorBox.style.display = 'block';
          errorBox.style.backgroundColor = '#FDF2E9';
          errorBox.style.color = '#7C4A1E';
          errorBox.textContent = res?.error || 'Could not create account. Please try again.';
        }
      }
    } else {
      // Sign in mode
      const res = await window.PawCareSupabase.auth.signIn(email, password, currentSignInRole);
      if (res && res.success) {
        const user = window.PawCareSupabase.auth.getCurrentUser();
        const pet = await window.PawCareSupabase.pets.getForOwner(user?.id);
        const needsSetup = currentSignInRole === 'owner' && user && user.profile_completed === false && !pet;

        setTimeout(() => {
          if (currentSignInRole === 'vet') {
            window.location.href = 'vet-overview.html';
          } else if (needsSetup) {
            // Direct to finish profile and pet setup if not completed yet
            window.location.href = 'my-profile.html?setup=1';
          } else {
            window.location.href = 'overview.html';
          }
        }, 400);
      } else {
        if (errorBox) {
          errorBox.style.display = 'block';
          errorBox.style.backgroundColor = '#FDF2E9';
          errorBox.style.color = '#7C4A1E';
          errorBox.innerHTML = res?.error || 'Invalid credentials. Please verify your username/email and password.';
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

// ==========================================================================
// CALENDAR & DATE TIME SYNCHRONIZATION HELPERS
// ==========================================================================

function formatCalendarDate(dateStr) {
  let d;
  if (!dateStr) {
    d = new Date();
  } else if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const parts = dateStr.split('-').map(Number);
    d = new Date(parts[0], parts[1] - 1, parts[2]);
  } else {
    d = new Date(dateStr);
  }
  if (isNaN(d.getTime())) d = new Date();

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayOfWeek = days[d.getDay()];
  const fullDayOfWeek = fullDays[d.getDay()];
  const dayNum = d.getDate();
  const monthStr = months[d.getMonth()];
  const fullMonthStr = fullMonths[d.getMonth()];
  const year = d.getFullYear();

  return {
    iso: `${year}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`,
    short: `${dayOfWeek}, ${dayNum} ${monthStr}`, // "Fri, 24 Oct"
    standard: `${dayOfWeek}, ${dayNum} ${monthStr} ${year}`, // "Fri, 24 Oct 2026"
    full: `${fullDayOfWeek}, ${dayNum} ${fullMonthStr} ${year}`, // "Friday, 24 October 2026"
    dayMonth: `${dayNum} ${monthStr} ${year}` // "24 Oct 2026"
  };
}

function initBookingCalendar() {
  const dateInput = document.getElementById('booking-date-input');
  if (!dateInput) return;

  const today = new Date();
  const todayFormatted = formatCalendarDate(today);

  // Don't allow past dates for booking
  dateInput.min = todayFormatted.iso;
  if (!dateInput.value) {
    dateInput.value = todayFormatted.iso;
  }
  handleBookingDateChange(dateInput.value);
}

function handleBookingDateChange(dateVal) {
  const dateInput = document.getElementById('booking-date-input');
  const val = dateVal || (dateInput ? dateInput.value : '');
  const formatted = formatCalendarDate(val);

  // 1. Update calendar selected label
  const dateDisplay = document.getElementById('booking-date-display');
  if (dateDisplay) {
    dateDisplay.innerHTML = `📅 Selected: <strong>${formatted.full}</strong>`;
  }

  // 2. Update Available slots header
  const slotsTitle = document.getElementById('slots-date-title');
  if (slotsTitle) {
    slotsTitle.textContent = `Available slots for ${formatted.standard}`;
  }

  // 3. Keep hidden select option updated for backwards compatibility
  const dateSelect = document.getElementById('booking-date-select');
  if (dateSelect) {
    if (dateSelect.options.length > 0) {
      dateSelect.options[0].value = formatted.standard;
      dateSelect.options[0].textContent = formatted.standard;
      dateSelect.selectedIndex = 0;
    }
  }

  // 4. Resolve current slot time
  const timeSelect = document.getElementById('booking-time-select');
  const activeSlot = document.querySelector('.slot-btn.active');
  const slotTime = timeSelect && timeSelect.value ? timeSelect.value : (activeSlot ? activeSlot.textContent.trim() : '10:30 am');

  // 5. Update Stepper Step 3
  const stepVal = document.getElementById('step-time-val');
  if (stepVal) {
    stepVal.textContent = `${formatted.short} · ${slotTime}`;
  }

  // 6. Update Summary card
  const summaryVal = document.getElementById('summary-time-val');
  if (summaryVal) {
    summaryVal.textContent = `${formatted.standard} · ${slotTime}`;
  }
}

function handleBookingTimeChange(timeVal) {
  document.querySelectorAll('.slot-btn').forEach(btn => {
    if (btn.textContent.trim() === timeVal) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const dateInput = document.getElementById('booking-date-input');
  const formatted = formatCalendarDate(dateInput ? dateInput.value : '');

  const stepVal = document.getElementById('step-time-val');
  if (stepVal) stepVal.textContent = `${formatted.short} · ${timeVal}`;

  const summaryVal = document.getElementById('summary-time-val');
  if (summaryVal) summaryVal.textContent = `${formatted.standard} · ${timeVal}`;
}

function handleBookingReasonChange(reasonVal) {
  const summaryReason = document.getElementById('summary-reason-val');
  if (summaryReason) {
    summaryReason.textContent = reasonVal.trim() || 'Check-up';
  }
}

function selectSlot(btn, slotTime) {
  document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const timeSelect = document.getElementById('booking-time-select');
  if (timeSelect) timeSelect.value = slotTime;

  const dateInput = document.getElementById('booking-date-input');
  const dateVal = dateInput && dateInput.value ? dateInput.value : '';
  const formatted = formatCalendarDate(dateVal);

  const stepVal = document.getElementById('step-time-val');
  if (stepVal) stepVal.textContent = `${formatted.short} · ${slotTime}`;

  const summaryVal = document.getElementById('summary-time-val');
  if (summaryVal) summaryVal.textContent = `${formatted.standard} · ${slotTime}`;
}

function initWeekScheduleDates() {
  const weekTabs = document.getElementById('week-tabs');
  const weekBreadcrumb = document.getElementById('week-breadcrumb') || document.querySelector('.page-breadcrumb');
  const weekSubtitle = document.getElementById('week-subtitle');
  const weekRangeText = document.getElementById('week-range-text');
  const weekBadge = document.getElementById('week-badge');

  if (!weekTabs && !weekBreadcrumb) return;

  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
  const isoDay = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

  // Monday of current week
  const monday = new Date(today);
  monday.setDate(today.getDate() - isoDay);

  // Sunday of current week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  // Approximate week number of the year
  const firstJan = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstJan) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstJan.getDay() + 1) / 7);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const daysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Breadcrumb
  if (weekBreadcrumb && (window.location.pathname.includes('vet-schedule') || window.location.pathname.includes('vet-week-schedule'))) {
    const todayFull = formatCalendarDate(today).full;
    weekBreadcrumb.textContent = `${todayFull} · Week ${weekNumber}`;
  }

  // Header Subtitle & Range Text
  const monStr = `${monday.getDate()} ${months[monday.getMonth()]}`;
  const sunStr = `${sunday.getDate()} ${months[sunday.getMonth()]} ${sunday.getFullYear()}`;
  if (weekSubtitle) {
    weekSubtitle.textContent = `Schedule for the whole week across all days (${monStr} – ${sunStr}).`;
  }
  if (weekRangeText) {
    weekRangeText.textContent = `Monday, ${monStr} – Sunday, ${sunStr} · 18 total visits scheduled`;
  }
  if (weekBadge) {
    weekBadge.textContent = `Week ${weekNumber}`;
  }

  // Update day selector tabs
  if (weekTabs) {
    const tabButtons = weekTabs.querySelectorAll('.schedule-day-tab');
    for (let i = 0; i < 7; i++) {
      const tabBtn = tabButtons[i + 1];
      if (!tabBtn) continue;
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);

      const dayNameSpan = tabBtn.querySelector('.schedule-day-name');
      const dayDateSpan = tabBtn.querySelector('.schedule-day-date');

      if (dayDateSpan) {
        dayDateSpan.textContent = `${dayDate.getDate()} ${months[dayDate.getMonth()]}`;
      }

      if (i === isoDay) {
        if (dayNameSpan) {
          dayNameSpan.textContent = 'Today';
          dayNameSpan.style.color = 'var(--color-primary)';
          dayNameSpan.style.fontWeight = '800';
        }
        tabBtn.style.borderColor = 'var(--color-primary)';
      } else {
        if (dayNameSpan) {
          dayNameSpan.textContent = daysShort[i];
          dayNameSpan.style.color = '';
          dayNameSpan.style.fontWeight = '';
        }
        tabBtn.style.borderColor = '';
      }
    }
  }
}

async function acceptRequest(cardId, apptId = 'a1111111-1111-1111-1111-111111111111', dateStr = 'Fri, 9 Oct 2026', timeStr = '10:30 am') {
  const card = document.getElementById(cardId) || document.getElementById('req-card-1');
  const countSpan = document.getElementById('pending-count');

  if (card) {
    const actions = card.querySelector('#request-actions') || card.querySelector('div:last-child');
    if (actions) {
      actions.innerHTML = `<span class="badge badge-verified">Accepted · Confirmed for ${dateStr} · ${timeStr}</span>`;
    }
    const badge = card.querySelector('.badge-pending');
    if (badge) {
      badge.className = 'badge badge-verified';
      badge.textContent = 'Confirmed';
    }
  }

  if (countSpan) {
    const text = countSpan.textContent.trim();
    const countMatch = text.match(/\d+/);
    const count = countMatch ? parseInt(countMatch[0], 10) : 1;
    const newCount = Math.max(0, count - 1);
    countSpan.textContent = `${newCount} request${newCount === 1 ? '' : 's'}`;
  }

  if (window.PawCareSupabase) {
    await window.PawCareSupabase.appointments.updateStatus(apptId, 'confirmed');
  }

  // Real-time broadcast
  if (window.PawCareRealtime) {
    window.PawCareRealtime.notifyAppointmentAccepted({
      id: apptId,
      status: 'confirmed',
      pet_name: 'Bruno',
      owner_name: 'Pet Owner',
      date: dateStr,
      time: timeStr,
      reason: 'Visit'
    });
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

// Save Pet Profile for Current User
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

  const petName = nameEl ? nameEl.value.trim() : '';
  if (!petName) {
    let errBox = document.getElementById('pet-validation-error');
    if (!errBox && nameEl) {
      errBox = document.createElement('div');
      errBox.id = 'pet-validation-error';
      errBox.style.color = '#B91C1C';
      errBox.style.fontSize = '0.78rem';
      errBox.style.fontWeight = '600';
      errBox.style.marginTop = '4px';
      nameEl.closest('.form-group').appendChild(errBox);
    }
    if (errBox) errBox.textContent = 'Please enter your pet’s name to complete your profile.';
    if (nameEl) nameEl.focus();
    window.PawCareSupabase?.showToast('Please enter your pet’s name to complete your profile.', 'error');
    return;
  }

  // Remove validation error if fixed
  const errBox = document.getElementById('pet-validation-error');
  if (errBox) errBox.remove();

  const user = window.PawCareSupabase ? window.PawCareSupabase.auth.getCurrentUser() : null;
  const ownerId = user?.id || '00000000-0000-0000-0000-000000000001';

  const updates = {
    name: petName,
    species: speciesEl ? speciesEl.value : 'Dog',
    breed: breedEl && breedEl.value.trim() ? breedEl.value.trim() : 'Companion',
    age: ageEl && ageEl.value.trim() ? ageEl.value.trim() : '',
    weight: weightEl && weightEl.value && !isNaN(parseFloat(weightEl.value)) ? parseFloat(weightEl.value) : 0,
    sex: sexEl ? sexEl.value : 'Male · Neutered',
    microchip: microchipEl && microchipEl.value.trim() ? microchipEl.value.trim() : 'Not added',
    allergies: allergiesEl && allergiesEl.value.trim() ? allergiesEl.value.trim() : 'None reported',
    past_illness: illnessEl && illnessEl.value.trim() ? illnessEl.value.trim() : 'None',
    photo_url: (speciesEl && speciesEl.value === 'Cat') ? 'assets/cat.jpg' : 'assets/pdf_img_4.jpeg'
  };

  if (window.PawCareSupabase) {
    await window.PawCareSupabase.pets.saveForOwner(ownerId, updates);
    await window.PawCareSupabase.profiles.update(ownerId, { profile_completed: true });
  }

  localStorage.setItem('pawcare_pet_name', updates.name);
  localStorage.setItem('pawcare_pet_breed', `${updates.breed}${updates.age ? ' · ' + updates.age : ''}`);

  // Immediate UI reflection on pet-profile page
  const titleName = document.getElementById('pet-title-name');
  if (titleName) titleName.textContent = updates.name;
  const subtitleName = document.getElementById('pet-subtitle-name');
  if (subtitleName) subtitleName.textContent = updates.name;
  const cardName = document.querySelector('.grid-profile-layout .card h2');
  if (cardName) cardName.textContent = updates.name;
  const cardBadge = document.querySelector('.grid-profile-layout .card .badge');
  if (cardBadge) cardBadge.textContent = `${updates.species} · ${updates.breed}`;

  window.PawCareSupabase?.showToast(`🎉 Profile created! Welcome ${updates.name} to Paw Care!`, 'success');

  setTimeout(() => {
    window.location.href = 'overview.html';
  }, 400);
}

// Save User Profile for Current User
async function saveUserProfile(e) {
  if (e) e.preventDefault();
  const firstEl = document.getElementById('profile-first-name');
  const lastEl = document.getElementById('profile-last-name');
  const emailEl = document.getElementById('profile-email');
  const phoneEl = document.getElementById('profile-phone');
  const addressEl = document.getElementById('profile-address');
  const cityEl = document.getElementById('profile-city');
  const postalEl = document.getElementById('profile-postal');

  const user = window.PawCareSupabase ? window.PawCareSupabase.auth.getCurrentUser() : null;
  const targetId = user?.id || '00000000-0000-0000-0000-000000000001';

  const firstName = firstEl && firstEl.value.trim() ? firstEl.value.trim() : (user?.first_name || 'Pet');
  const lastName = lastEl && lastEl.value.trim() ? lastEl.value.trim() : '';
  const fullName = `${firstName} ${lastName}`.trim();
  const email = emailEl && emailEl.value.trim() ? emailEl.value.trim() : (user?.email || '');

  if (!firstName) {
    window.PawCareSupabase?.showToast('Please enter your first name.', 'error');
    if (firstEl) firstEl.focus();
    return;
  }

  const updates = {
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    email: email,
    phone: phoneEl ? phoneEl.value.trim() : '',
    address: addressEl ? addressEl.value.trim() : '',
    city: cityEl ? cityEl.value.trim() : '',
    postal_code: postalEl ? postalEl.value.trim() : ''
  };

  if (window.PawCareSupabase) {
    await window.PawCareSupabase.profiles.update(targetId, updates);
  }

  // Update localStorage helper values immediately
  localStorage.setItem('pawcare_display_name', fullName);
  if (email) localStorage.setItem('pawcare_email', email);
  if (updates.phone) localStorage.setItem('pawcare_phone', updates.phone);

  // Update UI on page immediately
  const initials = ((firstName ? firstName[0] : 'P') + (lastName ? lastName[0] : '')).toUpperCase();
  const cardName = document.getElementById('prof-card-name');
  if (cardName) cardName.textContent = fullName;
  const cardInit = document.getElementById('prof-avatar-initials');
  if (cardInit) cardInit.textContent = initials;
  const topbarName = document.getElementById('prof-topbar-name');
  if (topbarName) topbarName.textContent = fullName;
  const topbarInit = document.getElementById('prof-topbar-initials');
  if (topbarInit) topbarInit.textContent = initials;
  const greetingEl = document.getElementById('prof-greeting-name');
  if (greetingEl) greetingEl.textContent = firstName;

  const params = new URLSearchParams(window.location.search);
  const isSetup = params.get('setup') === '1';

  if (isSetup) {
    window.PawCareSupabase?.showToast('Personal details saved! Step 1 complete. Next: Add your pet →', 'success');
    setTimeout(() => {
      window.location.href = 'pet-profile.html?setup=1';
    }, 400);
  } else {
    window.PawCareSupabase?.showToast('Profile saved successfully!', 'success');
  }
}

// Save Veterinarian Practice Profile
async function saveVetProfile(e) {
  if (e) e.preventDefault();
  const nameEl = document.getElementById('vet-name-input');
  const specialtyEl = document.getElementById('vet-specialty-input');
  const clinicEl = document.getElementById('vet-clinic-input');
  const locationEl = document.getElementById('vet-location-input');
  const phoneEl = document.getElementById('vet-phone-input');
  const hoursEl = document.getElementById('vet-hours-input');

  const user = window.PawCareSupabase ? window.PawCareSupabase.auth.getCurrentUser() : null;
  const targetId = user?.id || '00000000-0000-0000-0000-000000000002';

  const vetUpdates = {
    name: nameEl && nameEl.value.trim() ? nameEl.value.trim() : `Dr. ${user?.first_name || 'Anita'} ${user?.last_name || 'Rao'}`.trim(),
    specialty: specialtyEl && specialtyEl.value.trim() ? specialtyEl.value.trim() : 'General physician, dogs & cats',
    clinic_name: clinicEl && clinicEl.value.trim() ? clinicEl.value.trim() : 'Companion Animal Clinic',
    clinic_location: locationEl && locationEl.value.trim() ? locationEl.value.trim() : 'Deccan, Pune',
    phone: phoneEl && phoneEl.value.trim() ? phoneEl.value.trim() : '+91 98220 12345',
    opening_hours: hoursEl && hoursEl.value.trim() ? hoursEl.value.trim() : 'Mon–Sat · 9:00 am–7:00 pm'
  };

  if (window.PawCareSupabase) {
    await window.PawCareSupabase.vets.saveForVet(targetId, vetUpdates);
  }

  setTimeout(() => {
    window.location.href = 'vet-overview.html';
  }, 500);
}

// Submit Booking Request to Supabase & Real-Time Broadcast
async function submitBookingRequest(e) {
  if (e) e.preventDefault();
  const dateInput = document.getElementById('booking-date-input');
  const dateSelect = document.getElementById('booking-date-select');
  const timeEl = document.getElementById('booking-time-select');
  const reasonEl = document.getElementById('booking-reason-input');

  const rawDate = (dateInput && dateInput.value) ? dateInput.value : (dateSelect ? dateSelect.value : '');
  const formatted = formatCalendarDate(rawDate);
  const chosenDate = formatted.standard;
  const chosenTime = timeEl ? timeEl.value : '10:30 am';
  const chosenReason = reasonEl && reasonEl.value.trim() ? reasonEl.value.trim() : 'Rabies booster';

  const user = window.PawCareSupabase ? window.PawCareSupabase.auth.getCurrentUser() : null;
  let pet = null;
  if (window.PawCareSupabase) {
    pet = await window.PawCareSupabase.pets.getForOwner(user?.id);
  }

  const appointmentData = {
    id: 'apt_' + Date.now(),
    owner_id: user?.id || '00000000-0000-0000-0000-000000000001',
    owner_name: user?.full_name || (user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Pet Owner'),
    pet_id: pet?.id || 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    pet_name: pet?.name || 'Bruno',
    pet_breed: pet?.breed || 'Labrador',
    vet_id: '11111111-1111-1111-1111-111111111111',
    vet_name: 'Dr. Anita Rao',
    clinic_name: 'Companion Animal Clinic',
    location: 'Deccan, Pune',
    date: chosenDate,
    time: chosenTime,
    reason: chosenReason,
    status: 'pending'
  };

  // Stash in localStorage for immediate hydration across pages
  localStorage.setItem('pawcare_last_appointment', JSON.stringify(appointmentData));

  if (window.PawCareSupabase) {
    await window.PawCareSupabase.appointments.create(appointmentData);
  }

  setTimeout(() => {
    window.location.href = 'booking-sent.html';
  }, 400);
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

  const user = window.PawCareSupabase.auth.getCurrentUser();
  const params = new URLSearchParams(window.location.search);
  const isSetup = params.get('setup') === '1';

  // --- 0. Topbar User Avatar & Name across all pages ---
  const displayName = user?.full_name || (user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : null) || localStorage.getItem('pawcare_display_name') || 'Pet Owner';
  const nameParts = displayName.trim().split(/\s+/);
  const initials = nameParts.length >= 2 ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() : displayName.slice(0, 2).toUpperCase();

  document.querySelectorAll('.topbar-user').forEach(topbar => {
    const initEl = topbar.querySelector('.user-avatar-sm') || topbar.querySelector('#topbar-initials') || topbar.querySelector('#prof-topbar-initials') || topbar.querySelector('#vet-topbar-initials');
    if (initEl) initEl.textContent = initials;
    const nameEl = topbar.querySelector('#topbar-name') || topbar.querySelector('#prof-topbar-name') || topbar.querySelector('#vet-topbar-name') || topbar.querySelector('span:not(.user-avatar-sm)');
    if (nameEl) nameEl.textContent = displayName;
  });

  const summaryOwner = document.getElementById('summary-owner-name');
  if (summaryOwner) summaryOwner.textContent = displayName;

  try {
    // 1. Hydrate Pet Data (Overview, Health Records, Pet Profile, My Profile companion)
    const pet = await window.PawCareSupabase.pets.getForOwner(user?.id);

    // Protection: If a pet owner has not completed their profile setup and has no pet, redirect to Step 1 setup
    if (window.location.pathname.includes('overview.html') && user && user.role === 'owner' && user.profile_completed === false && !pet) {
      window.location.href = 'my-profile.html?setup=1';
      return;
    }

    // Pet Profile Form (pet-profile.html)
    if (document.getElementById('pet-name')) {
      const nameEl = document.getElementById('pet-name');
      const speciesEl = document.getElementById('pet-species');
      const breedEl = document.getElementById('pet-breed');
      const ageEl = document.getElementById('pet-age');
      const weightEl = document.getElementById('pet-weight');
      const allergiesEl = document.getElementById('pet-allergies');
      const illnessEl = document.getElementById('pet-past-illness');

      if (pet) {
        if (nameEl) nameEl.value = pet.name || '';
        if (breedEl) breedEl.value = pet.breed || '';
        if (ageEl) ageEl.value = pet.age || '';
        if (weightEl) weightEl.value = (pet.weight !== undefined && pet.weight > 0) ? pet.weight : '';
        if (allergiesEl) allergiesEl.value = pet.allergies || '';
        if (illnessEl) illnessEl.value = pet.past_illness || '';
        if (speciesEl && pet.species) speciesEl.value = pet.species;
      } else if (isSetup) {
        // Clear default placeholder text for brand new users
        if (nameEl) {
          nameEl.value = '';
          nameEl.placeholder = 'e.g. Bruno, Bella, Max, Luna';
          nameEl.required = true;
        }
        if (breedEl) {
          breedEl.value = '';
          breedEl.placeholder = 'e.g. Labrador Retriever, Persian Cat';
        }
        if (ageEl) {
          ageEl.value = '';
          ageEl.placeholder = 'e.g. 3 years, 6 months';
        }
        if (weightEl) {
          weightEl.value = '';
          weightEl.placeholder = 'e.g. 28.4';
        }
        if (allergiesEl) {
          allergiesEl.value = '';
          allergiesEl.placeholder = 'e.g. Chicken protein or None reported';
        }
        if (illnessEl) {
          illnessEl.value = '';
          illnessEl.placeholder = 'e.g. Routine checkup or any treated conditions...';
        }
      }

      // Left card photo details
      const petCardName = document.getElementById('pet-card-name') || document.querySelector('.grid-profile-layout .card h2');
      const petCardBadge = document.getElementById('pet-card-badge') || document.querySelector('.grid-profile-layout .card .badge');
      const petCardPhoto = document.getElementById('pet-card-photo') || document.querySelector('.grid-profile-layout .card img');

      if (petCardName) petCardName.textContent = pet ? pet.name : (isSetup ? 'Your companion' : 'Bruno');
      if (petCardBadge) petCardBadge.textContent = pet ? `${pet.species || 'Dog'} · ${pet.breed || 'Companion'}` : (isSetup ? 'New companion' : 'Dog · Labrador');
      if (petCardPhoto && pet?.photo_url) petCardPhoto.src = pet.photo_url;

      // Header title & subtitle
      const petTitle = document.getElementById('pet-title-name');
      const petSub = document.getElementById('pet-subtitle-name');
      if (isSetup && !pet) {
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) pageTitle.innerHTML = 'Add your <span id="pet-title-name">companion</span>’s details';
        const pageSub = document.querySelector('.page-subtitle');
        if (pageSub) pageSub.innerHTML = 'The little details that help your veterinarian care for your pet.';
        document.title = 'Add Pet Details — Paw Care';
      } else {
        if (petTitle && pet?.name) petTitle.textContent = pet.name;
        if (petSub && pet?.name) petSub.textContent = pet.name;
      }

      // Real-time live preview syncing while typing
      if (nameEl) {
        nameEl.addEventListener('input', () => {
          const val = nameEl.value.trim() || 'Your companion';
          const tName = document.getElementById('pet-title-name');
          if (tName) tName.textContent = val;
          const sName = document.getElementById('pet-subtitle-name');
          if (sName) sName.textContent = val;
          if (petCardName) petCardName.textContent = val;
        });
      }
      if (speciesEl) {
        speciesEl.addEventListener('change', () => {
          const sp = speciesEl.value;
          const b = breedEl && breedEl.value.trim() ? breedEl.value.trim() : 'Companion';
          if (petCardBadge) petCardBadge.textContent = `${sp} · ${b}`;
          if (petCardPhoto) petCardPhoto.src = sp === 'Cat' ? 'assets/cat.jpg' : 'assets/pdf_img_4.jpeg';
        });
      }
      if (breedEl) {
        breedEl.addEventListener('input', () => {
          const sp = speciesEl ? speciesEl.value : 'Dog';
          const b = breedEl.value.trim() || 'Companion';
          if (petCardBadge) petCardBadge.textContent = `${sp} · ${b}`;
        });
      }

      // Setup Step 2 Banner
      if (isSetup) {
        let setupBanner = document.getElementById('setup-step-banner');
        if (!setupBanner) {
          setupBanner = document.createElement('div');
          setupBanner.id = 'setup-step-banner';
          setupBanner.className = 'card-sand mb-4';
          setupBanner.style.border = '2px solid #D9C3AC';
          setupBanner.style.padding = '18px 22px';
          setupBanner.style.borderRadius = '6px';
          setupBanner.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span class="badge" style="background-color: #2E6930; color: #FAF5EC; font-size: 0.74rem; font-weight: 700; padding: 4px 10px;">Step 2 of 2</span>
                  <strong style="font-size: 1.05rem; color: #482B19; font-family: var(--font-heading);">Set Your Pet's Details &amp; Create Profile</strong>
                </div>
                <div style="font-size: 0.82rem; color: #5C4332; line-height: 1.5;">
                  Tell us about your companion so your veterinarian has full context for appointments, vaccinations, and medical records.
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 0.75rem; font-weight: 700; color: #2E6930;">Step 2 of 2</span>
                <div style="width: 100px; height: 8px; background: #E5D7C6; border-radius: 4px; overflow: hidden;">
                  <div style="width: 100%; height: 100%; background: #2E6930; border-radius: 4px;"></div>
                </div>
              </div>
            </div>
          `;
          const mainCol = document.querySelector('.app-main');
          if (mainCol && mainCol.children.length > 1) {
            mainCol.insertBefore(setupBanner, mainCol.children[2]);
          }
        }
        const saveBtn = document.getElementById('pet-save-btn') || document.querySelector('button[onclick="savePetProfile(event)"]');
        if (saveBtn) {
          saveBtn.innerHTML = `
            <span>Save Pet Details &amp; Complete Setup</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 6px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
        }
        const cancelLink = document.getElementById('pet-cancel-link') || document.querySelector('.form-actions-bar a');
        if (cancelLink) {
          cancelLink.href = 'my-profile.html?setup=1';
          cancelLink.textContent = '← Back to personal details';
        }
      }
    }

    // Companion card on My Profile (my-profile.html)
    const profPetName = document.getElementById('prof-pet-name');
    const profPetBreed = document.getElementById('prof-pet-breed');
    const profPetPhoto = document.getElementById('my-prof-pet-photo');
    const profPetLink = document.getElementById('prof-pet-link');

    if (profPetName) {
      if (pet && pet.name) {
        profPetName.textContent = pet.name;
        if (profPetBreed) profPetBreed.textContent = `${pet.breed || 'Companion'}${pet.age ? ' · ' + pet.age : ''}`;
        if (profPetPhoto && pet.photo_url) profPetPhoto.src = pet.photo_url;
      } else if (isSetup || !pet) {
        profPetName.textContent = 'Not added yet';
        if (profPetBreed) profPetBreed.textContent = 'Configured in Step 2';
        if (profPetLink) {
          profPetLink.textContent = 'Next: Add pet profile →';
          profPetLink.href = 'pet-profile.html?setup=1';
        }
      }
    }

    // Overview Pet Summary Card (overview.html)
    const overviewName = document.querySelector('.pet-summary-name');
    const overviewMeta = document.querySelector('.pet-summary-meta');
    const overviewWeight = document.querySelector('.pet-stats-row .stat-value');
    const overviewPetTitle = document.getElementById('overview-pet-name');
    const overviewAvatar = document.querySelector('.pet-summary-flex img.pet-avatar-lg');

    if (overviewName) {
      if (pet) {
        overviewName.textContent = pet.name;
        if (overviewPetTitle) overviewPetTitle.textContent = pet.name;
        if (overviewMeta) overviewMeta.textContent = `${pet.species || 'Dog'} · ${pet.breed || 'Companion'}${pet.age ? ' · ' + pet.age : ''}`;
        if (overviewWeight) overviewWeight.textContent = `${pet.weight || '0'} kg`;
        if (overviewAvatar && pet.photo_url) overviewAvatar.src = pet.photo_url;
      } else {
        overviewName.textContent = 'Add your companion pet';
        if (overviewPetTitle) overviewPetTitle.textContent = 'your companion';
        if (overviewMeta) overviewMeta.textContent = 'Set up your pet’s profile to track visits, vaccinations & health records.';
        if (overviewWeight) overviewWeight.textContent = '-- kg';
        const petBtns = document.querySelector('.pet-action-btns');
        if (petBtns) {
          petBtns.innerHTML = '<a href="pet-profile.html?setup=1" class="btn btn-primary btn-sm">+ Add pet profile</a>';
        }
      }
    }

    // Overview Greeting
    const overviewGreeting = document.getElementById('overview-greeting-name');
    if (overviewGreeting) {
      overviewGreeting.textContent = user?.first_name || (user?.full_name ? user.full_name.split(' ')[0] : 'there');
    }

    // Health Records Hero Card (health-records.html)
    const recordName = document.querySelector('.pet-hero-name');
    if (recordName) {
      recordName.textContent = pet ? pet.name : 'Your Pet';
      const recordBadge = document.querySelector('.pet-hero-name-row .badge');
      if (recordBadge) recordBadge.textContent = pet ? `${pet.species || 'Dog'} · ${pet.breed || 'Companion'}` : 'Companion';
      const recordMeta = document.querySelector('.pet-hero-meta');
      if (recordMeta) recordMeta.textContent = pet ? `${pet.age || ''} · ${pet.weight || ''} kg` : '-- kg';
      const recordAllergy = document.querySelector('.pet-hero-allergy span');
      if (recordAllergy && pet?.allergies) {
        recordAllergy.textContent = pet.allergies;
      }
    }
  } catch (e) {
    console.warn('Could not hydrate pet details', e);
  }

  try {
    // 2. Hydrate User Profile Form (my-profile.html)
    if (document.getElementById('profile-first-name') || document.getElementById('prof-card-name')) {
      const profile = await window.PawCareSupabase.profiles.get(user?.id);
      if (profile || user) {
        const pFirst = profile?.first_name || user?.first_name || '';
        const pLast = profile?.last_name || user?.last_name || '';
        const pEmail = profile?.email || user?.email || '';
        const pFull = profile?.full_name || `${pFirst} ${pLast}`.trim();

        if (document.getElementById('profile-first-name')) document.getElementById('profile-first-name').value = pFirst;
        if (document.getElementById('profile-last-name')) document.getElementById('profile-last-name').value = pLast;
        if (document.getElementById('profile-email')) document.getElementById('profile-email').value = pEmail;
        if (document.getElementById('profile-phone')) document.getElementById('profile-phone').value = profile?.phone || '';
        if (document.getElementById('profile-address')) document.getElementById('profile-address').value = profile?.address || '';
        if (document.getElementById('profile-city')) document.getElementById('profile-city').value = profile?.city || '';
        if (document.getElementById('profile-postal')) document.getElementById('profile-postal').value = profile?.postal_code || '';

        // Left Owner Card
        const cardInitial = document.getElementById('prof-avatar-initials') || document.querySelector('.grid-profile-layout .card > div:first-child');
        const cardName = document.getElementById('prof-card-name') || document.querySelector('.grid-profile-layout .card h2');
        const cardMember = document.querySelector('.grid-profile-layout .card .stat-value');
        const greetingName = document.getElementById('prof-greeting-name');
        if (greetingName && pFirst) greetingName.textContent = pFirst;

        if (cardInitial) {
          const init1 = pFirst ? pFirst[0].toUpperCase() : 'P';
          const init2 = pLast ? pLast[0].toUpperCase() : 'O';
          cardInitial.textContent = `${init1}${init2}`;
        }
        if (cardName) {
          cardName.textContent = pFull;
        }
        if (cardMember) {
          cardMember.textContent = profile?.member_since || 'October 2026';
        }

        // Setup Step 1 Banner
        if (isSetup) {
          let setupBanner = document.getElementById('setup-step-banner');
          if (!setupBanner) {
            setupBanner = document.createElement('div');
            setupBanner.id = 'setup-step-banner';
            setupBanner.className = 'card-sand mb-4';
            setupBanner.style.border = '2px solid #D9C3AC';
            setupBanner.style.padding = '18px 22px';
            setupBanner.style.borderRadius = '6px';
            setupBanner.innerHTML = `
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span class="badge" style="background-color: #482B19; color: #FAF5EC; font-size: 0.74rem; font-weight: 700; padding: 4px 10px;">Step 1 of 2</span>
                    <strong style="font-size: 1.05rem; color: #482B19; font-family: var(--font-heading);">Fill Your Personal Details</strong>
                  </div>
                  <div style="font-size: 0.82rem; color: #5C4332; line-height: 1.5;">
                    Welcome to Paw Care, <strong>${pFirst || 'Pet Owner'}</strong>! Please confirm your contact information below. Next, you'll set up your companion pet's profile.
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 0.75rem; font-weight: 700; color: #7C5F4B;">Step 1 of 2</span>
                  <div style="width: 100px; height: 8px; background: #E5D7C6; border-radius: 4px; overflow: hidden;">
                    <div style="width: 50%; height: 100%; background: #482B19; border-radius: 4px;"></div>
                  </div>
                </div>
              </div>
            `;
            const mainCol = document.querySelector('.app-main');
            if (mainCol && mainCol.children.length > 1) {
              mainCol.insertBefore(setupBanner, mainCol.children[2]);
            }
          }
          const saveBtn = document.getElementById('prof-save-btn') || document.querySelector('button[onclick="saveUserProfile(event)"]');
          if (saveBtn) {
            saveBtn.innerHTML = `
              <span>Save &amp; Continue to Pet's Details</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 6px;">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            `;
          }
          const cancelLink = document.getElementById('prof-cancel-btn') || document.querySelector('.form-actions-bar a');
          if (cancelLink) {
            cancelLink.href = 'pet-profile.html?setup=1';
            cancelLink.textContent = 'Skip to pet details →';
          }
        }
      }
    }
  } catch (e) {
    console.warn('Could not hydrate user profile', e);
  }

  // 3. Hydrate Veterinarian Practice Profile (vet-profile.html)
  try {
    if (window.location.pathname.includes('vet-profile.html') || document.getElementById('vet-name-input')) {
      const vet = await window.PawCareSupabase.vets.getForUser(user?.id);
      if (vet || user) {
        const docName = vet?.name || (user?.first_name ? `Dr. ${user.first_name} ${user.last_name || ''}`.trim() : 'Dr. Anita Rao');
        const docNameEl = document.querySelector('.grid-booking-layout .card h2');
        if (docNameEl) docNameEl.textContent = docName;
        const clinicNameEl = document.getElementById('vet-card-clinic-name') || document.querySelector('#clinic [style*="font-weight: 600"]');
        if (clinicNameEl && vet?.clinic_name) clinicNameEl.textContent = vet.clinic_name;
        const clinicLocEl = document.getElementById('vet-card-clinic-location');
        if (clinicLocEl && vet?.clinic_location) clinicLocEl.textContent = vet.clinic_location;
        const clinicHoursEl = document.getElementById('vet-card-clinic-hours');
        if (clinicHoursEl && vet?.opening_hours) clinicHoursEl.textContent = vet.opening_hours;

        // Populate practice configuration inputs
        const nameInput = document.getElementById('vet-name-input');
        const specialtyInput = document.getElementById('vet-specialty-input');
        const clinicInput = document.getElementById('vet-clinic-input');
        const locInput = document.getElementById('vet-location-input');
        const phoneInput = document.getElementById('vet-phone-input');
        const hoursInput = document.getElementById('vet-hours-input');

        if (nameInput) nameInput.value = docName;
        if (specialtyInput) specialtyInput.value = vet?.specialty || 'General physician, dogs & cats';
        if (clinicInput) clinicInput.value = vet?.clinic_name || 'Companion Animal Clinic';
        if (locInput) locInput.value = vet?.clinic_location || 'Deccan, Pune';
        if (phoneInput) phoneInput.value = vet?.phone || '+91 98220 12345';
        if (hoursInput) hoursInput.value = vet?.opening_hours || 'Mon–Sat · 9:00 am–7:00 pm';

        // If logged-in user is a veterinarian, switch the sidebar navigation to Veterinarian links
        if (user?.role === 'vet') {
          const sidebarRole = document.querySelector('.sidebar-role-label');
          if (sidebarRole) sidebarRole.textContent = 'VETERINARIAN';
          const sidebarNav = document.querySelector('.sidebar-nav');
          if (sidebarNav) {
            sidebarNav.innerHTML = `
              <a href="vet-overview.html" class="sidebar-link">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                <span>Overview</span>
              </a>
              <a href="vet-week-schedule.html" class="sidebar-link">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>Week schedule</span>
              </a>
              <a href="vet-requests-availability.html" class="sidebar-link">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
                <span>Request &amp; availability</span>
              </a>
              <a href="vet-consultation.html" class="sidebar-link">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                <span>Records</span>
              </a>
              <a href="vet-profile.html" class="sidebar-link active">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>My profile</span>
              </a>
            `;
          }
        }

        if (isSetup) {
          let setupBanner = document.getElementById('vet-setup-banner');
          if (!setupBanner) {
            setupBanner = document.createElement('div');
            setupBanner.id = 'vet-setup-banner';
            setupBanner.className = 'alert alert-success d-flex align-items-center justify-content-between p-3 mb-4 rounded-3 shadow-sm';
            setupBanner.style.backgroundColor = '#FAF5EC';
            setupBanner.style.border = '1px solid #D9C3AC';
            setupBanner.style.color = '#482B19';
            setupBanner.innerHTML = `
              <div>
                <strong style="font-size: 0.96rem;">🩺 Welcome to Paw Care Practice!</strong>
                <div style="font-size: 0.8rem; margin-top: 2px;">Please review and configure your clinic information, specialties, and consultation availability.</div>
              </div>
              <span class="badge bg-dark text-white px-3 py-2" style="font-size: 0.76rem;">Practice Setup</span>
            `;
            const mainCol = document.querySelector('.app-main');
            if (mainCol && mainCol.children.length > 1) {
              mainCol.insertBefore(setupBanner, mainCol.children[2]);
            }
          }
          const saveBtn = document.getElementById('vet-save-btn');
          if (saveBtn) saveBtn.textContent = 'Save practice details & go to dashboard →';
        }
      }
    }
  } catch (e) {
    console.warn('Could not hydrate vet profile', e);
  }

  // 4. Topbar User Name across all workspace pages
  try {
    const activeName = (user && (user.full_name || (user.first_name ? (user.role === 'vet' ? `Dr. ${user.first_name} ${user.last_name || ''}`.trim() : `${user.first_name} ${user.last_name || ''}`.trim()) : null))) || localStorage.getItem('pawcare_display_name') || 'Pet Owner';
    const parts = activeName.trim().split(/\s+/);
    const inits = parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : activeName.slice(0, 2).toUpperCase();

    document.querySelectorAll('.topbar-user').forEach(topbar => {
      const userSpan = topbar.querySelector('#topbar-name') || topbar.querySelector('#prof-topbar-name') || topbar.querySelector('#vet-topbar-name') || topbar.querySelector('span:not(.user-avatar-sm)');
      const avatarSpan = topbar.querySelector('#topbar-initials') || topbar.querySelector('#prof-topbar-initials') || topbar.querySelector('#vet-topbar-initials') || topbar.querySelector('.user-avatar-sm');
      if (userSpan) userSpan.textContent = activeName;
      if (avatarSpan) avatarSpan.textContent = inits;
    });
  } catch (e) {
    console.warn('Could not update topbar user name', e);
  }

  // 5. Real-Time Appointment Synchronization via Socket.io
  if (window.PawCareRealtime) {
    // Pet owner dashboard: listen for doctor appointment acceptance
    window.PawCareRealtime.onAppointmentAccepted((data) => {
      // 1. Table rows in overview.html and reminders.html
      const pendingBadges = document.querySelectorAll('.data-table .badge-pending, .appt-status-cell .badge-pending');
      pendingBadges.forEach(b => {
        b.className = 'badge badge-verified';
        b.textContent = 'Confirmed';
        const tr = b.closest('tr');
        if (tr) {
          tr.style.transition = 'background-color 0.4s';
          tr.style.backgroundColor = '#EBF5EB';
          setTimeout(() => tr.style.backgroundColor = '', 3000);
        }
      });

      // 2. Overview pending alert card
      const dueText = document.getElementById('overview-pending-text') || document.querySelector('.card-sand p');
      if (dueText && (dueText.textContent.includes('awaiting') || dueText.textContent.includes('Dr. Anita Rao'))) {
        dueText.innerHTML = `Confirmed with Dr. Anita Rao. Your visit is scheduled for <strong>${data.date || 'Fri, 9 Oct'}</strong> at <strong>${data.time || '10:30 am'}</strong>.`;
        const dueBadge = document.getElementById('overview-pending-badge') || document.querySelector('.card-sand .badge-pending');
        if (dueBadge) {
          dueBadge.className = 'badge badge-verified';
          dueBadge.textContent = 'Confirmed';
        }
      }

      // 3. Booking-sent page: update if open
      const bookingSentBadge = document.querySelector('.grid-profile-layout .card .badge-pending');
      if (bookingSentBadge) {
        bookingSentBadge.className = 'badge badge-verified';
        bookingSentBadge.textContent = 'Confirmed';
        const title = document.querySelector('.grid-profile-layout .card h2.card-title');
        if (title) title.textContent = 'Appointment Confirmed!';
        const desc = document.querySelector('.grid-profile-layout .card p');
        if (desc) desc.textContent = `Dr. Anita Rao has accepted your booking request for ${data.date || 'Fri, 9 Oct'} at ${data.time || '10:30 am'}.`;
      }

      if (window.PawCareSupabase && typeof window.PawCareSupabase.showToast === 'function') {
        window.PawCareSupabase.showToast(`🎉 Appointment confirmed! Dr. Anita Rao accepted your booking request for ${data.date || 'Fri, 9 Oct'}.`, 'success');
      }
    });

    // Veterinarian dashboard: listen for incoming booking requests
    window.PawCareRealtime.onAppointmentCreated((appt) => {
      if (typeof addPendingRequestCard === 'function') {
        addPendingRequestCard(appt);
      }
      if (window.PawCareSupabase && typeof window.PawCareSupabase.showToast === 'function') {
        window.PawCareSupabase.showToast(`🔔 New booking request from ${appt.owner_name} for ${appt.pet_name} (${appt.reason})!`, 'info');
      }
    });
  }

  // 6. Wire Notification Preferences toggles if on reminders page
  const prefToggles = document.querySelectorAll('.pref-row .toggle-switch');
  if (prefToggles && prefToggles.length >= 4) {
    const prefKeys = ['email_reminders', 'sms_reminders', 'push_notifications', 'weekly_digest'];
    prefToggles.forEach((tog, idx) => {
      tog.removeAttribute('onclick');
      tog.onclick = () => handlePreferenceToggle(prefKeys[idx], tog);
    });
  }

  // 7. Wire Health records filter tabs
  const filterTabs = document.querySelectorAll('.role-tabs a.role-tab');
  filterTabs.forEach(tab => {
    tab.onclick = function (ev) {
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    };
  });

  // 8. Hydrate Dynamic Calendar & Appointments Data Across All Pages
  try {
    // A. If on book-appointment page, initialize calendar date picker
    if (document.getElementById('booking-date-input')) {
      initBookingCalendar();
      if (pet) {
        const stepPet = document.getElementById('step-pet-val');
        if (stepPet) stepPet.textContent = pet.name;
        const sumPetName = document.getElementById('summary-pet-name');
        if (sumPetName) sumPetName.textContent = pet.name;
        const sumPetMeta = document.getElementById('summary-pet-meta');
        if (sumPetMeta) sumPetMeta.textContent = `${pet.breed || 'Labrador'} · ${pet.age || '3 years'}`;
      }
    }

    // B. If on booking-sent page, hydrate with newly created appointment
    if (document.getElementById('sent-booking-datetime')) {
      let lastAppt = null;
      try {
        const saved = localStorage.getItem('pawcare_last_appointment');
        if (saved) lastAppt = JSON.parse(saved);
      } catch (e) {}

      if (!lastAppt && window.PawCareSupabase) {
        const appts = await window.PawCareSupabase.appointments.list({ owner_id: user?.id });
        if (appts && appts.length > 0) lastAppt = appts[0];
      }

      if (lastAppt) {
        const dtEl = document.getElementById('sent-booking-datetime');
        if (dtEl) dtEl.textContent = `${lastAppt.date} · ${lastAppt.time}`;
        const reasonEl = document.getElementById('sent-booking-reason');
        if (reasonEl) reasonEl.textContent = lastAppt.reason || 'Check-up';
        const subName = document.getElementById('sent-subtitle-pet-name');
        if (subName) subName.textContent = lastAppt.pet_name || (pet ? pet.name : 'Bruno');
        const petNameEl = document.getElementById('sent-pet-name');
        if (petNameEl) petNameEl.textContent = lastAppt.pet_name || (pet ? pet.name : 'Bruno');
        const petMetaEl = document.getElementById('sent-pet-meta');
        if (petMetaEl) petMetaEl.textContent = lastAppt.pet_breed || (pet ? `${pet.species} · ${pet.breed} · ${pet.age}` : 'Dog · Labrador · 3 years');
        const vetNameEl = document.getElementById('sent-vet-name');
        if (vetNameEl) vetNameEl.textContent = lastAppt.vet_name || 'Dr. Anita Rao';
        const clinicNameEl = document.getElementById('sent-clinic-name');
        if (clinicNameEl) clinicNameEl.textContent = lastAppt.clinic_name || 'Companion Animal Clinic';
        const clinicLocEl = document.getElementById('sent-clinic-location');
        if (clinicLocEl) clinicLocEl.textContent = lastAppt.location || 'Deccan, Pune';
        const ownerEl = document.getElementById('summary-owner-name');
        if (ownerEl && lastAppt.owner_name) ownerEl.textContent = lastAppt.owner_name;
      }
    }

    // C. Hydrate Overview & Reminders dynamic appointments table and sand card
    const upcomingTbody = document.getElementById('upcoming-appts-tbody');
    const remindersTbody = document.getElementById('reminders-appts-tbody');
    const overviewPendingCard = document.getElementById('overview-pending-alert-card');
    const remindersPendingCard = document.getElementById('reminders-pending-alert-card');

    if (upcomingTbody || remindersTbody || overviewPendingCard || remindersPendingCard) {
      let appts = [];
      if (window.PawCareSupabase) {
        appts = await window.PawCareSupabase.appointments.list({ owner_id: user?.id });
      }

      try {
        const lastRaw = localStorage.getItem('pawcare_last_appointment');
        if (lastRaw) {
          const lastObj = JSON.parse(lastRaw);
          if (lastObj && !appts.some(a => a.id === lastObj.id)) {
            appts.unshift(lastObj);
          }
        }
      } catch (e) {}

      if (appts && appts.length > 0) {
        const rowsHtml = appts.map((a, idx) => {
          const isConfirmed = a.status === 'confirmed';
          const badgeClass = isConfirmed ? 'badge-verified' : 'badge-pending';
          const statusText = isConfirmed ? 'Confirmed' : 'Awaiting acceptance';
          const linkUrl = isConfirmed ? 'health-records.html' : 'booking-sent.html';
          const linkText = isConfirmed ? 'View visit' : 'View request';
          return `
            <tr id="upcoming-appt-row-${idx + 1}" data-appointment-id="${a.id}">
              <td>
                <span class="td-bold">${a.date}</span>
                <span class="td-sub">${a.time}</span>
              </td>
              <td>
                <a href="vet-profile.html" class="td-bold">${a.vet_name || 'Dr. Anita Rao'}</a>
                <span class="td-sub">${a.clinic_name || 'Companion Animal Clinic'}</span>
              </td>
              <td>${a.reason || 'Routine Checkup'}</td>
              <td class="appt-status-cell"><span class="badge ${badgeClass}">${statusText}</span></td>
              <td style="text-align: right;"><a href="${linkUrl}" class="card-link">${linkText}</a></td>
            </tr>
          `;
        }).join('');

        if (upcomingTbody) upcomingTbody.innerHTML = rowsHtml;
        if (remindersTbody) remindersTbody.innerHTML = rowsHtml;

        const latestAppt = appts.find(a => a.status === 'pending') || appts[0];
        if (latestAppt) {
          const isPend = latestAppt.status === 'pending';
          const badgeClass = isPend ? 'badge-pending' : 'badge-verified';
          const badgeText = isPend ? `Awaiting acceptance · ${latestAppt.date}` : `Confirmed · ${latestAppt.date}`;
          const bodyText = `Scheduled for <strong>${latestAppt.date} · ${latestAppt.time}</strong>. Your request for ${latestAppt.pet_name || 'your pet'} is ${isPend ? "awaiting Dr. Anita Rao's acceptance." : "confirmed with Dr. Anita Rao."}`;

          if (document.getElementById('overview-pending-title')) {
            document.getElementById('overview-pending-title').textContent = latestAppt.reason || 'Visit';
          }
          if (document.getElementById('overview-pending-badge')) {
            const ob = document.getElementById('overview-pending-badge');
            ob.className = `badge ${badgeClass}`;
            ob.textContent = badgeText;
          }
          if (document.getElementById('overview-pending-text')) {
            document.getElementById('overview-pending-text').innerHTML = bodyText;
          }

          if (document.getElementById('reminders-pending-title')) {
            document.getElementById('reminders-pending-title').textContent = latestAppt.reason || 'Visit';
          }
          if (document.getElementById('reminders-pending-badge')) {
            const rb = document.getElementById('reminders-pending-badge');
            rb.className = `badge ${badgeClass}`;
            rb.textContent = badgeText;
          }
          if (document.getElementById('reminders-pending-text')) {
            document.getElementById('reminders-pending-text').innerHTML = bodyText;
          }
        }
      }
    }

    // D. Hydrate Veterinarian Pending Requests on vet-requests-availability.html
    const pendingListContainer = document.getElementById('pending-requests-list');
    if (pendingListContainer && window.PawCareSupabase) {
      const pendingAppts = await window.PawCareSupabase.appointments.list({ status: 'pending' });
      if (pendingAppts && pendingAppts.length > 0) {
        pendingListContainer.innerHTML = pendingAppts.map((a, idx) => `
          <div class="card-sand" style="margin-bottom: 14px;" id="req-card-${idx + 1}">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 4px;">
              <div style="font-size: 0.88rem; font-weight: 800; color: var(--color-heading);">${a.pet_name} · ${a.pet_breed || 'Companion'}</div>
              <span class="badge badge-pending">Pending</span>
            </div>
            <div style="font-size: 0.74rem; color: var(--color-muted); margin-bottom: 2px;">Owner: ${a.owner_name}</div>
            <div style="font-size: 0.75rem; color: var(--color-body); margin-bottom: 12px; font-weight: 600;">
              ${a.reason} · ${a.date} · ${a.time}
            </div>
            <div style="display: flex; gap: 8px;" id="request-actions-${idx + 1}">
              <button type="button" class="btn btn-primary btn-sm" onclick="acceptRequest('req-card-${idx + 1}', '${a.id}', '${a.date}', '${a.time}')">Accept</button>
              <button type="button" class="btn btn-outline btn-sm" style="background-color: #FFFFFF;" onclick="alert('Reschedule notification sent to ${a.owner_name}.')">Reschedule</button>
            </div>
          </div>
        `).join('');
        const pCount = document.getElementById('pending-count');
        if (pCount) pCount.textContent = `${pendingAppts.length} request${pendingAppts.length === 1 ? '' : 's'}`;
      }
    }

    // E. Hydrate Vet Overview Date Subtitle
    const vetDateSub = document.getElementById('vet-today-date-sub');
    if (vetDateSub) {
      const todayFull = formatCalendarDate(new Date()).full;
      vetDateSub.textContent = `${todayFull} · Companion Animal Clinic`;
    }

    // F. Hydrate Dynamic Week Schedule Dates
    initWeekScheduleDates();
  } catch (err) {
    console.warn('Error hydrating dynamic appointments and calendar dates:', err);
  }
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
    owner: 'Pet Owner',
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
    communication: 'Advised owner to maintain strict chicken-free diet. Follow up in 7 days. Rabies booster scheduled for Fri, 9 Oct.',
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

async function saveConsultationRecord(e) {
  if (e) e.preventDefault();
  const patient = patientRecordsData[currentRecordKey];
  const petName = patient ? patient.name : 'Patient';

  const dateEl = document.getElementById('consult-date');
  const timeEl = document.getElementById('consult-time');
  const complaintEl = document.getElementById('consult-chief-complaint');
  const diagInput = document.getElementById('consult-diagnosis');
  const notesEl = document.getElementById('consult-clinical-notes');
  const commEl = document.getElementById('consult-communication');
  const followupEl = document.getElementById('consult-followup');

  // Read prescriptions table rows dynamically
  const prescriptions = [];
  const rows = document.querySelectorAll('#prescription-table-body tr');
  rows.forEach(tr => {
    const inputs = tr.querySelectorAll('.prescription-input');
    if (inputs.length >= 4) {
      const med = inputs[0].value.trim();
      const dosage = inputs[1].value.trim();
      const duration = inputs[2].value.trim();
      const instructions = inputs[3].value.trim();
      if (med) {
        prescriptions.push({ medicine: med, dosage, duration, instructions });
      }
    }
  });

  // Update in-memory patient record data
  if (patient) {
    if (diagInput) patient.diagnosis = diagInput.value.trim();
    if (notesEl) patient.clinicalNotes = notesEl.value.trim();
    if (complaintEl) patient.chiefComplaint = complaintEl.value.trim();
    if (commEl) patient.communication = commEl.value.trim();
    if (followupEl) patient.followup = followupEl.value.trim();
    if (prescriptions.length > 0) patient.prescriptions = prescriptions;

    // Prepend to history log
    patient.history = patient.history || [];
    const todayStr = dateEl ? dateEl.value.trim() : '7 Oct 2026';
    const diagShort = diagInput ? diagInput.value.trim().slice(0, 80) + '...' : 'Consultation notes updated';
    patient.history.unshift({
      date: todayStr,
      title: complaintEl ? complaintEl.value.trim().slice(0, 45) : 'Consultation examination',
      desc: diagShort
    });

    const historyListEl = document.getElementById('detail-history-list');
    if (historyListEl) {
      historyListEl.innerHTML = patient.history.map(item => `
        <div class="history-item">
          <div class="history-date">${item.date}</div>
          <div class="history-title">${item.title}</div>
          <div class="history-sub">${item.desc}</div>
        </div>
      `).join('');
    }
  }

  // Persist to Supabase and Local Storage
  const recordData = {
    pet_id: currentRecordKey === 'bruno' ? 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' : (window.PawCareSupabase?.generateUUID ? window.PawCareSupabase.generateUUID() : 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    vet_id: '11111111-1111-1111-1111-111111111111',
    consultation_date: dateEl ? dateEl.value : '7 Oct 2026',
    consultation_time: timeEl ? timeEl.value : '9:00 am',
    reason: complaintEl && complaintEl.value.trim() ? complaintEl.value.trim().slice(0, 80) : 'Ear inflammation follow-up',
    chief_complaint: complaintEl ? complaintEl.value.trim() : '',
    diagnosis_notes: diagInput ? diagInput.value.trim() : '',
    owner_communication: commEl ? commEl.value.trim() : '',
    follow_up_appointment: followupEl ? followupEl.value.trim() : '',
    prescriptions: prescriptions.length > 0 ? prescriptions : [
      { medicine: 'Otomax Ear Drops', dosage: '3 drops', duration: '7 days', instructions: 'In left ear once daily' }
    ],
    vaccinations: patient?.vaccinations || [
      { vaccine: 'Rabies', date: 'Not administered', next_due: '9 Oct 2026', status: 'Pending acceptance' },
      { vaccine: 'DHPP', date: '21 Mar 2026', next_due: '21 Dec 2026', status: 'Next due 21 Dec 2026' }
    ]
  };

  if (window.PawCareSupabase) {
    await window.PawCareSupabase.medicalRecords.create(recordData);
  }

  // Show visual confirmation toast
  const toastEl = document.getElementById('consult-save-toast');
  if (toastEl) {
    toastEl.style.display = 'block';
    toastEl.innerHTML = `✓ Medical record, diagnosis, and prescription saved successfully for <strong>${petName}</strong>! Shared with care circle.`;
    setTimeout(() => {
      toastEl.style.display = 'none';
    }, 4500);
  }
}

