// js/map.js — Logique carte Leaflet

const TILE_URLS = {
  dark:      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  topo:      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

const TILE_ATTRS = {
  dark:      '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/">OSM</a>',
  topo:      '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>',
  satellite: '&copy; Esri, DigitalGlobe',
};

let map = null;
let tileLayer = null;
let currentTile = 'dark';
let markerLayers = {};         // { strikes: LayerGroup, ground: LayerGroup, ... }
let layerVisible = {
  strikes:  true,
  ground:   true,
  missiles: true,
  naval:    false,
  diplo:    false,
};

// ---- Initialiser la carte ----
function initMap() {
  map = L.map('map', {
    center: [28, 42],
    zoom: 5,
    zoomControl: false,
    attributionControl: true,
  });

  // Zoom en bas à droite
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Tuiles par défaut (nuit)
  tileLayer = L.tileLayer(TILE_URLS.dark, {
    attribution: TILE_ATTRS.dark,
    subdomains: 'abcd',
    maxZoom: 18,
  }).addTo(map);

  // Créer un LayerGroup par type
  Object.keys(layerVisible).forEach(type => {
    markerLayers[type] = L.layerGroup();
    if (layerVisible[type]) {
      markerLayers[type].addTo(map);
    }
  });
}

// ---- Créer une icône HTML ronde ----
function makeIcon(type, size = 10) {
  const color = TYPE_COLORS[type] || '#aaa';
  const s = type === 'strikes' ? size + 2 : size;
  return L.divIcon({
    className: '',
    html: `<div class="custom-marker" style="
      width:${s}px; height:${s}px;
      background:${color};
      box-shadow: 0 0 8px ${color}88;
    "></div>`,
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
    popupAnchor: [0, -s / 2],
  });
}

// ---- Générer le HTML du popup ----
function makePopupHTML(ev) {
  const fatHTML = ev.fatalities > 0
    ? `<div class="popup-row">Victimes: <span style="color:#ef4444">${ev.fatalities}</span></div>`
    : '';

  const tagsHTML = (ev.tags || []).map(t => {
    const color = TYPE_COLORS[t] || '#aaa';
    const label = TYPE_LABELS[t] || t.toUpperCase();
    return `<span class="popup-tag" style="background:${color}20;color:${color};border:0.5px solid ${color}55">${label}</span>`;
  }).join('');

  return `
    <div style="min-width:190px">
      <div class="popup-title">${ev.title}</div>
      <div class="popup-row">Il y a ${ev.time} · <span>${ev.src}</span></div>
      ${fatHTML}
      <div class="popup-tags">${tagsHTML}</div>
    </div>
  `;
}

// ---- Placer tous les marqueurs ----
function renderMarkers(events) {
  // Vider tous les groupes
  Object.values(markerLayers).forEach(lg => lg.clearLayers());

  events.forEach(ev => {
    if (!markerLayers[ev.type]) return;
    const marker = L.marker([ev.lat, ev.lng], { icon: makeIcon(ev.type) });
    marker.bindPopup(makePopupHTML(ev), { maxWidth: 260 });
    markerLayers[ev.type].addLayer(marker);
  });
}

// ---- Toggle une couche ----
function toggleMapLayer(type, visible) {
  layerVisible[type] = visible;
  if (visible) {
    markerLayers[type].addTo(map);
  } else {
    map.removeLayer(markerLayers[type]);
  }
}

// ---- Changer les tuiles ----
function setTileLayer(name) {
  if (!TILE_URLS[name] || name === currentTile) return;
  map.removeLayer(tileLayer);
  tileLayer = L.tileLayer(TILE_URLS[name], {
    attribution: TILE_ATTRS[name],
    subdomains: name === 'dark' ? 'abcd' : '',
    maxZoom: 18,
  }).addTo(map);
  currentTile = name;
}

// ---- Voler vers un point ----
function flyTo(lat, lng, zoom = 8) {
  map.flyTo([lat, lng], zoom, { animate: true, duration: 1.2 });
}

// ---- Réinitialiser la vue ----
function resetView() {
  map.flyTo([28, 42], 5, { animate: true, duration: 1.0 });
}
