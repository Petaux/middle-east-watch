# Middle East Watch — Guide de démarrage

Site de suivi OSINT des conflits au Moyen-Orient.
Carte Leaflet interactive + données ACLED + fallback statique.

---

## Structure du projet

```
middle-east-watch/
├── index.html          ← Page principale
├── css/
│   └── style.css       ← Tout le style
├── js/
│   ├── data.js         ← Données statiques OSINT (fallback)
│   ├── map.js          ← Logique carte Leaflet
│   ├── ui.js           ← Interactions sidebar, events, clock
│   ├── acled.js        ← Intégration API ACLED
│   └── main.js         ← Point d'entrée
└── README.md
```

---

## Étapes pour mettre le site en ligne

### Étape 1 — Installer VS Code
1. Télécharger sur https://code.visualstudio.com/
2. L'installer normalement

### Étape 2 — Créer un compte GitHub
1. Aller sur https://github.com/
2. Cliquer "Sign up" et créer un compte gratuit

### Étape 3 — Créer un repository GitHub
1. Une fois connecté, cliquer le "+" en haut à droite → "New repository"
2. Nom : `middle-east-watch`
3. Laisser "Public" coché
4. Cliquer "Create repository"

### Étape 4 — Uploader les fichiers
1. Sur la page du repository, cliquer "uploading an existing file"
2. Glisser-déposer TOUS les fichiers du projet
   (Attention : respecter la structure dossiers css/ et js/)
3. Cliquer "Commit changes"

### Étape 5 — Déployer sur Vercel (gratuit, en ligne en 2 min)
1. Aller sur https://vercel.com/
2. Cliquer "Sign Up" → choisir "Continue with GitHub"
3. Autoriser Vercel à accéder à vos repositories
4. Cliquer "Add New Project"
5. Choisir votre repository `middle-east-watch`
6. Cliquer "Deploy" (aucune config nécessaire)
7. En 1 minute, votre site est en ligne à une URL du type :
   https://middle-east-watch.vercel.app

---

## Configurer l'API ACLED

1. Créer un compte gratuit sur https://acleddata.com/register
   → Utiliser un email institutionnel pour un meilleur accès
2. Vérifier votre email et accepter les Terms of Use
3. Dans votre dashboard, cliquer "Add New Key"
   → IMPORTANT : copier la clé immédiatement, elle ne s'affiche qu'une fois
4. Sur le site, cliquer le bouton "⚙ Config API" en haut à droite
5. Entrer votre email + clé → "Connecter"
6. Les données réelles remplacent automatiquement les données statiques

---

## Sources de données

| Source | Type | Accès |
|--------|------|-------|
| ACLED | Évènements géolocalisés | Gratuit sur inscription |
| GeoConfirmed | Vérification OSINT | Gratuit |
| CartoDB Dark Matter | Fond de carte nuit | Gratuit |
| OpenTopoMap | Fond de carte topo | Gratuit |
| Esri World Imagery | Fond de carte satellite | Gratuit |

---

## Prochaines améliorations prévues
- [ ] Timeline animée (rejouer les évènements)
- [ ] Zones de contrôle (polygones sur la carte)
- [ ] Alertes son temps réel
- [ ] Onglet statistiques avec graphiques
- [ ] Mode mobile
