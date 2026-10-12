(function (window, document) {
  'use strict';

  var pendingLeadKey = 'metrics.pendingLead.v1';
  var thankYouPath = '/thank-you.html';
  var pendingLeadLifetimeMs = 15 * 60 * 1000;

  window.__metricsConfirmedLead = false;

  window.metricsMarkLeadSubmitted = function () {
    try {
      window.sessionStorage.setItem(pendingLeadKey, String(Date.now()));
    } catch (error) {
      // If session storage is unavailable, do not count an unverified visit.
    }
  };

  if (window.location.pathname.replace(/\/+$/, '') === thankYouPath) {
    try {
      var submittedAt = Number(window.sessionStorage.getItem(pendingLeadKey));
      var age = Date.now() - submittedAt;

      if (submittedAt > 0 && age >= 0 && age <= pendingLeadLifetimeMs) {
        window.__metricsConfirmedLead = true;
      }

      window.sessionStorage.removeItem(pendingLeadKey);
    } catch (error) {
      // If session storage is unavailable, do not count an unverified visit.
    }
  }

  document.addEventListener('submit', function (event) {
    var form = event.target;

    if (!(form instanceof window.HTMLFormElement)) {
      return;
    }

    if (!form.matches('.wireframe-form') || !form.checkValidity()) {
      return;
    }

    // When the Sheet endpoint is configured, mark only after its response succeeds.
    if (form.hasAttribute('data-sheet-endpoint')) return;
    window.metricsMarkLeadSubmitted();
  }, true);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 2000
  });

  function updateConsent(advertisement, analytics, functional) {
    var consent = {
      advertisement: Boolean(advertisement),
      analytics: Boolean(analytics),
      functional: Boolean(functional)
    };

    window.__metricsConsent = consent;
    window.__metricsAdConsent = consent.advertisement;

    window.gtag('consent', 'update', {
      ad_storage: consent.advertisement ? 'granted' : 'denied',
      ad_user_data: consent.advertisement ? 'granted' : 'denied',
      ad_personalization: consent.advertisement ? 'granted' : 'denied',
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      functionality_storage: consent.functional ? 'granted' : 'denied',
      personalization_storage: consent.functional ? 'granted' : 'denied',
      security_storage: 'granted'
    });

    window.dispatchEvent(new window.CustomEvent('metrics:consent-updated', {
      detail: consent
    }));
  }

  document.addEventListener('cookieyes_banner_load', function (event) {
    var categories = event.detail && event.detail.categories;

    if (categories) {
      updateConsent(categories.advertisement, categories.analytics, categories.functional);
    }
  });

  document.addEventListener('cookieyes_consent_update', function (event) {
    var accepted = event.detail && event.detail.accepted;

    if (Array.isArray(accepted)) {
      updateConsent(
        accepted.indexOf('advertisement') !== -1,
        accepted.indexOf('analytics') !== -1,
        accepted.indexOf('functional') !== -1
      );
    }
  });
})(window, document);
