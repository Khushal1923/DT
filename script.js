// Paw Care — Complete Interactive Logic & Page Navigation

let currentSignInRole = 'owner';

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
    if (btnText) btnText.textContent = 'Sign in as veterinarian';
    if (form) form.action = 'vet-overview.html';
  } else {
    tabOwner.classList.add('active');
    tabVet.classList.remove('active');
    if (wsTitle) wsTitle.textContent = 'Your pet owner workspace';
    if (wsDesc) wsDesc.textContent = 'Manage your pets, appointments, records and reminders.';
    if (emailInput) emailInput.value = 'rohan.patil@example.com';
    if (btnText) btnText.textContent = 'Sign in as pet owner';
    if (form) form.action = 'overview.html';
  }
}

function handleSignIn(e) {
  e.preventDefault();
  if (currentSignInRole === 'vet') {
    window.location.href = 'vet-overview.html';
  } else {
    window.location.href = 'overview.html';
  }
}

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

function acceptRequest() {
  const actionsDiv = document.getElementById('request-actions');
  const countSpan = document.getElementById('pending-count');
  if (actionsDiv) {
    actionsDiv.innerHTML = '<span class="badge badge-verified">Accepted · Confirmed for Fri, 9 Oct · 10:30 am</span>';
  }
  if (countSpan) {
    countSpan.textContent = '0 requests';
  }
}

document.addEventListener('DOMContentLoaded', () => {
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
});
