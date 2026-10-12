(function (window, document) {
  'use strict';

  var form = document.querySelector('.wireframe-form');
  if (!form) return;

  function setValue(name, value) {
    var field = form.elements.namedItem(name);
    if (field) field.value = value || '';
  }

  function safePageUrl(value) {
    try {
      var url = new URL(value, window.location.href);
      return url.origin + url.pathname;
    } catch (error) {
      return '';
    }
  }

  var query = new URLSearchParams(window.location.search);
  setValue('page_url', window.location.origin + window.location.pathname);
  setValue('referrer_url', safePageUrl(document.referrer));
  ['source', 'medium', 'campaign', 'term', 'content'].forEach(function (key) {
    setValue('utm_' + key, query.get('utm_' + key));
  });

  function applyConsent(consent) {
    if (!consent) return;
    setValue('analytics_consent', consent.analytics === true ? 'Accettato' : consent.analytics === false ? 'Rifiutato' : 'Non rilevato');
    setValue('advertising_consent', consent.advertisement === true ? 'Accettato' : consent.advertisement === false ? 'Rifiutato' : 'Non rilevato');
    setValue('gclid', consent.advertisement === true ? query.get('gclid') : '');
    setValue('gbraid', consent.advertisement === true ? query.get('gbraid') : '');
    setValue('wbraid', consent.advertisement === true ? query.get('wbraid') : '');
  }

  applyConsent(window.__metricsConsent);
  window.addEventListener('metrics:consent-updated', function (event) {
    applyConsent(event.detail);
  });

  var endpoint = form.getAttribute('data-sheet-endpoint');
  if (!endpoint) return;

  function createRequestId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2) + '-' + Math.random().toString(36).slice(2);
  }

  form.addEventListener('submit', function (event) {
    if (!form.checkValidity()) return;
    event.preventDefault();
    if (form.dataset.submitting === 'true') return;

    var honeypot = form.elements.namedItem('_honey');
    if (honeypot && honeypot.value) return;

    form.dataset.submitting = 'true';
    form.setAttribute('aria-busy', 'true');
    var button = form.querySelector('button[type="submit"]');
    var status = document.getElementById('form-status');
    if (button) button.disabled = true;
    if (status) status.textContent = 'Invio in corso…';

    var requestId = createRequestId();
    var requestField = document.createElement('input');
    requestField.type = 'hidden';
    requestField.name = 'request_id';
    requestField.value = requestId;
    form.appendChild(requestField);

    var responseFrame = document.createElement('iframe');
    responseFrame.name = 'metrics-sheet-result-' + requestId;
    responseFrame.title = 'Conferma invio richiesta';
    responseFrame.setAttribute('aria-hidden', 'true');
    responseFrame.tabIndex = -1;
    responseFrame.style.display = 'none';
    document.body.appendChild(responseFrame);

    var originalAction = form.getAttribute('action');
    var originalTarget = form.getAttribute('target');
    var timer = window.setTimeout(function () {
      finishFailure();
    }, 20000);

    function removeListener() {
      window.removeEventListener('message', onMessage);
      window.clearTimeout(timer);
    }

    function finishFailure() {
      removeListener();
      form.dataset.submitting = 'false';
      form.removeAttribute('aria-busy');
      if (button) button.disabled = false;
      if (status) status.textContent = 'Non riusciamo a confermare l’invio. Controlla la connessione e riprova.';
      requestField.remove();
      responseFrame.remove();
      if (originalAction === null) form.removeAttribute('action');
      else form.setAttribute('action', originalAction);
      if (originalTarget === null) form.removeAttribute('target');
      else form.setAttribute('target', originalTarget);
    }

    function onMessage(messageEvent) {
      var result = messageEvent.data;
      var senderHost = '';
      try {
        senderHost = new URL(messageEvent.origin).hostname;
      } catch (error) {
        return;
      }
      if (!/(^|[-.])script\.googleusercontent\.com$/.test(senderHost) || !result ||
          result.type !== 'metrics-lead-result' || result.requestId !== requestId) {
        return;
      }

      removeListener();
      responseFrame.remove();
      if (result.ok !== true) {
        finishFailure();
        return;
      }

      if (typeof window.metricsMarkLeadSubmitted === 'function') {
        window.metricsMarkLeadSubmitted();
      }
      var next = form.elements.namedItem('_next');
      window.location.assign(next && next.value ? next.value : '/thank-you.html');
    }

    window.addEventListener('message', onMessage);
    form.setAttribute('target', responseFrame.name);
    form.setAttribute('action', endpoint);
    form.setAttribute('method', 'post');
    form.submit();
  });
})(window, document);
