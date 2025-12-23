const STORAGE_KEY = "werkdagen_pwa_multilang_v1";
const el = (id) => document.getElementById(id);

const I18N = {
  nl: {
    appTitle: "Werkdagen",
    appSubtitle: "Invoer + automatisch tegoed",
    settingsTitle: "Instellingen",
    langLabel: "Taal",
    rateModeLabel: "Berekenen op basis van",
    day: "Dagloon",
    hour: "Uurloon",
    dayRateLabel: "Dagloon (€)",
    hourRateLabel: "Uurloon (€)",
    save: "Opslaan",
    reset: "Alles wissen",
    settingsHint: "Alles wordt lokaal opgeslagen op je iPhone (geen cloud). Maak af en toe een JSON back-up.",
    summaryTitle: "Overzicht",
    earnedLabel: "Verdiend",
    paidLabel: "Ontvangen",
    dueLabel: "Nog tegoed",
    addWorkdayTitle: "Werkdag toevoegen",
    workDateLabel: "Datum",
    shiftLabel: "Dienst (bij dagloon)",
    shiftFull: "Hele dienst",
    shiftHalf: "Halve dienst",
    startLabel: "Begin",
    endLabel: "Eind",
    addWorkday: "Toevoegen",
    addPaymentTitle: "Betaling toevoegen",
    payDateLabel: "Datum",
    payAmountLabel: "Bedrag (€)",
    addPayment: "Toevoegen",
    exportTitle: "Export / Import",
    exportJson: "Export (JSON)",
    exportPdf: "Export (PDF)",
    importLabel: "Import (JSON)",
    exportHint: "PDF export: iPhone toont “Print”. Open de preview (pinch/zoom) → Deel → “Bewaar in Bestanden”.",
    delete: "Verwijder",
    // Table headers
    thDate: "Datum",
    thType: "Dienst",
    thStart: "Begin",
    thEnd: "Eind",
    thHours: "Uren",
    thEarned: "Verdiend",
    thAmount: "Bedrag",
    // Types
    typeFull: "Hele",
    typeHalf: "Halve",
    typeHourly: "Uurloon",
    // Alerts
    aPickDate: "Kies een datum.",
    aFillDayRate: "Vul je dagloon in bij Instellingen en klik Opslaan.",
    aFillHourRate: "Vul je uurloon in bij Instellingen en klik Opslaan.",
    aFillTimes: "Vul begin- en eindtijd in (nodig voor uurloon).",
    aFillAmount: "Vul een bedrag in groter dan 0.",
    aConfirmReset: "Weet je zeker dat je ALLES wilt wissen?",
    aImportOk: "Import gelukt.",
    aImportFail: "Import mislukt. Bestand is geen geldige JSON back-up."
  },
  tr: {
    appTitle: "Çalışma Günleri",
    appSubtitle: "Kayıt + otomatik alacak hesaplama",
    settingsTitle: "Ayarlar",
    langLabel: "Dil",
    rateModeLabel: "Hesaplama türü",
    day: "Günlük ücret",
    hour: "Saatlik ücret",
    dayRateLabel: "Günlük ücret (€)",
    hourRateLabel: "Saatlik ücret (€)",
    save: "Kaydet",
    reset: "Her şeyi sil",
    settingsHint: "Tüm veriler iPhone’da yerel olarak saklanır (bulut yok). Ara sıra JSON yedeği al.",
    summaryTitle: "Genel Özet",
    earnedLabel: "Kazanılan",
    paidLabel: "Alınan",
    dueLabel: "Kalan alacak",
    addWorkdayTitle: "Çalışma Günü Ekle",
    workDateLabel: "Tarih",
    shiftLabel: "Vardiya (günlük ücret)",
    shiftFull: "Tam gün",
    shiftHalf: "Yarım gün",
    startLabel: "Başlangıç",
    endLabel: "Bitiş",
    addWorkday: "Ekle",
    addPaymentTitle: "Ödeme Ekle",
    payDateLabel: "Tarih",
    payAmountLabel: "Tutar (€)",
    addPayment: "Ekle",
    exportTitle: "Dışa Aktar / İçe Aktar",
    exportJson: "JSON dışa aktar",
    exportPdf: "PDF oluştur",
    importLabel: "JSON içe aktar",
    exportHint: "PDF: “PDF oluştur” → Yazdır → Önizlemeyi aç (pinch) → Paylaş → Dosyalara Kaydet",
    delete: "Sil",
    thDate: "Tarih",
    thType: "Tür",
    thStart: "Başlangıç",
    thEnd: "Bitiş",
    thHours: "Saat",
    thEarned: "Kazanç",
    thAmount: "Tutar",
    typeFull: "Tam",
    typeHalf: "Yarım",
    typeHourly: "Saatlik",
    aPickDate: "Lütfen bir tarih seç.",
    aFillDayRate: "Lütfen Ayarlar kısmına günlük ücreti gir ve Kaydet’e bas.",
    aFillHourRate: "Lütfen Ayarlar kısmına saatlik ücreti gir ve Kaydet’e bas.",
    aFillTimes: "Saatlik ücret için başlangıç ve bitiş saatini gir.",
    aFillAmount: "Lütfen 0’dan büyük bir tutar gir.",
    aConfirmReset: "Tüm verileri SİLMEK istediğine emin misin?",
    aImportOk: "İçe aktarma başarılı.",
    aImportFail: "İçe aktarma başarısız. Dosya geçerli bir JSON yedeği değil."
  },
  en: {
    appTitle: "Workdays",
    appSubtitle: "Entry + automatic balance",
    settingsTitle: "Settings",
    langLabel: "Language",
    rateModeLabel: "Calculate based on",
    day: "Daily rate",
    hour: "Hourly rate",
    dayRateLabel: "Daily rate (€)",
    hourRateLabel: "Hourly rate (€)",
    save: "Save",
    reset: "Delete all",
    settingsHint: "Everything is stored locally on your iPhone (no cloud). Make a JSON backup occasionally.",
    summaryTitle: "Summary",
    earnedLabel: "Earned",
    paidLabel: "Paid",
    dueLabel: "Due",
    addWorkdayTitle: "Add workday",
    workDateLabel: "Date",
    shiftLabel: "Shift (daily rate)",
    shiftFull: "Full shift",
    shiftHalf: "Half shift",
    startLabel: "Start",
    endLabel: "End",
    addWorkday: "Add",
    addPaymentTitle: "Add payment",
    payDateLabel: "Date",
    payAmountLabel: "Amount (€)",
    addPayment: "Add",
    exportTitle: "Export / Import",
    exportJson: "Export (JSON)",
    exportPdf: "Export (PDF)",
    importLabel: "Import (JSON)",
    exportHint: "PDF export: iPhone shows “Print”. Open the preview (pinch/zoom) → Share → “Save to Files”.",
    delete: "Delete",
    thDate: "Date",
    thType: "Type",
    thStart: "Start",
    thEnd: "End",
    thHours: "Hours",
    thEarned: "Earned",
    thAmount: "Amount",
    typeFull: "Full",
    typeHalf: "Half",
    typeHourly: "Hourly",
    aPickDate: "Please pick a date.",
    aFillDayRate: "Enter your daily rate in Settings and tap Save.",
    aFillHourRate: "Enter your hourly rate in Settings and tap Save.",
    aFillTimes: "Enter start and end time (required for hourly rate).",
    aFillAmount: "Enter an amount greater than 0.",
    aConfirmReset: "Are you sure you want to delete EVERYTHING?",
    aImportOk: "Import successful.",
    aImportFail: "Import failed. File is not a valid JSON backup."
  }
};

function getLocale(lang) {
  if (lang === "tr") return "tr-TR";
  if (lang === "en") return "en-GB";
  return "nl-NL";
}

function euro(n) {
  const lang = state?.settings?.language || "nl";
  return new Intl.NumberFormat(getLocale(lang), { style: "currency", currency: "EUR" })
    .format(Number(n || 0));
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

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      settings: { language: "nl", rateMode: "day", dayRate: 0, hourRate: 0 },
      workdays: [],
      payments: []
    };
  }
  try {
    const s = JSON.parse(raw);
    return {
      settings: {
        language: (s?.settings?.language && I18N[s.settings.language]) ? s.settings.language : "nl",
        rateMode: (s?.settings?.rateMode === "hour") ? "hour" : "day",
        dayRate: Number(s?.settings?.dayRate || 0),
        hourRate: Number(s?.settings?.hourRate || 0)
      },
      workdays: Array.isArray(s?.workdays) ? s.workdays : [],
      payments: Array.isArray(s?.payments) ? s.payments : []
    };
  } catch {
    return {
      settings: { language: "nl", rateMode: "day", dayRate: 0, hourRate: 0 },
      workdays: [],
      payments: []
    };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sortByDateAsc(items, key = "date") {
  return [...items].sort((a, b) => (a[key] || "").localeCompare(b[key] || ""));
}

// 13:00 -> 01:00 (overnight) works
function calcHours(startTime, endTime) {
  if (!startTime || !endTime) return 0;

  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  if (![sh, sm, eh, em].every(n => Number.isFinite(n))) return 0;

  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;

  let diff = endMin - startMin;
  if (diff < 0) diff += 24 * 60;

  return Math.round((diff / 60) * 100) / 100;
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
  el("shiftWrap").style.display = (mode === "day") ? "flex" : "none";
}

function t() {
  return I18N[state.settings.language];
}

function applyLanguage() {
  const tr = t();

  // Titles
  el("appTitle").textContent = tr.appTitle;
  el("appSubtitle").textContent = tr.appSubtitle;

  el("settingsTitle").textContent = tr.settingsTitle;
  el("langLabel").textContent = tr.langLabel;
  el("rateModeLabel").textContent = tr.rateModeLabel;

  // Select option texts
  const rateMode = el("rateMode");
  rateMode.options[0].text = tr.day;
  rateMode.options[1].text = tr.hour;

  el("dayRateLabel").textContent = tr.dayRateLabel;
  el("hourRateLabel").textContent = tr.hourRateLabel;

  el("saveSettings").textContent = tr.save;
  el("resetAll").textContent = tr.reset;
  el("settingsHint").textContent = tr.settingsHint;

  el("summaryTitle").textContent = tr.summaryTitle;
  el("earnedLabel").textContent = tr.earnedLabel;
  el("paidLabel").textContent = tr.paidLabel;
  el("dueLabel").textContent = tr.dueLabel;

  el("addWorkdayTitle").textContent = tr.addWorkdayTitle;
  el("workDateLabel").textContent = tr.workDateLabel;
  el("shiftLabel").textContent = tr.shiftLabel;
  el("shiftFull").textContent = tr.shiftFull;
  el("shiftHalf").textContent = tr.shiftHalf;
  el("startLabel").textContent = tr.startLabel;
  el("endLabel").textContent = tr.endLabel;
  el("addWorkday").textContent = tr.addWorkday;

  el("addPaymentTitle").textContent = tr.addPaymentTitle;
  el("payDateLabel").textContent = tr.payDateLabel;
  el("payAmountLabel").textContent = tr.payAmountLabel;
  el("addPayment").textContent = tr.addPayment;

  el("exportTitle").textContent = tr.exportTitle;
  el("exportData").textContent = tr.exportJson;
  el("exportPdf").textContent = tr.exportPdf;
  el("importLabel").textContent = tr.importLabel;
  el("exportHint").textContent = tr.exportHint;

  // table headers are set in render()
}

function renderTablesHeaders() {
  const tr = t();
  const showHoursCol = state.settings.rateMode === "hour";

  const wh = ["thDate", "thType", "thStart", "thEnd"];
  if (showHoursCol) wh.push("thHours");
  wh.push("thEarned");

  // plus empty column for delete button
  const headerRow = el("workdaysHeaderRow");
  headerRow.innerHTML = wh.map(k => `<th>${tr[k]}</th>`).join("") + `<th></th>`;

  const payHeaderRow = el("paymentsHeaderRow");
  payHeaderRow.innerHTML = `<th>${tr.thDate}</th><th>${tr.thAmount}</th><th></th>`;
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

  renderTablesHeaders();

  const tr = t();
  const showHoursCol = state.settings.rateMode === "hour";

  // workdays rows
  const wb = el("workdaysBody");
  wb.innerHTML = "";
  for (const w of state.workdays) {
    const dienstLabel = (w.rateMode === "hour")
      ? tr.typeHourly
      : (w.shiftType === "half" ? tr.typeHalf : tr.typeFull);

    const hoursCell = showHoursCol
      ? `<td>${(w.hours == null) ? "" : (Number(w.hours).toFixed(2) + " h")}</td>`
      : "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${w.date || ""}</td>
      <td>${dienstLabel}</td>
      <td>${w.startTime || ""}</td>
      <td>${w.endTime || ""}</td>
      ${hoursCell}
      <td>${euro(w.earned || 0)}</td>
      <td><button class="small-btn" data-del-work="${w.id}">${tr.delete}</button></td>
    `;
    wb.appendChild(row);
  }

  // payments rows
  const pb = el("paymentsBody");
  pb.innerHTML = "";
  for (const p of state.payments) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.date || ""}</td>
      <td>${euro(p.amount || 0)}</td>
      <td><button class="small-btn" data-del-pay="${p.id}">${tr.delete}</button></td>
    `;
    pb.appendChild(row);
  }

  // sync UI values
  el("language").value = state.settings.language;
  el("rateMode").value = state.settings.rateMode;
  el("dayRate").value = state.settings.dayRate || "";
  el("hourRate").value = state.settings.hourRate || "";
  updateSettingsUI();
}

// ---- init ----
let state = loadState();

el("workDate").value = todayISO();
el("payDate").value = todayISO();

// Apply language first
applyLanguage();
render();

// Language change (live)
el("language").addEventListener("change", () => {
  const chosen = el("language").value;
  state.settings.language = (I18N[chosen] ? chosen : "nl");
  saveState();
  applyLanguage();
  render();
});

el("rateMode").addEventListener("change", () => {
  updateSettingsUI();
  // optional: rerender headers immediately
  state.settings.rateMode = (el("rateMode").value === "hour") ? "hour" : "day";
  saveState();
  render();
});

el("saveSettings").addEventListener("click", () => {
  state.settings.language = el("language").value;
  state.settings.rateMode = (el("rateMode").value === "hour") ? "hour" : "day";
  state.settings.dayRate = Number(el("dayRate").value || 0);
  state.settings.hourRate = Number(el("hourRate").value || 0);

  saveState();
  applyLanguage();
  render();
});

el("addWorkday").addEventListener("click", () => {
  const tr = t();
  const date = el("workDate").value;
  const shiftType = el("shiftType").value;
  const startTime = el("startTime").value;
  const endTime = el("endTime").value;

  if (!date) { alert(tr.aPickDate); return; }

  if (state.settings.rateMode === "day") {
    if (!state.settings.dayRate || state.settings.dayRate <= 0) {
      alert(tr.aFillDayRate);
      return;
    }
  } else {
    if (!state.settings.hourRate || state.settings.hourRate <= 0) {
      alert(tr.aFillHourRate);
      return;
    }
    if (!startTime || !endTime) {
      alert(tr.aFillTimes);
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
    rateMode: state.settings.rateMode
  });

  saveState();
  render();
});

el("addPayment").addEventListener("click", () => {
  const tr = t();
  const date = el("payDate").value;
  const amount = Number(el("payAmount").value || 0);

  if (!date) { alert(tr.aPickDate); return; }
  if (!amount || amount <= 0) { alert(tr.aFillAmount); return; }

  state.payments.push({ id: uid(), date, amount });
  el("payAmount").value = "";
  saveState();
  render();
});

// delete handlers
el("workdaysBody").addEventListener("click", (e) => {
  const id = e.target?.getAttribute?.("data-del-work");
  if (!id) return;
  state.workdays = state.workdays.filter(w => w.id !== id);
  saveState();
  render();
});

el("paymentsBody").addEventListener("click", (e) => {
  const id = e.target?.getAttribute?.("data-del-pay");
  if (!id) return;
  state.payments = state.payments.filter(p => p.id !== id);
  saveState();
  render();
});

el("resetAll").addEventListener("click", () => {
  const tr = t();
  if (!confirm(tr.aConfirmReset)) return;
  localStorage.removeItem(STORAGE_KEY);
  state = loadState();
  applyLanguage();
  render();
});

// JSON export/import
el("exportData").addEventListener("click", () => {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "workdays-backup.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

el("importData").addEventListener("change", async (e) => {
  const tr = t();
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const imported = JSON.parse(text);

    state = {
      settings: {
        language: (imported?.settings?.language && I18N[imported.settings.language]) ? imported.settings.language : "nl",
        rateMode: (imported?.settings?.rateMode === "hour") ? "hour" : "day",
        dayRate: Number(imported?.settings?.dayRate || 0),
        hourRate: Number(imported?.settings?.hourRate || 0)
      },
      workdays: Array.isArray(imported?.workdays) ? imported.workdays : [],
      payments: Array.isArray(imported?.payments) ? imported.payments : []
    };

    saveState();
    applyLanguage();
    render();
    alert(tr.aImportOk);
  } catch {
    alert(tr.aImportFail);
  } finally {
    e.target.value = "";
  }
});

// PDF export (Print -> Save as PDF)
el("exportPdf").addEventListener("click", () => {
  render();
  window.print();
});
