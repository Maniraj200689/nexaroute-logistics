/**
 * NexaRoute Logistics - Main Shared JavaScript
 * Handles navigation, mobile menu drawer, scroll behaviors, and interactive widgets.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initMobileDrawer();
  initTrackingWidget();
  initQuoteModal();
  highlightActiveNav();
  initFaqAccordion();

  // Initialize Lucide icons if loaded
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
});

/**
 * Dark / Light Mode Theme Switcher
 */
function initThemeToggle() {
  const savedTheme = localStorage.getItem('nexaroute_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nexaroute_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nexaroute_theme', 'light');
    }
    updateToggleIcons(dark);
  };

  const updateToggleIcons = (dark) => {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.innerHTML = dark
        ? `<svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`
        : `<svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
      btn.setAttribute('aria-label', dark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  };

  applyTheme(isDark);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentlyDark = document.documentElement.classList.contains('dark');
      applyTheme(!currentlyDark);
    });
  });
}

/**
 * Sticky Navbar behavior on scroll
 */
function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile drawer open/close and keyboard accessibility
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.remove('translate-x-full', 'invisible');
    drawer.classList.add('translate-x-0', 'visible', 'open');
    if (backdrop) backdrop.classList.remove('hidden');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus first link in drawer
    const firstLink = drawer.querySelector('a, button');
    if (firstLink) firstLink.focus();
  };

  const closeDrawer = () => {
    drawer.classList.add('translate-x-full', 'invisible');
    drawer.classList.remove('translate-x-0', 'visible', 'open');
    if (backdrop) backdrop.classList.add('hidden');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggleBtn.focus();
  };

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Close drawer on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.classList.contains('translate-x-full')) {
      closeDrawer();
    }
  });
}

/**
 * Highlight active link in header & mobile drawer based on current page
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  const pageName = currentPath.split('/').pop() || 'index.html';

  const navLinks = document.querySelectorAll('[data-nav-link]');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const targetPage = href.split('/').pop() || 'index.html';

    const isHome = (pageName === '' || pageName === 'index.html') && (targetPage === '' || targetPage === 'index.html');
    const isMatch = isHome || (pageName === targetPage);

    if (isMatch) {
      link.classList.add('text-orange-500', 'font-semibold');
      link.classList.remove('text-slate-300', 'hover:text-white');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/**
 * Interactive Live Tracking Bar Widget on Home
 */
function initTrackingWidget() {
  const trackingForm = document.getElementById('tracking-form');
  const trackingInput = document.getElementById('tracking-input');
  const trackingResultModal = document.getElementById('tracking-modal');
  const modalClose = document.getElementById('tracking-modal-close');
  const modalContent = document.getElementById('tracking-modal-content');

  if (!trackingForm || !trackingInput) return;

  trackingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = trackingInput.value.trim().toUpperCase() || 'NX-IND-99218';
    window.location.href = `track.html?awb=${encodeURIComponent(query)}`;
  });
}

/**
 * Universal Quote Modal
 */
function initQuoteModal() {
  const openButtons = document.querySelectorAll('[data-open-quote-modal]');
  const quoteModal = document.getElementById('global-quote-modal');
  const closeButton = document.getElementById('quote-modal-close');
  const quickQuoteForm = document.getElementById('quick-quote-form');

  if (!quoteModal) return;

  const openModal = () => {
    quoteModal.classList.remove('hidden');
    quoteModal.classList.add('flex');
    const firstInput = quoteModal.querySelector('input');
    if (firstInput) firstInput.focus();
  };

  const closeModal = () => {
    quoteModal.classList.add('hidden');
    quoteModal.classList.remove('flex');
  };

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (closeButton) closeButton.addEventListener('click', closeModal);

  quoteModal.addEventListener('click', (e) => {
    if (e.target === quoteModal) closeModal();
  });

  if (quickQuoteForm) {
    quickQuoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const quoteSuccessMsg = document.getElementById('quick-quote-success');
      const submitBtn = quickQuoteForm.querySelector('button[type="submit"]');
      const inputs = quickQuoteForm.querySelectorAll('input, select');
      
      const payload = {
        name: (inputs[0] ? inputs[0].value : '').trim(),
        phone: (inputs[1] ? inputs[1].value : '').trim(),
        email: 'inquiry@' + ((inputs[0] ? inputs[0].value.split(' ')[0] : 'client').toLowerCase().replace(/[^a-z0-9]/g, '')) + '.example.com',
        service: inputs[2] ? inputs[2].value : 'Express Surface (PTL)',
        volume: 'Quote Request: ' + (inputs[3] ? inputs[3].value : 'Origin') + ' to ' + (inputs[4] ? inputs[4].value : 'Dest'),
        message: 'Direct quote inquiry from quick modal: ' + (inputs[3] ? inputs[3].value : '') + ' -> ' + (inputs[4] ? inputs[4].value : '')
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Submitting Request...</span>';
      }

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        if (quoteSuccessMsg) {
          quoteSuccessMsg.classList.remove('hidden');
          const ticketNotice = quoteSuccessMsg.querySelector('p');
          if (ticketNotice && data.ticketId) {
            ticketNotice.innerHTML = `Our regional dispatch manager will call you within 15 minutes with customized slab rates.<br><span class="font-mono text-emerald-300 font-bold block mt-1">Ticket Reference: #${data.ticketId}</span>`;
          }
          quickQuoteForm.classList.add('hidden');
          setTimeout(() => {
            closeModal();
            quoteSuccessMsg.classList.add('hidden');
            quickQuoteForm.classList.remove('hidden');
            quickQuoteForm.reset();
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<span>Calculate My Rate</span><i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>';
            }
          }, 3500);
        }
      })
      .catch(err => {
        console.warn('Quote API offline fallback:', err);
        if (quoteSuccessMsg) {
          quoteSuccessMsg.classList.remove('hidden');
          quickQuoteForm.classList.add('hidden');
          setTimeout(() => {
            closeModal();
            quoteSuccessMsg.classList.add('hidden');
            quickQuoteForm.classList.remove('hidden');
            quickQuoteForm.reset();
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<span>Calculate My Rate</span><i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>';
            }
          }, 2800);
        }
      });
    });
  }
}

/**
 * Accordion Handler for FAQs
 */
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('[data-faq-toggle]');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-faq-toggle');
      const content = document.getElementById(targetId);
      const icon = btn.querySelector('.faq-icon');

      if (!content) return;

      const isHidden = content.classList.contains('hidden');
      // Close other accordions
      document.querySelectorAll('.faq-answer').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(ic => ic.classList.remove('rotate-180'));

      if (isHidden) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });
}
