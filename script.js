/* ============================================
   ELITE ENT CLINIC - MAIN JAVASCRIPT (DEMO)
   ============================================ */

// ---- Navbar Scroll Effect ----
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
})();

// ---- Mobile Menu Toggle ----
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.querySelectorAll('span')[0].style.transform = isOpen ? 'rotate(45deg) translateY(7px)' : '';
    hamburger.querySelectorAll('span')[1].style.opacity = isOpen ? '0' : '1';
    hamburger.querySelectorAll('span')[2].style.transform = isOpen ? 'rotate(-45deg) translateY(-7px)' : '';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });

  // Close on link click
  mobileMenu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
})();

// ---- Scroll Reveal Animation ----
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

// ---- Counter Animation ----
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(current).toLocaleString();
    }, 16);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();

// ---- Active Nav Link ----
(function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ---- Appointment Form (WhatsApp redirect) ----
(function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  const WA_NUMBER = '1234567890';

  function showError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    if (field) field.classList.add('error');
    if (error) { error.textContent = msg; error.classList.add('show'); }
  }

  function clearErrors() {
    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(f => f.classList.remove('error'));
    form.querySelectorAll('.field-error').forEach(e => e.classList.remove('show'));
  }

  function validatePhone(phone) {
    // Generic phone validation - accepts 10+ digits
    return /^\d{10,}$/.test(phone.replace(/[\s\-\+\(\)]/g, ''));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const name    = document.getElementById('name').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    let hasError = false;

    if (!name || name.length < 2) {
      showError('name', 'Please enter your full name (min 2 characters).');
      hasError = true;
    }

    if (!phone) {
      showError('phone', 'Phone number is required.');
      hasError = true;
    } else if (!validatePhone(phone)) {
      showError('phone', 'Enter a valid phone number (10+ digits).');
      hasError = true;
    }

    if (!service) {
      showError('service', 'Please select a service.');
      hasError = true;
    }

    if (hasError) return;

    // Build WhatsApp message
    const waMsg = encodeURIComponent(
      `Hello Elite ENT Clinic 👋\n\n` +
      `I would like to book an appointment.\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Service:* ${service}\n` +
      (message ? `*Problem/Note:* ${message}\n` : '') +
      `\nPlease confirm my appointment slot. Thank you!`
    );

    // Show success briefly, then redirect
    const formContent = document.getElementById('formContent');
    const successMsg  = document.getElementById('formSuccess');

    if (formContent) formContent.style.display = 'none';
    if (successMsg)  successMsg.classList.add('show');

    setTimeout(() => {
      window.open(`https://wa.me/${WA_NUMBER}?text=${waMsg}`, '_blank');
    }, 1200);
  });
})();

// ---- Smooth Scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
