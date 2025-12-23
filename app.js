const STORAGE_KEY = "werkdagen_pwa_v2";

const el = (id) => document.getElementById(id);

function euro(n) {
  const v = Number(n || 0);
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(v);
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
    return { settings: { rateMode: "day", dayRate: 0, hourRate: 0 }, workdays: [], payments: [] };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sortByDateAsc(items, key = "date") {
  return [...items].sort((a, b) => (a[key] || "").localeCompare(b[key] || ""));
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

/**
 * Berekent gewerkte uren uit start/eind tijd.
 * - Werkt ook over middernacht: 13:00 -> 01:00 = 12 uur
 * - Retourneert decimale uren, afgerond op 2 decimals (bijv. 7.5)
 */
function calcHours(startTime, endTime) {
  if (!startTime || !endTime) return 0;

  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  if (![sh, sm, eh, em].every(n => Number.isFinite(n))) return 0;

  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;

  let diff = endMin - startMin;
  if (diff < 0) diff += 24 * 60; // over middernacht

  const hours = diff / 60;
  return Math.round(hours * 100) / 100;
}

function earnedForWorkday(settings, shiftType, startTime, endTime) {
  const mode = settings.rateMode;

  if (mode === "hour") {
    const rate = Number(settings.hourRate || 0);
    const hours = calcHours(startTime, endTime);
    return { earned: hours * rate, hours };
  }

  // dagloon
  const dayRate = Number(settings.dayRate || 0);
  const earned = (shiftType === "half") ? (dayRate / 2) : dayRate;
  return { earned, hours: null };
}

function updateSettingsUI() {
  const mode = el("rateMode").value;
  el("dayRateWrap").style.display = (mode === "day") ? "flex" : "none";
  el("hourRateWrap").style.display = (mode === "hour") ? "flex" : "none";

  // bij uurloon is "hele/halve dienst" minder relevant, maar laten we het gewoon staan
  // (als je wilt kan ik die dropdown verbergen wanneer mode=hour)
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

  // settings
  el("rateMode").value = state.settings.rateMode || "day";
  el("dayRate").value = state.settings.dayRate || "";
  el("hourRate").value = state.settings.hourRate || "";
  updateSettingsUI();

  // workdays table (toon extra kolom "Uren" als hour-mode)
  const showHoursCol = state.settings.rateMode === "hour";

  const wb = el("workdaysBody");
  wb.innerHTML = "";

  for (const w of state.workdays) {
    const tr = document.createElement("tr");

    const dienstLabel = (w.rateMode === "hour")
      ? "Uurloon"
      : (w.shiftType === "half" ? "Halve" : "Hele");

    const hoursCell = showHoursCol
      ? `<td>${(w.hours ?? "") === "" ? "" : (Number(w.hours).toFixed(2) + " u")}</td>`
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

  // header aanpassen dynamisch (uren kolom)
  const th
