const STORAGE_KEY = "werkdagen_pwa_v3";

const el = (id) => document.getElementById(id);

function euro(n) {
  const v = Number(n || 0);
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(v);
}

function uid() {
  return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      settings: { rateMode: "day", dayRate: 0, hourRate: 0 },
      workdays: [],
      payments: []
    };
  }
  try {
    const s = JSON.parse(raw);
    return {
      settings: {
        rateMode: (s?.settings?.rateMode === "hour") ? "hour" : "day",
        dayRate: Number(s?.settings?.dayRate || 0),
        hourRate: Number(s?.settings?.hourRate || 0)
      },
      workdays: Array.isArray(s?.workdays) ? s.workdays : [],
      payments: Array.isArray(s?.payments) ? s.payments : []
    };
  } catch {
    return {
      settings: { rateMode: "day", dayRate: 0, hourRate: 0 },
      workdays: [],
      payments: []
    };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sortByDateAsc(items, key = "date") {
  return [...items].sort((a, b) => (a[key] || "").localeCompare(b[key] || ""));
}

/**
 * Berekent gewerkte uren uit start/eindtijd.
 * - Werkt over middernacht: 13:00 -> 01:00 = 12 uur
 * - Retourneert decimale uren afgerond op 2 decimals
 */
function calcHours(startTime, endTime) {
  if (!startTime || !endTime) return 0;

  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  if (![sh, sm, eh, em].every(n => Number.isFinite(n))) return 0;

  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;

  let diff = endMin - startMin;
  if (diff < 0) diff += 24 * 60;

  const hours = diff / 60;
  return Math.round(hours * 100) / 100;
}

function earnedForWorkday(settings, shiftType, startTime, endTime) {
  if (settings.rateMode === "hour") {
    const rate = Number(settings.hourRate || 0);
    const hours = calcHours(startTime, endTime);
    return { earned: hours * rate, hours };
  }

  const dayRate = Number(settings.dayRate || 0);
  const earned = (shiftType === "half") ? (dayRate / 2) : dayRate;
  return { earned, hours: null };
}

function updateSettingsUI() {
  const mode = el("rateMode").value;
  el("dayRateWrap").style.display = (mode === "day") ? "flex" : "none";
  el("hourRateWrap").style.display = (mode === "hour") ? "flex" : "none";
  // shift dropdown is alleen relevant voor dagloon
  el("shiftWrap").style.display = (mode === "day") ? "flex" : "none";
}

function render() {
  state.workdays = sortByDateAsc(state.workdays, "date");
  state.payments = sortByDateAsc(state.payments, "date");

  const earnedTotal = state.workdays.reduce((sum, w) => sum + Number(w.earned || 0), 0);
  const paidTotal = state.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const dueTotal = earnedTotal - paidTotal;

  el("earnedTotal").textContent = euro(earnedTotal);
  el("paidTotal").textContent = euro(paidTotal);
  el("dueTotal").textContent = euro(dueTotal);

  // settings -> UI
  el("rateMode").value = state.settings.rateMode || "day";
  el("dayRate").value = state.settings.dayRate || "";
  el("hourRate").value = state.settings.hourRate || "";
  updateSettingsUI();

  // Workdays header dynamisch (uren kolom alleen bij uurloon)
  const showHoursCol = state.settings.rateMode === "hour";
  const headerRow = el("workdaysHeaderRow");
  const headers = ["Datum", "Dienst", "Begin", "Eind"];
  if (showHoursCol) headers.push("Uren");
  headers.push("Verdiend", "");
  headerRow.innerHTML = headers.map(h => `<th>${h}</th>`).join("");

  // workdays table
  const wb = el("workdaysBody");
  wb.innerHTML = "";

  for (const w of state.workdays) {
    const tr = document.createElement("tr");

    const dienstLabel = (w.rateMode === "hour")
      ? "Uurloon"
      : (w.shiftType === "half" ? "Halve" : "Hele");

    const hoursCell = showHoursCol
      ? `<td>${(w.hours == null) ? "" : (Number(w.hours).toFixed(2) + " u")}</td>`
      : "";

    tr.innerHTML = `
      <td>${w.date || ""}</td>
      <td>${dienstLabel}</td>
      <td>${w.startTime || ""}</td>
      <td>${w.endTime || ""}</td>
      ${hoursCell}
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
}

// --- init ---
let state = loadState();

el("workDate").value = todayISO();
el("payDate").value = todayISO();

// UI
el("rateMode").addEventListener("change", updateSettingsUI);

el("saveSettings").addEventListener("click", () => {
  const mode = (el("rateMode").value === "hour") ? "hour" : "day";
  const dayRate = Number(el("dayRate").value || 0);
  const hourRate = Number(el("hourRate").value || 0);

  state.settings.rateMode = mode;
  state.settings.dayRate = Number.isFinite(dayRate) ? dayRate : 0;
  state.settings.hourRate = Number.isFinite(hourRate) ? hourRate : 0;

  saveState(state);
  render();
});

el("addWorkday").addEventListener("click", () => {
  const date = el("workDate").value;
  const shiftType = el("shiftType").value; // full/half
  const startTime = el("startTime").value;
  const endTime = el("endTime").value;

  if (!date) { alert("Kies een datum."); return; }

  if (state.settings.rateMode === "day") {
    if (!state.settings.dayRate || state.settings.dayRate <= 0) {
      alert("Vul je dagloon in bij Instellingen en klik Opslaan.");
      return;
    }
  } else {
    if (!state.settings.hourRate || state.settings.hourRate <= 0) {
      alert("Vul je uurloon in bij Instellingen en klik Opslaan.");
      return;
    }
    if (!startTime || !endTime) {
      alert("Vul begin- en eindtijd in (nodig voor uurloon).");
      return;
    }
  }

  const result = earnedForWorkday(state.settings, shiftType, startTime, endTime);

  state.workdays.push({
    id: uid(),
    date,
    shiftType,
    startTime,
    endTime,
    hours: result.hours,
    earned: result.earned,
    // we bewaren de mode zodat oude records correct blijven als je later wisselt
    rateMode: state.settings.rateMode,
    dayRateAtTime: state.settings.dayRate,
    hourRateAtTime: state.settings.hourRate
  });

  saveState(state);
  render();
});

el("addPayment").addEventListener("click", () => {
  const date = el("payDate").value;
  const amount = Number(el("payAmount").value || 0);

  if (!date) { alert("Kies een datum."); return; }
  if (!amount || amount <= 0) { alert("Vul een bedrag in groter dan 0."); return; }

  state.payments.push({ id: uid(), date, amount });

  el("payAmount").value = "";
  saveState(state);
  render();
});

// Verwijderen (event delegation)
el("workdaysBody").addEventListener("click", (e) => {
  const id = e.target?.getAttribute?.("data-del-work");
  if (!id) return;
  state.workdays = state.workdays.filter(w => w.id !== id);
  saveState(state);
  render();
});

el("paymentsBody").addEventListener("click", (e) => {
  const id = e.target?.getAttribute?.("data-del-pay");
  if (!id) return;
  state.payments = state.payments.filter(p => p.id !== id);
  saveState(state);
  render();
});

el("resetAll").addEventListener("click", () => {
  if (!confirm("Weet je zeker dat je ALLES wilt wissen?")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = loadState();
  render();
});

// JSON export/import
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
      settings: {
        rateMode: (imported?.settings?.rateMode === "hour") ? "hour" : "day",
        dayRate: Number(imported?.settings?.dayRate || 0),
        hourRate: Number(imported?.settings?.hourRate || 0)
      },
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

// PDF export (Print -> Save as PDF op iPhone)
el("exportPdf").addEventListener("click", () => {
  render();
  window.print();
});

render();
