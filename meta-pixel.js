(function (window, document) {
  'use strict';

  // Iubenda carica questo file solo dopo il consenso alla finalità Marketing
  // tramite data-suppressedsrc e _iub_cs_activate nel markup HTML.
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

  var conversionEvent = document.body && document.body.getAttribute('data-meta-event');
  if (conversionEvent) {
    fbq('track', conversionEvent);
  }
})(window, document);
