/**
 * MGL Growth — Commercial Analytics & Tracking
 * Measurement ID: G-9EH4SNG640
 * Strictly GDPR & Consent Mode v2 compliant (Zero PII).
 */
(() => {
  'use strict';

  // 1. UTM & Session Origin Capture
  try {
    const search = window.location.search;
    if (search) {
      const urlParams = new URLSearchParams(search);
      const utmKeys = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'gclid',
        'fbclid'
      ];
      const captured = {};
      let hasUtm = false;

      for (const key of utmKeys) {
        const val = urlParams.get(key);
        if (val) {
          captured[key] = val.trim();
          hasUtm = true;
        }
      }

      if (hasUtm) {
        captured.captured_at = new Date().toISOString();
        captured.landing_path = window.location.pathname;
        if (document.referrer && !document.referrer.includes(window.location.hostname)) {
          captured.referrer = document.referrer;
        }
        try {
          sessionStorage.setItem('mgl_utm_params', JSON.stringify(captured));
          if (!localStorage.getItem('mgl_initial_utm')) {
            localStorage.setItem('mgl_initial_utm', JSON.stringify(captured));
          }
        } catch (_) {}
      }
    }
  } catch (_) {}

  // 2. Safe Event Dispatcher (GA4 + dataLayer)
  function trackEvent(name, params = {}) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', name, params);
      } else if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: name, ...params });
      }
    } catch (_) {}
  }

  // 3. Location & Label Helpers
  function getCtaLocation(el) {
    if (!el) return 'content';
    if (el.closest('.header')) return 'header';
    if (el.closest('.site-menu')) return 'menu';
    if (el.closest('.hero, .hero-intro')) return 'hero';
    if (el.closest('.offer-purchase, .pricing, #price')) return 'pricing';
    if (el.closest('.lead-section, #lead')) return 'lead_form';
    if (el.closest('.booking-layout, .booking, #contact')) return 'booking_section';
    if (el.closest('.studio-footer, footer')) return 'footer';
    return 'content';
  }

  function getCtaName(el) {
    if (!el) return 'CTA';
    const text = (el.innerText || el.textContent || '').replace(/[↗→↓×\s]+/g, ' ').trim();
    const clean = text.replace(/^\d+\s*/, '').trim();
    return clean || el.getAttribute('aria-label') || 'CTA';
  }

  // 4. Commercial Handlers
  function handleWhatsAppClick(el, customName, customLocation) {
    const cta_name = customName || getCtaName(el) || 'WhatsApp';
    const cta_location = customLocation || getCtaLocation(el);
    const page_location = window.location.href;

    trackEvent('click_whatsapp', {
      cta_name,
      cta_location,
      page_location
    });

    trackEvent('cta_click', {
      cta_name,
      cta_location,
      page_location
    });
  }

  function handleCalendarClick(el, customName, customLocation) {
    const cta_name = customName || (el ? getCtaName(el) : 'Agendar reunião');
    const cta_location = customLocation || (el ? getCtaLocation(el) : 'booking_section');
    const page_location = window.location.href;

    trackEvent('click_calendar', {
      cta_name,
      cta_location,
      page_location
    });

    trackEvent('cta_click', {
      cta_name,
      cta_location,
      page_location
    });
  }

  function handleCtaClick(el) {
    const cta_name = getCtaName(el);
    const cta_location = getCtaLocation(el);
    const page_location = window.location.href;

    trackEvent('cta_click', {
      cta_name,
      cta_location,
      page_location
    });
  }

  // 5. Global Delegated Click Listener (Capture Phase)
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target) return;

    // A. WhatsApp Link / CTA
    const waLink = target.closest('a[href*="wa.me"], a[href*="whatsapp.com"], [data-contact="whatsapp"]');
    if (waLink) {
      handleWhatsAppClick(waLink);
      return;
    }

    // B. Calendar / Meeting CTA
    const meetingBtn = target.closest('[data-contact="meeting"], a[href="#contact"]');
    if (meetingBtn) {
      handleCalendarClick(meetingBtn);
      return;
    }

    // C. Form Submit CTA
    const formSubmitBtn = target.closest('#lead-form button[type="submit"]');
    if (formSubmitBtn) {
      handleCtaClick(formSubmitBtn);
      return;
    }
  }, { capture: true });

  // 6. Direct Calendar Embed Interaction Listener
  let calendarInteractionTracked = false;
  const bookingArea = document.querySelector('.booking-area, #google-booking-frame');
  if (bookingArea) {
    const onCalendarInteract = () => {
      if (calendarInteractionTracked) return;
      calendarInteractionTracked = true;
      handleCalendarClick(null, 'Google Calendar Embed', 'booking_section');
    };
    bookingArea.addEventListener('pointerdown', onCalendarInteract, { passive: true });
    bookingArea.addEventListener('focusin', onCalendarInteract, { passive: true });
  }

  window.addEventListener('blur', () => {
    if (document.activeElement && document.activeElement.id === 'google-booking-frame') {
      if (!calendarInteractionTracked) {
        calendarInteractionTracked = true;
        handleCalendarClick(null, 'Google Calendar Embed', 'booking_section');
      }
    }
  });

  // 7. Lead Success Handler (generate_lead)
  // Strictly called ONLY upon successful response from /api/leads
  let lastLeadTimestamp = 0;
  window.mglTrackLeadSuccess = () => {
    const now = Date.now();
    if (now - lastLeadTimestamp < 2000) return;
    lastLeadTimestamp = now;
    trackEvent('generate_lead', {
      method: 'website_form',
      form_id: 'lead-form'
    });
  };

  window.addEventListener('mgl:lead_success', () => {
    window.mglTrackLeadSuccess();
  });
})();
