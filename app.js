const STORAGE_KEY = "werkdagen_pwa_v1";

const el = (id) => document.getElementById(id);

function euro(n) {
  const v = Number(n || 0);
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(v);
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      settings: { dayRate: 0 },
      workdays: [],
      payments: []
    };
  }
  try {
    const s = JSON.parse(raw);
    // mini-migratie/veiligheid
    return {
      settings: { dayRate: Number(s?.settings?.dayRate || 0) },
      workdays: Array.isArray(s?.workdays) ? s.workdays : [],
      payments: Array.isArray(s?.payments) ? s.payments : [],
    };
  } catch {
    return { settings: { dayRate: 0 }, workdays: [], payments: [] };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function calcEarnedForWorkday(dayRate, shiftType) {
  const rate = Number(dayRate || 0);
  if (shiftType === "half") return rate / 2;
  return rate;
}

function sortByDateAsc(items, key = "date") {
  return [...items].sort((a, b) => (a[key] || "").localeCompare(b[key] || ""));
}

function render() {
  state.workdays = sortByDateAsc(state.workdays, "date");
  state.payments = sortByDateAsc(state.payments, "date");

  // totals
  const earnedTotal = state.workdays.reduce((sum, w) => sum + Number(w.earned || 0), 0);
  const paidTotal = state.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const dueTotal = earnedTotal - paidTotal;

  el("earnedTotal").textContent = euro(earnedTotal);
  el("paidTotal").textContent = euro(paidTotal);
  el("dueTotal").textContent = euro(dueTotal);

  // settings
  el("dayRate").value = state.settings.dayRate || "";

  // workdays table
  const wb = el("workdaysBody");
  wb.innerHTML = "";
  for (const w of state.workdays) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${w.date || ""}</td>
      <td>${w.shiftType === "half" ? "Halve" : "Hele"}</td>
      <td>${w.startTime || ""}</td>
      <td>${w.endTime || ""}</td>
      <td>${euro(w.earned || 0)}</td>
      <td><button class="small-btn" data-del-work="${w.id}">Verwijder</button></td>
    `;
    wb.appendChild(tr);
  }

  // payments table
  const pb = el("paymentsBody");
  pb.innerHTML = "";
  for (const p of state.payments) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.date || ""}</td>
      <td>${euro(p.amount || 0)}</td>
      <td><button class="small-btn" data-del-pay="${p.id}">Verwijder</button></td>
    `;
    pb.appendChild(tr);
  }

  // attach delete handlers (event delegation)
  wb.onclick = (e) => {
    const id = e.target?.getAttribute?.("data-del-work");
    if (!id) return;
    state.workdays = state.workdays.filter(w => w.id !== id);
    saveState(state);
    render();
  };

  pb.onclick = (e) => {
    const id = e.target?.getAttribute?.("data-del-pay");
    if (!id) return;
    state.payments = state.payments.filter(p => p.id !== id);
    saveState(state);
    render();
  };
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function uid() {
  return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

// --- init ---
let state = loadState();

// default dates
if (!el("workDate").value) el("workDate").value = todayISO();
if (!el("payDate").value) el("payDate").value = todayISO();

el("saveSettings").addEventListener("click", () => {
  const rate = Number(el("dayRate").value || 0);
  state.settings.dayRate = isFinite(rate) ? rate : 0;
  saveState(state);
  render();
});

el("addWorkday").addEventListener("click", () => {
  const date = el("workDate").value;
  const shiftType = el("shiftType").value; // full/half
  const startTime = el("startTime").value;
  const endTime = el("endTime").value;

  if (!date) { alert("Kies een datum."); return; }
  if (!state.settings.dayRate || Number(state.settings.dayRate) <= 0) {
    alert("Vul eerst je dagloon in bij Instellingen en klik Opslaan.");
    return;
  }

  const earned = calcEarnedForWorkday(state.settings.dayRate, shiftType);

  state.workdays.push({
    id: uid(),
    date,
    shiftType,
    startTime,
    endTime,
    earned
  });

  saveState(state);
  render();
});

el("addPayment").addEventListener("click", () => {
  const date = el("payDate").value;
  const amount = Number(el("payAmount").value || 0);

  if (!date) { alert("Kies een datum."); return; }
  if (!amount || amount <= 0) { alert("Vul een bedrag in groter dan 0."); return; }

  state.payments.push({
    id: uid(),
    date,
    amount
  });

  el("payAmount").value = "";
  saveState(state);
  render();
});

el("resetAll").addEventListener("click", () => {
  const ok = confirm("Weet je zeker dat je ALLES wilt wissen?");
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  state = loadState();
  render();
});

el("exportData").addEventListener("click", () => {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "werkdagen-backup.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

el("importData").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const imported = JSON.parse(text);
    state = {
      settings: { dayRate: Number(imported?.settings?.dayRate || 0) },
      workdays: Array.isArray(imported?.workdays) ? imported.workdays : [],
      payments: Array.isArray(imported?.payments) ? imported.payments : []
    };
    saveState(state);
    render();
    alert("Import gelukt.");
  } catch {
    alert("Import mislukt. Bestand is geen geldige JSON back-up.");
  } finally {
    e.target.value = "";
  }
});

render();
