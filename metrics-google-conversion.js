(function (window) {
  'use strict';

  var conversionSent = false;

  function sendConversionIfReady() {
    if (conversionSent || window.__metricsConfirmedLead !== true) {
      return;
    }

    if (!window.__metricsConsent || window.__metricsConsent.advertisement !== true) {
      return;
    }

    if (typeof window.gtag !== 'function') {
      return;
    }

    conversionSent = true;
    window.gtag('event', 'conversion', {
      send_to: 'AW-11340495714/e2zfCLD_kJodEOL2yJ8q',
      value: 1.0,
      currency: 'EUR'
    });
  }

  window.addEventListener('metrics:consent-updated', sendConversionIfReady);
  sendConversionIfReady();
})(window);
