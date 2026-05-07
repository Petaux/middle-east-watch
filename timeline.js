// ============================================================
// timeline.js — Timeline animée (rejouer les événements jour par jour)
// ============================================================

const Timeline = (() => {
  // Données étendues avec dates (jours relatifs, 0 = aujourd'hui)
  const TIMELINE_EVENTS = [
    // Jour -6
    {lat:31.52,lng:34.45,type:'strikes', front:'gaza', title:'Frappe IDF — Beit Lahiya',       src:'AP',           day:-6, fat:3},
    {lat:33.27,lng:35.20,type:'strikes', front:'liban',title:'Frappe Tyr — dépôt carburant',   src:'L'Orient',    day:-6, fat:0},
    {lat:15.35,lng:42.93,type:'missiles',front:'yemen',title:'Missile Houthi — Détroit Bab',   src:'CENTCOM',      day:-6, fat:0},
    // Jour -5
    {lat:31.40,lng:34.35,type:'ground',  front:'gaza', title:'Opération terrestre — Gaza Centre',src:'Haaretz',    day:-5, fat:0},
    {lat:32.08,lng:34.78,type:'missiles',front:'iran', title:'Salve missiles vers Tel Aviv',    src:'IDF',          day:-5, fat:2},
    {lat:33.55,lng:36.30,type:'strikes', front:'syrie',title:'Frappe IDF — Damas, base IRGC',  src:'Reuters',      day:-5, fat:4},
    // Jour -4
    {lat:31.50,lng:34.46,type:'strikes', front:'gaza', title:'Frappe IDF — Jabalia Nord',       src:'IDF Spox',    day:-4, fat:5},
    {lat:31.35,lng:34.30,type:'strikes', front:'gaza', title:'Frappe Khan Yunis — tunnel',      src:'Reuters',     day:-4, fat:2},
    {lat:33.34,lng:44.40,type:'ground',  front:'irak', title:'Roquette PMF — base Al-Assad',    src:'CENTCOM',     day:-4, fat:1},
    {lat:15.36,lng:44.21,type:'strikes', front:'yemen',title:'Frappe coalition — Sanaa',        src:'Al Jazeera',  day:-4, fat:0},
    // Jour -3
    {lat:31.47,lng:34.43,type:'missiles',front:'gaza', title:'Roquette PIJ — Iron Dome',        src:'IDF',         day:-3, fat:0},
    {lat:33.27,lng:35.14,type:'ground',  front:'liban',title:'Incident frontalier — Kiryat',    src:'Haaretz',     day:-3, fat:1},
    {lat:35.68,lng:51.39,type:'diplo',   front:'iran', title:'Négociations nucléaires — Vienne',src:'Reuters',     day:-3, fat:0},
    // Jour -2
    {lat:31.50,lng:34.46,type:'strikes', front:'gaza', title:'Frappe Jabalia — école UNRWA',    src:'AP',          day:-2, fat:8},
    {lat:31.77,lng:35.21,type:'diplo',   front:'global',title:'Réunion ONU — Conseil sécurité', src:'UN News',    day:-2, fat:0},
    {lat:14.10,lng:42.57,type:'naval',   front:'yemen',title:'Attaque drone — cargo Mer Rouge', src:'CENTCOM',     day:-2, fat:0},
    {lat:34.80,lng:36.71,type:'strikes', front:'syrie',title:'Frappe Homs — couloir iranien',   src:'Reuters',     day:-2, fat:0},
    // Jour -1
    {lat:31.29,lng:34.27,type:'ground',  front:'gaza', title:'Combats urbains — Rafah',         src:'GeoConfirmed',day:-1, fat:0},
    {lat:31.52,lng:34.45,type:'strikes', front:'gaza', title:'Frappe Beit Lahiya — IDF',        src:'IDF Spox',   day:-1, fat:2},
    {lat:33.27,lng:35.20,type:'strikes', front:'liban',title:'Frappe IDF — Tyr, dépôt',        src:'L'Orient',   day:-1, fat:1},
    {lat:25.20,lng:55.27,type:'diplo',   front:'global',title:'Médiation Qatar — Gaza ceasefire',src:'Al Jazeera',day:-1, fat:0},
    // Jour 0 (aujourd'hui)
    {lat:31.50,lng:34.46,type:'strikes', front:'gaza', title:'Frappe IDF — Jabalia, Gaza Nord', src:'IDF Spox',   day:0,  fat:4},
    {lat:31.35,lng:34.30,type:'strikes', front:'gaza', title:'Frappe IDF — Khan Yunis',         src:'Reuters',    day:0,  fat:2},
    {lat:31.29,lng:34.27,type:'ground',  front:'gaza', title:'Combats urbains — Rafah',         src:'GeoConfirmed',day:0, fat:0},
    {lat:31.47,lng:34.43,type:'missiles',front:'gaza', title:'Roquette PIJ — Iron Dome',        src:'IDF',        day:0,  fat:0},
    {lat:33.27,lng:35.20,type:'strikes', front:'liban',title:'Frappe IDF — Tyr, secteur port',  src:'L'Orient',  day:0,  fat:3},
  ];

  const TYPE_COLORS = {
    strikes:'#ef4444', ground:'#f97316', missiles:'#a855f7',
    naval:'#3b82f6', diplo:'#22d3ee'
  };

  let currentDay = -6;
  let maxDay = 0;
  let playing = false;
  let playInterval = null;
  let tlMarkers = [];
  let tlEnabled = false;

  function getLabel(day) {
    if (day === 0) return "Aujourd'hui";
    if (day === -1) return "Hier";
    return "J" + day;
  }

  function renderTLMarkers(day) {
    // Remove old markers
    tlMarkers.forEach(m => m.remove());
    tlMarkers = [];

    // Show events up to this day
    const visible = TIMELINE_EVENTS.filter(e => e.day <= day && e.day >= -6);
    const fadeThreshold = day - 2;

    visible.forEach(ev => {
      const opacity = ev.day < fadeThreshold ? 0.3 : (ev.day === day ? 1 : 0.7);
      const color = TYPE_COLORS[ev.type] || '#fff';
      const size = ev.day === day ? 14 : 8;

      const icon = L.divIcon({
        className: '',
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;
          background:${color};opacity:${opacity};
          border:2px solid rgba(255,255,255,0.4);
          box-shadow:0 0 ${ev.day===day?8:3}px ${color};
          transition:all 0.3s;"></div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      });

      const marker = L.marker([ev.lat, ev.lng], {icon, zIndexOffset: ev.day === day ? 100 : 0})
        .addTo(window._tlMap || window._map);

      if (ev.day === day) {
        marker.bindPopup(`<b>${ev.title}</b><br>
          <span style="color:${color}">${ev.type.toUpperCase()}</span> · ${ev.src}<br>
          ${ev.fat > 0 ? ev.fat + ' victimes' : 'Sans bilan'}`);
      }
      tlMarkers.push(marker);
    });

    // Update label
    const lbl = document.getElementById('tl-day-label');
    if (lbl) lbl.textContent = getLabel(day);

    // Update event count badge
    const todayEvs = TIMELINE_EVENTS.filter(e => e.day === day).length;
    const badge = document.getElementById('tl-day-count');
    if (badge) badge.textContent = todayEvs + ' événement' + (todayEvs > 1 ? 's' : '');
  }

  function setDay(day) {
    currentDay = Math.max(-6, Math.min(maxDay, day));
    const slider = document.getElementById('tl-slider');
    if (slider) slider.value = currentDay;
    renderTLMarkers(currentDay);
    updatePlayBtn();
  }

  function updatePlayBtn() {
    const btn = document.getElementById('tl-play');
    if (btn) btn.textContent = playing ? '⏸' : '▶';
  }

  function play() {
    if (playing) {
      clearInterval(playInterval);
      playing = false;
      updatePlayBtn();
      return;
    }
    playing = true;
    updatePlayBtn();
    if (currentDay >= maxDay) currentDay = -6;
    playInterval = setInterval(() => {
      if (currentDay >= maxDay) {
        clearInterval(playInterval);
        playing = false;
        updatePlayBtn();
        return;
      }
      currentDay++;
      const slider = document.getElementById('tl-slider');
      if (slider) slider.value = currentDay;
      renderTLMarkers(currentDay);
    }, 1200);
  }

  function enable(map) {
    tlEnabled = true;
    window._tlMap = map;
    // Hide normal markers
    if (typeof window._normalLayerGroup !== 'undefined') {
      window._normalLayerGroup.remove();
    }
    setDay(-6);
    const panel = document.getElementById('tl-panel');
    if (panel) panel.style.display = 'flex';
    document.getElementById('tl-toggle')?.classList.add('on');
  }

  function disable() {
    tlEnabled = false;
    clearInterval(playInterval);
    playing = false;
    tlMarkers.forEach(m => m.remove());
    tlMarkers = [];
    if (typeof window._normalLayerGroup !== 'undefined') {
      window._normalLayerGroup.addTo(window._tlMap || window._map);
    }
    const panel = document.getElementById('tl-panel');
    if (panel) panel.style.display = 'none';
    document.getElementById('tl-toggle')?.classList.remove('on');
    // Redraw normal markers
    if (typeof drawMarkers === 'function') drawMarkers(window._currentEvents || []);
  }

  function toggle() {
    if (tlEnabled) disable();
    else {
      const map = window._map || window._leafletMap;
      if (map) enable(map);
    }
  }

  function init(map) {
    window._map = map;
    // Create timeline UI
    const tlPanel = document.createElement('div');
    tlPanel.id = 'tl-panel';
    tlPanel.innerHTML = `
      <div class="tl-bar">
        <button id="tl-play" class="tl-btn" title="Lecture">▶</button>
        <input id="tl-slider" type="range" min="-6" max="0" value="-6" step="1" class="tl-slider">
        <span id="tl-day-label" class="tl-label">J-6</span>
        <span id="tl-day-count" class="tl-count">0 événement</span>
        <button id="tl-close" class="tl-btn" title="Fermer">✕</button>
      </div>
    `;
    document.getElementById('mc')?.appendChild(tlPanel);

    // Events
    document.getElementById('tl-play')?.addEventListener('click', play);
    document.getElementById('tl-slider')?.addEventListener('input', e => setDay(+e.target.value));
    document.getElementById('tl-close')?.addEventListener('click', disable);
  }

  return { init, toggle, enable, disable, play, setDay };
})();

window.Timeline = Timeline;
