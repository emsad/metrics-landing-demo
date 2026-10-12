import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('./Code.gs', import.meta.url), 'utf8');
const rows = [];
const cacheEntries = new Map();

const cache = {
  get: (key) => cacheEntries.get(key) || null,
  put: (key, value) => cacheEntries.set(key, value)
};

const sheet = { appendRow: (row) => rows.push(row) };
const context = {
  Date,
  console: { error() {} },
  ContentService: {
    MimeType: { JSON: 'application/json' },
    createTextOutput(content) {
      return { content, setMimeType() { return this; } };
    }
  },
  HtmlService: {
    XFrameOptionsMode: { ALLOWALL: 'ALLOWALL' },
    createHtmlOutput(content) {
      return { content, setXFrameOptionsMode(mode) { this.xFrameOptionsMode = mode; return this; } };
    }
  },
  LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
  CacheService: { getScriptCache: () => cache },
  SpreadsheetApp: {
    openById(id) {
      assert.equal(id, '1-CBk84HMWwfi0Y07ZRzIWS2zHn32jaepwU6qV92Nxsg');
      return { getSheetByName: (name) => name === 'Lead' ? sheet : null };
    }
  },
  Utilities: {
    DigestAlgorithm: { SHA_256: 'SHA_256' },
    Charset: { UTF_8: 'UTF_8' },
    computeDigest(_algorithm, input) {
      return Array.from(input).slice(0, 8).map((char) => char.charCodeAt(0));
    }
  }
};

vm.runInNewContext(source, context, { filename: 'Code.gs' });

function submit(overrides = {}) {
  return context.doPost({
    parameter: {
      name: 'Lead di prova',
      email: 'lead@example.test',
      phone: '+39 333 123 4567',
      budget_total: 'Tra 2.000 e 3.000 €',
      message: 'Richiesta sintetica di prova',
      request_id: 'test-request-1234567890',
      ...overrides
    }
  });
}

const accepted = submit();
assert.match(accepted.content, /"type":"metrics-lead-result"/);
assert.match(accepted.content, /"requestId":"test-request-1234567890"/);
assert.match(accepted.content, /"ok":true/);
assert.match(accepted.content, /window\.top\.postMessage/);
assert.equal(accepted.xFrameOptionsMode, 'ALLOWALL');
assert.equal(rows.length, 1);
assert.equal(rows[0].length, 20);
assert.equal(rows[0][3], "'+39 333 123 4567");
assert.equal(rows[0][4], 'Tra 2.000 e 3.000 €');
assert.equal(rows[0][5], 'Richiesta sintetica di prova');
assert.equal(rows[0][18], 'Non prestato');
assert.equal(rows[0][19], '');
assert.ok(rows[0][0] instanceof Date);

const duplicate = submit();
assert.match(duplicate.content, /"ok":true/);
assert.equal(rows.length, 1);

const missingPhone = submit({ phone: '' });
assert.match(missingPhone.content, /"ok":false/);
assert.equal(rows.length, 1);

const invalidBudget = submit({ budget_total: 'Altro' });
assert.match(invalidBudget.content, /"ok":false/);
assert.equal(rows.length, 1);

const bot = submit({ _honey: 'compilato-dal-bot' });
assert.match(bot.content, /"ok":true/);
assert.equal(rows.length, 1);

const consented = submit({
  email: 'consented@example.test',
  phone: '+39 333 987 6543',
  metrics_communications_consent: 'metrics-communications-v1-20261012'
});
assert.match(consented.content, /"ok":true/);
assert.equal(rows.length, 2);
assert.equal(rows[1][18], 'Accettato');
assert.equal(rows[1][19], 'Acconsento a ricevere comunicazioni di Metrics.');

const invalidConsent = submit({
  email: 'invalid-consent@example.test',
  phone: '+39 333 111 2222',
  metrics_communications_consent: 'anything-else'
});
assert.match(invalidConsent.content, /"ok":true/);
assert.equal(rows.length, 3);
assert.equal(rows[2][18], 'Non prestato');
assert.equal(rows[2][19], '');

console.log('Verifica Apps Script superata: lead validi, cellulare obbligatorio, budget consentito, anti-duplicato, honeypot e consenso facoltativo registrato solo se selezionato.');
