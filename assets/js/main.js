/**
 * Brainy Advertise Media - Main Interactive Engine
 * Refined Micro-interactions, Accessibility, and Conversion Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initFaqAccordion();
  initFaqSearch();
  initPortfolioFilter();
  initServicePillSelector();
  initInquiryForm();
  initStatCounters();
  initOfficeClock();
  initBackToTop();
  initScrollReveals();
});

/* ==========================================================================
   1. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}

/* ==========================================================================
   2. Mobile Drawer Navigation
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle') || document.querySelector('#mobileMenuBtn');
  const drawer = document.querySelector('.mobile-drawer') || document.querySelector('#mobileDrawer');
  const overlay = document.querySelector('.mobile-drawer-overlay') || document.querySelector('.drawer-backdrop');
  const closeBtn = document.querySelector('.drawer-close') || document.querySelector('.drawer-close-btn') || document.querySelector('#drawerCloseBtn');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    drawer.setAttribute('aria-hidden', 'true');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Close when clicking nav links inside drawer
  const links = drawer.querySelectorAll('a:not([data-submenu-toggle])');
  links.forEach(l => l.addEventListener('click', closeDrawer));
}

/* ==========================================================================
   3. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Optional: close other items for an accordion feel
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const otherBody = other.querySelector('.faq-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });

    // Keyboard accessibility: Enter or Space
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  // Auto-open first item if desired
  if (faqItems[0]) {
    const firstBody = faqItems[0].querySelector('.faq-body');
    faqItems[0].classList.add('active');
    if (firstBody) firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
  }
}

/* ==========================================================================
   4. FAQ Search Filter
   ========================================================================== */
function initFaqSearch() {
  const searchInput = document.querySelector('.faq-search-input');
  if (!searchInput) return;

  const faqItems = document.querySelectorAll('.faq-item');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    faqItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

/* ==========================================================================
   5. Portfolio Category Filter
   ========================================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-tab-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || card.classList.contains(filter)) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. Service Pill Selector for Forms
   ========================================================================== */
function initServicePillSelector() {
  const pills = document.querySelectorAll('.service-pill-btn');
  const hiddenInput = document.querySelector('#selectedService');

  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      pills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      if (hiddenInput) {
        hiddenInput.value = pill.textContent.trim();
      }
    });
  });
}

/* ==========================================================================
   7. Inquiry Form Validation & Submission
   ========================================================================== */
function initInquiryForm() {
  const forms = document.querySelectorAll('.inquiry-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="your-name"]');
      const email = form.querySelector('[name="your-email"]');
      const number = form.querySelector('[name="your-number"]');
      const project = form.querySelector('[name="your-project"]');

      let isValid = true;

      // Validation
      if (name && !name.value.trim()) {
        showFieldError(name, 'Please enter your name.');
        isValid = false;
      } else if (name) {
        clearFieldError(name);
      }

      if (email && (!email.value.trim() || !validateEmail(email.value.trim()))) {
        showFieldError(email, 'Please enter a valid email address.');
        isValid = false;
      } else if (email) {
        clearFieldError(email);
      }

      if (number && !number.value.trim()) {
        showFieldError(number, 'Please enter your contact number.');
        isValid = false;
      } else if (number) {
        clearFieldError(number);
      }

      if (!isValid) return;

      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText || submitBtn.value : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitBtn.tagName === 'INPUT') submitBtn.value = 'Submitting...';
        else submitBtn.innerHTML = '<span class="live-indicator-dot"></span> Sending...';
      }

      setTimeout(() => {
        showToast('Thank you! Your project details have been received. Our team will contact you within 24 hours.');
        form.reset();
        document.querySelectorAll('.service-pill-btn').forEach(p => p.classList.remove('selected'));
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitBtn.tagName === 'INPUT') submitBtn.value = originalText;
          else submitBtn.innerText = originalText;
        }
      }, 900);
    });
  });

  function showFieldError(input, msg) {
    clearFieldError(input);
    input.style.borderColor = 'var(--color-error)';
    const err = document.createElement('div');
    err.className = 'field-error-msg';
    err.style.color = 'var(--color-error)';
    err.style.fontSize = '12px';
    err.style.marginTop = '4px';
    err.innerText = msg;
    input.parentNode.appendChild(err);
  }

  function clearFieldError(input) {
    input.style.borderColor = '';
    const existing = input.parentNode.querySelector('.field-error-msg');
    if (existing) existing.remove();
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.brainy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'brainy-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background-color: var(--color-primary);
      color: #FFFFFF;
      padding: 14px 24px;
      border-radius: var(--radius-full);
      box-shadow: 0 10px 35px rgba(6, 6, 68, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-size: var(--text-sm);
      font-weight: 600;
      z-index: 9999;
      opacity: 0;
      transition: all 350ms cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 90vw;
      text-align: center;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span class="live-indicator-dot"></span> ${message}`;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 4500);
}
window.showToast = showToast;

/* ==========================================================================
   8. Stat Numbers Counter
   ========================================================================== */
function initStatCounters() {
  const stats = document.querySelectorAll('[data-counter]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out expo
          const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = Math.floor(easeOut * target);

          el.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = target + suffix;
          }
        }

        requestAnimationFrame(update);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  stats.forEach(s => observer.observe(s));
}

/* ==========================================================================
   9. Live Office Local Time Clock (Surat / Gwalior IST)
   ========================================================================== */
function initOfficeClock() {
  const clockEl = document.querySelector('.live-office-clock') || document.querySelector('#officeClock');
  if (!clockEl) return;

  function updateTime() {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const formatter = new Intl.DateTimeFormat([], options);
    const timeStr = formatter.format(new Date());

    // Check office hours: 9:30 AM to 7:00 PM IST
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    const isOpen = totalMinutes >= (9 * 60 + 30) && totalMinutes <= (19 * 60);
    const statusText = isOpen ? 'Surat & Gwalior Offices Open' : 'Offices Reopen 9:30 AM IST';

    clockEl.innerHTML = `<span class="live-indicator-dot" style="background-color: ${isOpen ? '#22C55E' : '#EAB308'}"></span> ${timeStr} IST · ${statusText}`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ==========================================================================
   10. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const topBtn = document.querySelector('.float-top');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  }, { passive: true });

  topBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   11. Scroll Reveals (IntersectionObserver)
   ========================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(r => observer.observe(r));
}
