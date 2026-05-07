// js/ui.js — Interactions UI (sidebar, events, clock, tabs)

let currentFront = 'all';
let allEvents = [];

// ---- Horloge UTC ----
function startClock() {
  function tick() {
    const n = new Date();
    const p = v => String(v).padStart(2, '0');
    document.getElementById('clock').textContent =
      `${p(n.getUTCHours())}:${p(n.getUTCMinutes())}:${p(n.getUTCSeconds())} UTC`;
  }
  tick();
  setInterval(tick, 1000);
}

// ---- Rendre la liste d'évènements ----
function renderEventList(front) {
  const list = document.getElementById('event-list');
  list.innerHTML = '';

  const data = front === 'all'
    ? allEvents
    : allEvents.filter(e => e.front === front);

  if (data.length === 0) {
    list.innerHTML = '<div style="padding:16px 12px;font-size:11px;color:var(--t3)">Aucun évènement pour ce front.</div>';
    return;
  }

  data.slice(0, 25).forEach(ev => {
    const div = document.createElement('div');
    div.className = 'event-item';

    const tagsHTML = (ev.tags || []).map(t =>
      `<span class="etag etag-${t}">${TYPE_LABELS[t] || t.toUpperCase()}</span>`
    ).join('');

    div.innerHTML = `
      <div class="event-time">Il y a ${ev.time}</div>
      <div class="event-title">${ev.title}</div>
      <div class="event-tags">${tagsHTML}</div>
      <div class="event-source">${ev.src}</div>
    `;

    div.addEventListener('click', () => flyTo(ev.lat, ev.lng, 10));
    list.appendChild(div);
  });
}

// ---- Mettre à jour les stats ----
function updateStats(events) {
  const counts = { strikes: 0, ground: 0, missiles: 0, naval: 0, diplo: 0 };
  events.forEach(e => { if (counts[e.type] !== undefined) counts[e.type]++; });

  const total = events.length;
  document.getElementById('sv-total').textContent    = total;
  document.getElementById('sv-strikes').textContent  = counts.strikes;
  document.getElementById('sv-missiles').textContent = counts.missiles;

  // Compteurs dans la sidebar
  Object.keys(counts).forEach(k => {
    const el = document.getElementById('cnt-' + k);
    if (el) el.textContent = counts[k];
  });
}

// ---- Focus sur un front ----
function focusFront(front, lat, lng, zoom) {
  currentFront = front;

  // Sidebar gauche
  document.querySelectorAll('.front-item').forEach(f => f.classList.remove('active'));
  const frontEl = document.querySelector(`.front-item[data-front="${front}"]`);
  if (frontEl) frontEl.classList.add('active');

  // Bottom bar
  document.querySelectorAll('.conflict-card').forEach(c => c.classList.remove('active'));
  const ccEl = document.querySelector(`.conflict-card[data-front="${front}"]`);
  if (ccEl) ccEl.classList.add('active');

  renderEventList(front);

  if (lat !== undefined && lng !== undefined) {
    flyTo(lat, lng, zoom || 7);
  } else {
    resetView();
  }

  // Refiltrer les marqueurs si besoin
  renderMarkers(
    front === 'all' ? allEvents : allEvents.filter(e => e.front === front)
  );
}

// ---- Charger les données dans l'UI ----
function loadEventsIntoUI(events) {
  allEvents = events;
  updateStats(events);
  renderEventList(currentFront);
  renderMarkers(currentFront === 'all' ? events : events.filter(e => e.front === currentFront));
}

// ---- Attacher les écouteurs ----
function initUI() {

  // Couches toggle
  document.querySelectorAll('.layer-item').forEach(item => {
    item.addEventListener('click', () => {
      const layer = item.dataset.layer;
      const tog = document.getElementById('tog-' + layer);
      const isOn = tog.classList.toggle('on');
      toggleMapLayer(layer, isOn);
    });
  });

  // Fronts (sidebar)
  document.querySelectorAll('.front-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const f    = btn.dataset.front;
      const lat  = parseFloat(btn.dataset.lat);
      const lng  = parseFloat(btn.dataset.lng);
      const zoom = parseInt(btn.dataset.zoom) || 7;
      focusFront(f, isNaN(lat) ? undefined : lat, isNaN(lng) ? undefined : lng, zoom);
    });
  });

  // Bottom bar
  document.querySelectorAll('.conflict-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.front;
      const frontBtn = document.querySelector(`.front-item[data-front="${f}"]`);
      if (frontBtn) frontBtn.click();
    });
  });

  // Tile switcher
  document.querySelectorAll('.map-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setTileLayer(btn.dataset.tile);
    });
  });

  // Tabs header (simple placeholder pour l'instant)
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}
