// js/acled.js — Intégration API ACLED

// Clés stockées en mémoire (session uniquement, jamais en localStorage)
let _acledKey   = '';
let _acledEmail = '';

// Mapping event_type ACLED → type interne
function mapACLEDType(eventType) {
  if (!eventType) return 'strikes';
  const t = eventType.toLowerCase();
  if (t.includes('air') || t.includes('drone'))           return 'strikes';
  if (t.includes('explosion') || t.includes('remote'))    return 'missiles';
  if (t.includes('battle') || t.includes('armed clash'))  return 'ground';
  if (t.includes('strategic'))                            return 'diplo';
  return 'strikes';
}

// Deviner le front d'après les coordonnées
function guessFront(lat, lng) {
  if (lat > 30 && lat < 33 && lng > 34 && lng < 35.5) return 'gaza';
  if (lat > 33 && lat < 35 && lng > 35 && lng < 37)   return 'liban';
  if (lat > 24 && lat < 40 && lng > 44 && lng < 64)   return 'iran';
  if (lat > 12 && lat < 18 && lng > 42 && lng < 50)   return 'yemen';
  if (lat > 32 && lat < 38 && lng > 35 && lng < 43)   return 'syrie';
  if (lat > 29 && lat < 38 && lng > 38 && lng < 46)   return 'irak';
  return 'global';
}

// Convertir un évènement ACLED → format interne
function convertACLEDEvent(ev, index) {
  const lat  = parseFloat(ev.latitude);
  const lng  = parseFloat(ev.longitude);
  const type = mapACLEDType(ev.event_type);

  return {
    id:         ev.data_id || index,
    lat,
    lng,
    type,
    front:      guessFront(lat, lng),
    title:      (ev.notes || ev.event_type || 'Évènement').substring(0, 80),
    src:        ev.source || 'ACLED',
    time:       ev.event_date || '—',
    fatalities: parseInt(ev.fatalities) || 0,
    tags:       [type],
  };
}

// Appel à l'API ACLED
// Documentation: https://acleddata.com/api-documentation/getting-started
async function fetchACLEDData(key, email) {
  setACLEDStatus('loading');

  // Régions: 11 = Moyen-Orient, 12 = Maghreb/Afrique du Nord
  // On filtre les 90 derniers jours, 300 évènements max
  const today = new Date();
  const since = new Date(today);
  since.setDate(since.getDate() - 90);
  const sinceStr = since.toISOString().split('T')[0];

  const params = new URLSearchParams({
    key,
    email,
    region:           '11,12',
    event_date:       sinceStr,
    event_date_where: '>',
    limit:            '300',
    fields:           'data_id|latitude|longitude|event_type|notes|event_date|fatalities|source|country',
    format:           'json',
  });

  const url = `https://api.acleddata.com/acled/read?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // ACLED renvoie { status: 200, data: [...], count: N }
    if (data.status !== 200 || !Array.isArray(data.data)) {
      throw new Error(data.error || 'Réponse inattendue de l\'API');
    }

    const events = data.data
      .map(convertACLEDEvent)
      .filter(e => !isNaN(e.lat) && !isNaN(e.lng));

    setACLEDStatus('ok', `${events.length} évènements chargés`);
    return events;

  } catch (err) {
    console.error('[ACLED]', err);
    setACLEDStatus('error', err.message);
    return null;
  }
}

// Mettre à jour l'indicateur de statut dans le header
function setACLEDStatus(state, message) {
  const dot   = document.querySelector('#acled-status-header .status-dot');
  const label = document.querySelector('#acled-status-header .status-label');

  switch (state) {
    case 'loading':
      dot.className   = 'status-dot warn';
      label.textContent = 'ACLED — chargement…';
      break;
    case 'ok':
      dot.className   = 'status-dot ok';
      label.textContent = `ACLED — ${message}`;
      break;
    case 'error':
      dot.className   = 'status-dot off';
      label.textContent = `ACLED — erreur: ${message}`;
      break;
    default:
      dot.className   = 'status-dot off';
      label.textContent = 'ACLED — non configuré';
  }
}

// Ouvrir / fermer la modale
function openConfigModal() {
  const modal = document.getElementById('api-modal');
  modal.removeAttribute('hidden');
  if (_acledKey)   document.getElementById('acled-key').value   = _acledKey;
  if (_acledEmail) document.getElementById('acled-email').value = _acledEmail;
}

function closeConfigModal() {
  document.getElementById('api-modal').setAttribute('hidden', '');
}

// Sauvegarder la config et lancer le fetch
async function saveAndConnect() {
  const key   = document.getElementById('acled-key').value.trim();
  const email = document.getElementById('acled-email').value.trim();

  if (!key || !email) {
    alert('Veuillez entrer votre email et votre clé API ACLED.');
    return;
  }

  _acledKey   = key;
  _acledEmail = email;

  const btn = document.getElementById('save-config');
  btn.textContent = 'Connexion en cours…';
  btn.disabled    = true;

  const events = await fetchACLEDData(key, email);

  btn.textContent = 'Connecter et charger les données';
  btn.disabled    = false;

  if (events && events.length > 0) {
    loadEventsIntoUI(events);
    closeConfigModal();
  } else if (events !== null) {
    // 0 résultats mais pas d'erreur
    alert('Connexion réussie mais aucun évènement retourné pour la région/période.');
    closeConfigModal();
  }
  // Si null → erreur déjà affichée dans le status header
}

// Initialiser les écouteurs de la modale
function initACLED() {
  document.getElementById('open-config').addEventListener('click', openConfigModal);
  document.getElementById('close-config').addEventListener('click', closeConfigModal);
  document.getElementById('save-config').addEventListener('click', saveAndConnect);

  // Fermer en cliquant sur l'overlay
  document.getElementById('api-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeConfigModal();
  });
}
