(function (window, document) {
  'use strict';

  // Iubenda carica questo file solo dopo il consenso alla finalità Misurazione
  // tramite data-suppressedsrc e _iub_cs_activate nel markup HTML.
  if (window.__metricsClarityInitialized) {
    return;
  }
  window.__metricsClarityInitialized = true;

  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () {
      (c[a].q = c[a].q || []).push(arguments);
    };
    t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', 'yj7mgk7cem');

  // Clarity deve ricevere un consenso esplicito. Con il solo consenso
  // Misurazione abilitiamo l'analisi, mantenendo disabilitato l'uso advertising.
  window.clarity('consentv2', {
    ad_Storage: 'denied',
    analytics_Storage: 'granted'
  });

  var conversionEvent = document.body && document.body.getAttribute('data-clarity-event');
  var trackConversion = function () {
    var eventName = document.body && document.body.getAttribute('data-clarity-event');
    if (eventName) {
      window.clarity('event', eventName);
    }
  };

  if (conversionEvent) {
    trackConversion();
  } else {
    document.addEventListener('DOMContentLoaded', trackConversion, { once: true });
  }
})(window, document);
