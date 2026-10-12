(function (window, document) {
  'use strict';

  // CookieYes carica questo file solo dopo il consenso alla categoria
  // Advertisement tramite l'attributo data-cookieyes nel markup HTML.
  if (window.fbq) {
    return;
  }

  var fbq = function () {
    fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
  };

  if (!window._fbq) {
    window._fbq = fbq;
  }
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);

  fbq('init', '1627756612027658');
  fbq('track', 'PageView');

  var trackConversion = function () {
    var conversionEvent = document.body && document.body.getAttribute('data-meta-event');

    if (conversionEvent && window.__metricsConfirmedLead === true) {
      fbq('track', conversionEvent);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackConversion, { once: true });
  } else {
    trackConversion();
  }
})(window, document);
