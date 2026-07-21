/* =========================================================================
   PulseBuddy — app logic
   Vanilla JS, no dependencies. All state lives in memory for this session.
   ========================================================================= */

(function () {
  'use strict';

  /* ---------------- State ---------------- */

  const dailyGoal = 10000; // Steps goal
   const targetRange = {
  low: 0,
  high: dailyGoal
};

  // Last 8 glucose readings across the day, oldest first.
  const readingHistory = [
  { hour: 'Mon', value: 6500 },
  { hour: 'Tue', value: 7200 },
  { hour: 'Wed', value: 8400 },
  { hour: 'Thu', value: 9100 },
  { hour: 'Fri', value: 7800 },
  { hour: 'Sat', value: 10300 },
  { hour: 'Sun', value: 8450 }
];
  // Combined activity feed, newest first.
  const activityLog = [
  {
    type:'workout',
    icon:'🏋️',
    title:'Chest Workout',
    sub:'60 Minutes',
    minsAgo:20
  },
  {
    type:'water',
    icon:'💧',
    title:'Water Intake',
    sub:'2.5 Liters',
    minsAgo:60
  },
  {
    type:'Steps',
    icon:'👣',
    title:'8450 Steps',
    sub:'Today's Walking',
    minsAgo:120
  },
  {
    type:'sleep',
    icon:'😴',
    title:'Sleep',
    sub:'7h 45m',
    minsAgo:480
  }
];

  let currentSteps = 8450;
  let medTaken = false;
let calories = 620;
let water = 2.5;
let sleep = 7.8;

  /* ---------------- Helpers ---------------- */

  function zoneOf(value) {
    if (value < targetRange.low) return 'low';
    if (value > targetRange.high) return 'high';
    return 'in';
  }

  function zoneColor(zone) {
    return zone === 'low' ? '#4C6EF5' : zone === 'high' ? '#E8734A' : '#2FA88A';
  }

  function timeAgoLabel(mins) {
    if (mins < 60) return mins + ' min ago';
    const h = Math.floor(mins / 60);
    return h + (h === 1 ? ' hour ago' : ' hours ago');
  }

  /* ---------------- Navigation ---------------- */

  const screens = document.querySelectorAll('.screen');
  const navButtons = document.querySelectorAll('.nav-btn');

  function showScreen(name) {
    screens.forEach((s) => s.classList.toggle('hidden', s.dataset.screen !== name));
    navButtons.forEach((b) => b.classList.toggle('active', b.dataset.nav === name));
    if (name === 'trends') drawTrendChart();
  }

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => showScreen(btn.dataset.nav));
  });

  document.getElementById('btnProfile').addEventListener('click', () => showScreen('profile'));
  document.getElementById('btnProfile').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') showScreen('profile');
  });

  /* ---------------- Ring gauge + readout ---------------- */

  const RING_CIRCUMFERENCE = 2 * Math.PI * 92;
  const ringProgress = document.getElementById('ringProgress');
  const StepsValueEl = document.getElementById('StepsValue');
  const trendArrowEl = document.getElementById('trendArrow');
  const readingAgeEl = document.getElementById('readingAge');

  function gaugeFraction(value) {
    // Purely visual fill, mapped across a wide 40-300 mg/dL window.
    return Math.min(value / dailyGoal, 1);
  }

  function animateDigits(el, from, to, duration) {
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function updateReadingCard(value, trendText, trendDirection) {
    const zone = zoneOf(value);
    const color = zoneColor(zone);
    const fraction = gaugeFraction(value);

    ringProgress.style.stroke = color;
    ringProgress.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - fraction);

    animateDigits(StepsValueEl, 0, value, 900);

    trendArrowEl.style.color = color;
    trendArrowEl.style.background = color + '1A';
    trendArrowEl.innerHTML =
      (trendDirection === 'up'
        ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10 L7 4 L12 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : trendDirection === 'down'
        ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4 L7 10 L12 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7 L12 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>') +
      trendText;

    readingAgeEl.textContent = 'just now';
  }

  /* ---------------- Time in range ---------------- */

  function recomputeTimeInRange() {
    const values = readingHistory.map((r) => r.value).concat(currentSteps);
    let low = 0, inR = 0, high = 0;
    values.forEach((v) => {
      const z = zoneOf(v);
      if (z === 'low') low++; else if (z === 'high') high++; else inR++;
    });
    const total = values.length;
    const lowPct = Math.round((low / total) * 100);
    const highPct = Math.round((high / total) * 100);
    const inPct = 100 - lowPct - highPct;

    document.getElementById('tirPercent').textContent = inPct + '%';
    const bar = document.getElementById('tirBar');
    bar.innerHTML =
      '<div class="tir-seg tir-low" style="width:' + lowPct + '%"></div>' +
      '<div class="tir-seg tir-in" style="width:' + inPct + '%"></div>' +
      '<div class="tir-seg tir-high" style="width:' + highPct + '%"></div>';

    document.getElementById('statAvg').textContent =
      Math.round(values.reduce((a, b) => a + b, 0) / total);
    document.getElementById('statInRange').textContent = inPct + '%';

    const spread = Math.max(...values) - Math.min(...values);
    document.getElementById('statVariability').textContent =
      spread > 90 ? 'High' : spread > 50 ? 'Moderate' : 'Low';
  }

  /* ---------------- Activity feed rendering ---------------- */

  function renderLogList(target, limit) {
    const list = document.getElementById(target);
    const items = limit ? activityLog.slice(0, limit) : activityLog;
    list.innerHTML = items
      .map(
        (item) =>
          '<li><span class="log-icon">' + item.icon + '</span>' +
          '<span class="log-body"><span class="log-title">' + item.title + '</span>' +
          '<span class="log-sub">' + item.sub + '</span></span>' +
          '<span class="log-time">' + timeAgoLabel(item.minsAgo) + '</span></li>'
      )
      .join('');
  }

  /* ---------------- Medication ---------------- */

  document.getElementById('medCheck').addEventListener('click', function () {
    medTaken = !medTaken;
    this.textContent = medTaken ? 'Taken ✓' : 'Mark taken';
    this.classList.toggle('done', medTaken);
  });

  /* ---------------- Quick actions -> log form ---------------- */

  const logTypeConfig = {
    meal: { title: 'Log a meal', subtitle: 'Track carbs for this meal', fields: ['carb'] },
    insulin: { title: 'Log insulin', subtitle: 'Record your dose', fields: ['dose'] },
    activity: { title: 'Log activity', subtitle: 'Add movement to today', fields: ['activity'] },
    reading: { title: 'Log a reading', subtitle: 'Add a fingerstick or CGM value', fields: ['glucose'] }
  };

  const fieldEls = {
    glucose: document.getElementById('glucoseField'),
    carb: document.getElementById('carbField'),
    dose: document.getElementById('doseField'),
    activity: document.getElementById('activityField')
  };

  let activeLogType = 'reading';

  function openLogForm(type) {
    activeLogType = type;
    const config = logTypeConfig[type];
    document.getElementById('logTitle').textContent = config.title;
    document.getElementById('logSubtitle').textContent = config.subtitle;

    Object.keys(fieldEls).forEach((key) => {
      fieldEls[key].classList.toggle('field-hidden', !config.fields.includes(key));
    });

    document.getElementById('formConfirm').classList.add('hidden');
    document.getElementById('logForm').reset();
    showScreen('log');
  }

  document.querySelectorAll('.qa-btn').forEach((btn) => {
    btn.addEventListener('click', () => openLogForm(btn.dataset.logType));
  });

  /* ---------------- Log form submit ---------------- */

  document.getElementById('logForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const config = logTypeConfig[activeLogType];
    let entry = null;

    if (activeLogType === 'reading') {
      const val = parseInt(document.getElementById('glucoseInput').value, 10);
      if (!val) return;
      entry = { type: 'reading', icon: '🩸', title: val + ' mg/dL', sub: 'Fingerstick', minsAgo: 0 };
      currentsteps = val;
      readingHistory.push({ hour: 'now', value: val });
      readingHistory.shift();
      updateReadingCard(val, val > currentSteps ? 'Goal Updated' : 'Updated', 'flat');
    } else if (activeLogType === 'meal') {
      const carbs = document.getElementById('carbInput').value || '0';
      entry = { type: 'meal', icon: '🍽️', title: 'Meal logged', sub: carbs + 'g carbs', minsAgo: 0 };
    } else if (activeLogType === 'insulin') {
      const dose = document.getElementById('doseInput').value || '0';
      entry = { type: 'insulin', icon: '💉', title: 'Insulin logged', sub: dose + ' units, rapid-acting', minsAgo: 0 };
    } else if (activeLogType === 'activity') {
      const act = document.getElementById('activityInput').value;
      entry = { type: 'activity', icon: '🏃', title: act + ' logged', sub: 'Just now', minsAgo: 0 };
    }

    if (entry) {
      activityLog.unshift(entry);
      renderLogList('dashboardLogList', 4);
      renderLogList('trendsLogList');
      recomputeTimeInRange();
    }

    document.getElementById('formConfirm').classList.remove('hidden');
    setTimeout(() => showScreen('dashboard'), 900);
  });

  /* ---------------- Trend chart (canvas) ---------------- */

  function drawTrendChart() {
    const canvas = document.getElementById('trendChart');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const padL = 44, padR = 16, padT = 20, padB = 34;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    ctx.clearRect(0, 0, W, H);

    const minY = 40, maxY = 260;
    const yForValue = (v) => padT + plotH * (1 - (v - minY) / (maxY - minY));
    const xForIndex = (i) => padL + (plotW * i) / (readingHistory.length - 1);

    // Target range band
    ctx.fillStyle = 'rgba(47,168,138,0.10)';
    const bandTop = yForValue(targetRange.high);
    const bandBottom = yForValue(targetRange.low);
    ctx.fillRect(padL, bandTop, plotW, bandBottom - bandTop);

    // Gridlines + y labels
    ctx.strokeStyle = '#E3ECE9';
    ctx.fillStyle = '#5C7873';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    [60, 120, 180, 240].forEach((v) => {
      const y = yForValue(v);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillText(String(v), padL - 8, y);
    });

    // X labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    readingHistory.forEach((r, i) => {
      ctx.fillText(r.hour, xForIndex(i), H - padB + 10);
    });

    // Line
    ctx.beginPath();
    readingHistory.forEach((r, i) => {
      const x = xForIndex(i), y = yForValue(r.value);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#1B6B63';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Points
    readingHistory.forEach((r, i) => {
      const x = xForIndex(i), y = yForValue(r.value);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = zoneColor(zoneOf(r.value));
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
    });
  }

  /* ---------------- Init ---------------- */

  function init() {
    updateReadingCard(currentSteps,'Goal 84% Complete','up');
    recomputeTimeInRange();
    renderLogList('dashboardLogList', 4);
    renderLogList('trendsLogList');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
