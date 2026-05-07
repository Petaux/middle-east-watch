// js/main.js — Point d'entrée, initialisation globale

document.addEventListener('DOMContentLoaded', () => {

  // 1. Démarrer la carte Leaflet
  initMap();

  // 2. Démarrer l'horloge UTC
  startClock();

  // 3. Attacher tous les écouteurs UI
  initUI();

  // 4. Initialiser la modale ACLED
  initACLED();

  // 5. Charger les données statiques par défaut
  loadEventsIntoUI(STATIC_EVENTS);

  // 6. Auto-refresh toutes les 5 minutes (si ACLED configuré)
  setInterval(() => {
    if (_acledKey && _acledEmail) {
      fetchACLEDData(_acledKey, _acledEmail).then(events => {
        if (events && events.length > 0) loadEventsIntoUI(events);
      });
    }
  }, 5 * 60 * 1000);

});
