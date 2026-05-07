// js/data.js — Données OSINT statiques (fallback si ACLED non configuré)
// Remplacées automatiquement par les données ACLED quand la clé est configurée

const STATIC_EVENTS = [
  // GAZA
  { id:1,  lat:31.50, lng:34.46, type:'strikes',  front:'gaza',  title:'Frappe IDF — Jabalia, Gaza Nord',          src:'IDF Spokesperson',  time:'8 min',   fatalities:4, tags:['strikes'] },
  { id:2,  lat:31.35, lng:34.30, type:'strikes',  front:'gaza',  title:'Frappe IDF — Khan Yunis',                  src:'Reuters',            time:'25 min',  fatalities:2, tags:['strikes'] },
  { id:3,  lat:31.29, lng:34.27, type:'ground',   front:'gaza',  title:'Combats urbains — Rafah',                  src:'GeoConfirmed',       time:'41 min',  fatalities:0, tags:['ground'] },
  { id:4,  lat:31.47, lng:34.43, type:'missiles', front:'gaza',  title:'Roquette PIJ interceptée par Iron Dome',   src:'IDF',                time:'52 min',  fatalities:0, tags:['missiles'] },
  { id:5,  lat:31.52, lng:34.45, type:'strikes',  front:'gaza',  title:'Frappe IDF — Beit Lahiya',                 src:'AP',                 time:'1h 20',   fatalities:1, tags:['strikes'] },
  { id:6,  lat:31.40, lng:34.35, type:'ground',   front:'gaza',  title:'Opération terrestre IDF — Gaza Centre',   src:'Haaretz',            time:'2h 05',   fatalities:0, tags:['ground'] },
  // LIBAN
  { id:7,  lat:33.27, lng:35.20, type:'strikes',  front:'liban', title:"Frappe IDF — Tyr, Liban Sud",              src:"L'Orient Today",     time:'1h 10',   fatalities:1, tags:['strikes'] },
  { id:8,  lat:33.35, lng:35.40, type:'missiles', front:'liban', title:'Roquette Hezbollah → Galilée occidentale', src:'IDF',                time:'1h 35',   fatalities:0, tags:['missiles'] },
  { id:9,  lat:33.88, lng:35.50, type:'strikes',  front:'liban', title:'Frappe IDF — banlieue sud Beyrouth',       src:'AP',                 time:'3h',      fatalities:3, tags:['strikes'] },
  { id:10, lat:33.55, lng:35.37, type:'missiles', front:'liban', title:'Frappe roquette — Kiryat Shmona',          src:'IDF Spokesperson',   time:'4h 15',   fatalities:0, tags:['missiles'] },
  // IRAN
  { id:11, lat:35.69, lng:51.39, type:'strikes',  front:'iran',  title:'Frappe US/IDF — Téhéran, site militaire',  src:'CENTCOM',            time:'7h',      fatalities:0, tags:['strikes'] },
  { id:12, lat:32.65, lng:51.68, type:'strikes',  front:'iran',  title:'Frappe US — Isfahan (site Fordow)',         src:'BBC',                time:'12h',     fatalities:0, tags:['strikes'] },
  { id:13, lat:35.69, lng:51.20, type:'missiles', front:'iran',  title:'Missile balistique IRGC → Israël',         src:'IranWarLive',        time:'8h',      fatalities:0, tags:['missiles'] },
  { id:14, lat:38.08, lng:46.29, type:'strikes',  front:'iran',  title:'Frappe IDF — Tabriz, dépôt IRGC',          src:'NYT',                time:'16h',     fatalities:0, tags:['strikes'] },
  { id:15, lat:29.61, lng:52.53, type:'strikes',  front:'iran',  title:'Frappe US — Shiraz, base aérienne',        src:'Reuters',            time:'20h',     fatalities:2, tags:['strikes'] },
  // YÉMEN
  { id:16, lat:14.79, lng:42.95, type:'missiles', front:'yemen', title:'Drone Houthi lancé depuis Hodeidah',       src:'OSINT / MarineTraffic', time:'5h',   fatalities:0, tags:['missiles'] },
  { id:17, lat:13.97, lng:44.20, type:'missiles', front:'yemen', title:'Missile Houthi → couloir maritime',        src:'US Navy / NAVCENT',  time:'9h',      fatalities:0, tags:['missiles'] },
  { id:18, lat:15.35, lng:42.60, type:'naval',    front:'yemen', title:'Navire commercial intercepté — Mer Rouge', src:"Lloyd's List",       time:'11h',     fatalities:0, tags:['naval'] },
  { id:19, lat:12.78, lng:45.03, type:'naval',    front:'yemen', title:'Alert navigation — Golfe Aden',            src:'UKMTO',              time:'14h',     fatalities:0, tags:['naval'] },
  // SYRIE
  { id:20, lat:33.51, lng:36.29, type:'strikes',  front:'syrie', title:'Frappe IDF — dépôt Damas pro-Iran',        src:'SOHR',               time:'20h',     fatalities:0, tags:['strikes'] },
  { id:21, lat:34.80, lng:36.71, type:'strikes',  front:'syrie', title:'Frappe IDF — Homs, couloir iranien',       src:'Reuters',            time:'22h',     fatalities:0, tags:['strikes'] },
  // IRAK
  { id:22, lat:33.34, lng:44.40, type:'ground',   front:'irak',  title:'Attaque roquette PMF — base Al-Assad',     src:'CENTCOM',            time:'hier',    fatalities:1, tags:['ground'] },
  { id:23, lat:36.34, lng:43.13, type:'ground',   front:'irak',  title:'Incident sécuritaire — Mossoul',           src:'Kurdistan 24',       time:'hier',    fatalities:0, tags:['ground'] },
  // DIPLO
  { id:24, lat:31.77, lng:35.21, type:'diplo',    front:'global',title:"Réunion d'urgence ONU — Conseil sécurité", src:'UN News',            time:'6h',      fatalities:0, tags:['diplo'] },
  { id:25, lat:25.20, lng:55.27, type:'diplo',    front:'global',title:'Négociations Qatar — médiateur Gaza',      src:'Al Jazeera',         time:'10h',     fatalities:0, tags:['diplo'] },
];

// Couleurs par type
const TYPE_COLORS = {
  strikes:  '#ef4444',
  ground:   '#f97316',
  missiles: '#a855f7',
  naval:    '#3b82f6',
  diplo:    '#22c55e',
};

// Labels français
const TYPE_LABELS = {
  strikes:  'FRAPPE',
  ground:   'TERRESTRE',
  missiles: 'MISSILE',
  naval:    'NAVAL',
  diplo:    'DIPLO',
};
