/* eslint-disable no-console */

const els = {
  fileInput: document.getElementById('fileInput'),
  fetchPath: document.getElementById('fetchPath'),
  fetchBtn: document.getElementById('fetchBtn'),
  clearBtn: document.getElementById('clearBtn'),
  stopBtn: document.getElementById('stopBtn'),
  maxAlerts: document.getElementById('maxAlerts'),
  searchMode: document.getElementById('searchMode'),

  loadedCount: document.getElementById('loadedCount'),
  matchedCount: document.getElementById('matchedCount'),
  shownCount: document.getElementById('shownCount'),
  parseState: document.getElementById('parseState'),
  progress: document.getElementById('progress'),
  progressText: document.getElementById('progressText'),

  q: document.getElementById('q'),
  agent: document.getElementById('agent'),
  decoder: document.getElementById('decoder'),
  location: document.getElementById('location'),
  ruleId: document.getElementById('ruleId'),
  group: document.getElementById('group'),
  minLevel: document.getElementById('minLevel'),
  maxLevel: document.getElementById('maxLevel'),
  fromTs: document.getElementById('fromTs'),
  toTs: document.getElementById('toTs'),
  sortBy: document.getElementById('sortBy'),
  sortDir: document.getElementById('sortDir'),
  showLimit: document.getElementById('showLimit'),
  exportBtn: document.getElementById('exportBtn'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),

  tbody: document.getElementById('tbody'),

  detailDialog: document.getElementById('detailDialog'),
  detailTitle: document.getElementById('detailTitle'),
  detailPre: document.getElementById('detailPre'),
  copyBtn: document.getElementById('copyBtn'),
};

const state = {
  alerts: /** @type {any[]} */ ([]),
  norm: /** @type {NormAlert[]} */ ([]),
  matchedIdx: /** @type {number[]} */ ([]),
  stopRequested: false,
  parsing: false,
};

/**
 * @typedef {{
 *  raw: any,
 *  id: string,
 *  timestampRaw: string,
 *  timestampMs: number | null,
 *  level: number | null,
 *  ruleId: string,
 *  description: string,
 *  agent: string,
 *  decoder: string,
 *  location: string,
 *  groups: string[],
 *  searchText: string,
 *  fullText?: string
 * }} NormAlert
 */

function safeStr(v) {
  if (v === null || v === undefined) return '';
  return String(v);
}

function toLower(v) {
  return safeStr(v).toLowerCase();
}

function parseWazuhTimestamp(ts) {
  const raw = safeStr(ts).trim();
  if (!raw) return null;
  // Convert +0100 to +01:00 for JS Date parsing.
  const iso = raw.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.getTime();
}

function normalizeAlert(a) {
  const timestampRaw = safeStr(a?.timestamp);
  const timestampMs = parseWazuhTimestamp(timestampRaw);
  const level = typeof a?.rule?.level === 'number' ? a.rule.level : (a?.rule?.level ? Number(a.rule.level) : null);
  const ruleId = safeStr(a?.rule?.id);
  const description = safeStr(a?.rule?.description);
  const agent = safeStr(a?.agent?.name || a?.agent?.id);
  const decoder = safeStr(a?.decoder?.name);
  const location = safeStr(a?.location);
  const groups = Array.isArray(a?.rule?.groups) ? a.rule.groups.map(safeStr) : [];

  const searchText = [
    timestampRaw,
    safeStr(a?.id),
    ruleId,
    description,
    safeStr(level),
    agent,
    decoder,
    location,
    groups.join(' '),
  ].join(' | ').toLowerCase();

  return /** @type {NormAlert} */ ({
    raw: a,
    id: safeStr(a?.id),
    timestampRaw,
    timestampMs,
    level: Number.isFinite(level) ? level : null,
    ruleId,
    description,
    agent,
    decoder,
    location,
    groups,
    searchText,
  });
}

function setParseState(s) {
  els.parseState.textContent = s;
}

function setCounts() {
  els.loadedCount.textContent = String(state.norm.length);
  els.matchedCount.textContent = String(state.matchedIdx.length);
}

function fmtBytes(n) {
  if (!Number.isFinite(n) || n <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  const digits = i === 0 ? 0 : (i === 1 ? 1 : 2);
  return `${v.toFixed(digits)} ${units[i]}`;
}

function debounce(fn, ms) {
  let t = null;
  return (...args) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Streaming parser for concatenated JSON objects:
 *  { ... }\n{ ... }\n{ ... }
 * Uses brace depth tracking and is string/escape aware.
 */
async function parseConcatenatedJsonObjects({
  stream,
  totalBytes,
  maxAlerts,
  onProgress,
  onObject,
}) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  let bytesRead = 0;
  let buffer = '';
  let i = 0;
  let objStart = -1;
  let depth = 0;
  let inString = false;
  let escape = false;

  const yieldEvery = 300; // keep UI responsive
  let parsedCount = 0;

  while (true) {
    if (state.stopRequested) break;
    if (maxAlerts > 0 && parsedCount >= maxAlerts) break;

    const { value, done } = await reader.read();
    if (done) break;

    bytesRead += value.byteLength;
    buffer += decoder.decode(value, { stream: true });

    while (i < buffer.length) {
      const ch = buffer[i];

      if (inString) {
        if (escape) {
          escape = false;
        } else if (ch === '\\') {
          escape = true;
        } else if (ch === '"') {
          inString = false;
        }
      } else {
        if (ch === '"') {
          inString = true;
        } else if (ch === '{') {
          if (depth === 0) objStart = i;
          depth++;
        } else if (ch === '}') {
          depth--;
          if (depth < 0) {
            // Malformed boundary; reset to avoid infinite loop.
            depth = 0;
            objStart = -1;
          } else if (depth === 0 && objStart !== -1) {
            const jsonStr = buffer.slice(objStart, i + 1);
            // Remove consumed content including any whitespace between objects.
            buffer = buffer.slice(i + 1);
            i = 0;
            objStart = -1;

            try {
              const obj = JSON.parse(jsonStr);
              onObject(obj);
              parsedCount++;
              if (maxAlerts > 0 && parsedCount >= maxAlerts) break;
              if (state.stopRequested) break;
              if (parsedCount % yieldEvery === 0) {
                onProgress({ bytesRead, totalBytes, parsedCount });
                // Yield to UI thread.
                await new Promise((r) => setTimeout(r, 0));
              }
              continue;
            } catch (e) {
              console.warn('Failed to parse object, skipping.', e);
              continue;
            }
          }
        }
      }

      i++;
    }

    onProgress({ bytesRead, totalBytes, parsedCount });
  }

  // Flush decoder.
  buffer += decoder.decode();

  onProgress({ bytesRead, totalBytes, parsedCount, done: true });
}

function getFilters() {
  const q = toLower(els.q.value);
  const agent = toLower(els.agent.value);
  const decoder = toLower(els.decoder.value);
  const location = toLower(els.location.value);
  const ruleId = toLower(els.ruleId.value);
  const group = toLower(els.group.value);
  const minLevel = els.minLevel.value.trim() === '' ? null : Number(els.minLevel.value);
  const maxLevel = els.maxLevel.value.trim() === '' ? null : Number(els.maxLevel.value);

  const fromTs = els.fromTs.value ? new Date(els.fromTs.value).getTime() : null;
  const toTs = els.toTs.value ? new Date(els.toTs.value).getTime() : null;

  const sortBy = els.sortBy.value;
  const sortDir = els.sortDir.value;
  const showLimit = Math.max(10, Number(els.showLimit.value || 500));
  const searchMode = els.searchMode.value; // fields | full

  return { q, agent, decoder, location, ruleId, group, minLevel, maxLevel, fromTs, toTs, sortBy, sortDir, showLimit, searchMode };
}

function cmp(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function applyFiltersAndRender() {
  const f = getFilters();
  const idx = [];

  const wantFull = f.searchMode === 'full';

  for (let k = 0; k < state.norm.length; k++) {
    const n = state.norm[k];

    if (f.minLevel !== null && Number.isFinite(f.minLevel)) {
      const lv = n.level ?? -Infinity;
      if (lv < f.minLevel) continue;
    }
    if (f.maxLevel !== null && Number.isFinite(f.maxLevel)) {
      const lv = n.level ?? Infinity;
      if (lv > f.maxLevel) continue;
    }

    if (f.fromTs !== null) {
      const t = n.timestampMs;
      if (t === null || t < f.fromTs) continue;
    }
    if (f.toTs !== null) {
      const t = n.timestampMs;
      if (t === null || t > f.toTs) continue;
    }

    if (f.agent && !toLower(n.agent).includes(f.agent)) continue;
    if (f.decoder && !toLower(n.decoder).includes(f.decoder)) continue;
    if (f.location && !toLower(n.location).includes(f.location)) continue;
    if (f.ruleId && !toLower(n.ruleId).includes(f.ruleId)) continue;
    if (f.group && !n.groups.map(toLower).some((g) => g.includes(f.group))) continue;

    if (f.q) {
      if (wantFull) {
        if (!n.fullText) n.fullText = JSON.stringify(n.raw).toLowerCase();
        if (!n.searchText.includes(f.q) && !n.fullText.includes(f.q)) continue;
      } else {
        if (!n.searchText.includes(f.q)) continue;
      }
    }

    idx.push(k);
  }

  // Sort
  idx.sort((ia, ib) => {
    const a = state.norm[ia];
    const b = state.norm[ib];
    let r = 0;
    switch (f.sortBy) {
      case 'level':
        r = cmp(a.level ?? -Infinity, b.level ?? -Infinity);
        break;
      case 'ruleId':
        r = cmp(toLower(a.ruleId), toLower(b.ruleId));
        break;
      case 'agent':
        r = cmp(toLower(a.agent), toLower(b.agent));
        break;
      case 'decoder':
        r = cmp(toLower(a.decoder), toLower(b.decoder));
        break;
      case 'timestamp':
      default:
        r = cmp(a.timestampMs ?? -Infinity, b.timestampMs ?? -Infinity);
        break;
    }
    return f.sortDir === 'asc' ? r : -r;
  });

  state.matchedIdx = idx;
  setCounts();

  renderTable(f.showLimit);
  els.exportBtn.disabled = state.matchedIdx.length === 0;
}

function renderTable(limit) {
  const rows = Math.min(limit, state.matchedIdx.length);
  els.shownCount.textContent = String(rows);

  const frag = document.createDocumentFragment();
  els.tbody.innerHTML = '';

  for (let r = 0; r < rows; r++) {
    const idx = state.matchedIdx[r];
    const n = state.norm[idx];

    const tr = document.createElement('tr');
    tr.dataset.idx = String(idx);

    const tdTs = document.createElement('td');
    tdTs.textContent = n.timestampRaw || '(no timestamp)';
    tr.appendChild(tdTs);

    const tdLv = document.createElement('td');
    tdLv.className = 'num';
    tdLv.textContent = n.level === null ? '' : String(n.level);
    tr.appendChild(tdLv);

    const tdRule = document.createElement('td');
    tdRule.textContent = n.ruleId;
    tr.appendChild(tdRule);

    const tdDesc = document.createElement('td');
    tdDesc.textContent = n.description;
    tr.appendChild(tdDesc);

    const tdAgent = document.createElement('td');
    tdAgent.textContent = n.agent;
    tr.appendChild(tdAgent);

    const tdDec = document.createElement('td');
    tdDec.textContent = n.decoder;
    tr.appendChild(tdDec);

    const tdLoc = document.createElement('td');
    tdLoc.textContent = n.location;
    tr.appendChild(tdLoc);

    frag.appendChild(tr);
  }

  els.tbody.appendChild(frag);
}

function resetFilters() {
  els.q.value = '';
  els.agent.value = '';
  els.decoder.value = '';
  els.location.value = '';
  els.ruleId.value = '';
  els.group.value = '';
  els.minLevel.value = '';
  els.maxLevel.value = '';
  els.fromTs.value = '';
  els.toTs.value = '';
  els.sortBy.value = 'timestamp';
  els.sortDir.value = 'desc';
  els.showLimit.value = '500';
  applyFiltersAndRender();
}

function clearAll() {
  state.alerts = [];
  state.norm = [];
  state.matchedIdx = [];
  state.stopRequested = false;
  state.parsing = false;
  els.tbody.innerHTML = '';
  els.loadedCount.textContent = '0';
  els.matchedCount.textContent = '0';
  els.shownCount.textContent = '0';
  els.progress.value = 0;
  els.progress.max = 1;
  els.progressText.textContent = '';
  setParseState('idle');
  els.exportBtn.disabled = true;
}

async function loadFromStream(stream, totalBytes, label) {
  clearAll();

  state.stopRequested = false;
  state.parsing = true;
  els.stopBtn.disabled = false;
  setParseState(`loading (${label})`);

  const maxAlerts = Math.max(0, Number(els.maxAlerts.value || 0));

  try {
    await parseConcatenatedJsonObjects({
      stream,
      totalBytes,
      maxAlerts,
      onProgress: ({ bytesRead, totalBytes: tb, parsedCount, done }) => {
        els.loadedCount.textContent = String(parsedCount);
        if (tb && tb > 0) {
          els.progress.max = tb;
          els.progress.value = bytesRead;
          els.progressText.textContent = `${fmtBytes(bytesRead)} / ${fmtBytes(tb)}`;
        } else {
          els.progress.max = 1;
          els.progress.value = 0;
          els.progressText.textContent = `${fmtBytes(bytesRead)} read`;
        }
        if (done) {
          // no-op
        }
      },
      onObject: (obj) => {
        state.alerts.push(obj);
        state.norm.push(normalizeAlert(obj));
      },
    });
  } finally {
    state.parsing = false;
    els.stopBtn.disabled = true;
    setParseState(state.stopRequested ? 'stopped' : 'done');
    // First render
    applyFiltersAndRender();
  }
}

async function fetchAlerts() {
  const path = els.fetchPath.value.trim();
  if (!path) return;

  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  if (!res.body) throw new Error('Streaming not supported by this browser/response.');

  const len = res.headers.get('content-length');
  const totalBytes = len ? Number(len) : null;

  await loadFromStream(res.body, totalBytes, `fetch ${path}`);
}

async function loadFile(file) {
  if (!file) return;
  // File streams are supported in modern browsers; fallback uses file.text() which is heavy.
  if (file.stream) {
    await loadFromStream(file.stream(), file.size, `file ${file.name}`);
    return;
  }
  // Fallback: full read (may be slow/memory heavy).
  clearAll();
  setParseState(`loading (file ${file.name})`);
  const text = await file.text();
  setParseState('parsing (fallback)');
  // Convert full text to a stream-like parse by using a one-shot stream.
  const bytes = new TextEncoder().encode(text);
  const rs = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  });
  await loadFromStream(rs, bytes.byteLength, `file ${file.name} (fallback)`);
}

function openDetail(idx) {
  const n = state.norm[idx];
  if (!n) return;

  const title = [
    n.timestampRaw || '(no timestamp)',
    n.level !== null ? `level ${n.level}` : '',
    n.ruleId ? `rule ${n.ruleId}` : '',
    n.agent ? `agent ${n.agent}` : '',
  ].filter(Boolean).join(' · ');

  els.detailTitle.textContent = title || 'Alert';
  els.detailPre.textContent = JSON.stringify(n.raw, null, 2);
  els.detailDialog.showModal();
}

async function copyDetail() {
  const text = els.detailPre.textContent || '';
  try {
    await navigator.clipboard.writeText(text);
    els.copyBtn.textContent = 'Copied';
    setTimeout(() => (els.copyBtn.textContent = 'Copy JSON'), 900);
  } catch {
    // Fallback: select text.
    const range = document.createRange();
    range.selectNodeContents(els.detailPre);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

function exportMatchedJsonl() {
  if (!state.matchedIdx.length) return;
  const lines = state.matchedIdx.map((i) => JSON.stringify(state.norm[i].raw)).join('\n') + '\n';
  const blob = new Blob([lines], { type: 'application/x-ndjson;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `alerts.filtered.${state.matchedIdx.length}.jsonl`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Events
els.fetchBtn.addEventListener('click', async () => {
  try {
    await fetchAlerts();
  } catch (e) {
    console.error(e);
    alert(String(e?.message || e));
    setParseState('error');
  }
});

els.fileInput.addEventListener('change', async (ev) => {
  const file = ev.target.files?.[0];
  try {
    await loadFile(file);
  } catch (e) {
    console.error(e);
    alert(String(e?.message || e));
    setParseState('error');
  } finally {
    els.fileInput.value = '';
  }
});

els.stopBtn.addEventListener('click', () => {
  state.stopRequested = true;
  setParseState('stopping…');
});

els.clearBtn.addEventListener('click', () => {
  clearAll();
});

els.resetFiltersBtn.addEventListener('click', () => resetFilters());

els.exportBtn.addEventListener('click', () => exportMatchedJsonl());

els.copyBtn.addEventListener('click', () => copyDetail());

els.tbody.addEventListener('click', (ev) => {
  const tr = ev.target.closest('tr');
  if (!tr) return;
  const idx = Number(tr.dataset.idx);
  if (!Number.isFinite(idx)) return;
  openDetail(idx);
});

const debouncedApply = debounce(() => applyFiltersAndRender(), 160);
[
  els.q,
  els.agent,
  els.decoder,
  els.location,
  els.ruleId,
  els.group,
  els.minLevel,
  els.maxLevel,
  els.fromTs,
  els.toTs,
  els.sortBy,
  els.sortDir,
  els.showLimit,
  els.searchMode,
].forEach((el) => el.addEventListener('input', debouncedApply));

// Initial state
setParseState('idle');
els.progress.max = 1;
els.progress.value = 0;
els.progressText.textContent = '';
