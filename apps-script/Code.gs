const SPREADSHEET_ID = '1-CBk84HMWwfi0Y07ZRzIWS2zHn32jaepwU6qV92Nxsg';
const SHEET_NAME = 'Lead';
const BUDGET_OPTIONS = [
  'Meno di 2.000 €',
  'Tra 2.000 e 3.000 €',
  'Più di 3.000 €',
  'Non l’ho ancora definito'
];

function doGet() {
  return ContentService.createTextOutput('Endpoint richieste Metrics attivo');
}

function doPost(event) {
  const parameters = event && event.parameter ? event.parameter : {};
  const requestId = clean_(parameters.request_id, 80);

  // Il campo nascosto intercetta i bot senza mostrare loro un errore utile.
  if (clean_(parameters._honey, 200)) {
    return htmlResult_(true, requestId);
  }

  const lead = {
    name: clean_(parameters.name, 160),
    email: clean_(parameters.email, 254),
    phone: clean_(parameters.phone, 48),
    budget: clean_(parameters.budget_total, 80),
    message: clean_(parameters.message, 3000)
  };

  if (!lead.name || !validEmail_(lead.email) || !validPhone_(lead.phone) ||
      BUDGET_OPTIONS.indexOf(lead.budget) === -1 || !lead.message) {
    return htmlResult_(false, requestId);
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return htmlResult_(false, requestId);
  }

  try {
    const cache = CacheService.getScriptCache();
    const duplicateKey = duplicateKey_(lead.email, lead.phone);
    if (cache.get(duplicateKey)) {
      return htmlResult_(true, requestId);
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Scheda Lead non trovata.');
    }

    const row = [
      new Date(),
      cell_(lead.name),
      cell_(lead.email),
      cell_(lead.phone),
      cell_(lead.budget),
      cell_(lead.message),
      cell_(clean_(parameters.page_url, 1000)),
      cell_(clean_(parameters.referrer_url, 1000)),
      cell_(clean_(parameters.utm_source, 200)),
      cell_(clean_(parameters.utm_medium, 200)),
      cell_(clean_(parameters.utm_campaign, 200)),
      cell_(clean_(parameters.utm_term, 200)),
      cell_(clean_(parameters.utm_content, 200)),
      cell_(clean_(parameters.gclid, 500)),
      cell_(clean_(parameters.gbraid, 500)),
      cell_(clean_(parameters.wbraid, 500)),
      cell_(clean_(parameters.analytics_consent, 40)),
      cell_(clean_(parameters.advertising_consent, 40))
    ];

    sheet.appendRow(row);
    cache.put(duplicateKey, '1', 60);
    return htmlResult_(true, requestId);
  } catch (error) {
    // Evita di registrare dati personali nei log di esecuzione.
    console.error(error && error.message ? error.message : 'Errore durante il salvataggio del lead.');
    return htmlResult_(false, requestId);
  } finally {
    lock.releaseLock();
  }
}

function clean_(value, maxLength) {
  return String(value == null ? '' : value).trim().slice(0, maxLength);
}

function validEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validPhone_(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 18;
}

function cell_(value) {
  const text = String(value == null ? '' : value);
  // Mantiene testo e numeri di telefono come valori, senza eseguire formule inviate nel form.
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function duplicateKey_(email, phone) {
  const normalized = (email.trim().toLowerCase() + '|' + phone.replace(/\D/g, ''));
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, normalized, Utilities.Charset.UTF_8);
  return 'lead-' + digest.map(function (byte) {
    const value = (byte + 256) % 256;
    return ('0' + value.toString(16)).slice(-2);
  }).join('');
}

function htmlResult_(ok, requestId) {
  const safeRequestId = /^[a-zA-Z0-9-]{16,80}$/.test(requestId) ? requestId : '';
  const message = JSON.stringify({
    type: 'metrics-lead-result',
    requestId: safeRequestId,
    ok: Boolean(ok)
  });
  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body>' +
    '<script>window.top.postMessage(' + message + ', "*");</script>' +
    '</body></html>';

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
