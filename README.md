# DidYouDo

Application mobile iOS de gestion de tâches avec rappels intelligents et gamification.

## Vue d'ensemble

DidYouDo est une application mobile qui vous aide à ne plus oublier vos tâches grâce à :
- Rappels persistants (quotidiens/hebdomadaires)
- Animations gamifiées (confettis, sons, vibrations)
- Bilan hebdomadaire par email avec statistiques motivantes
- Interface ludique inspirée de Duolingo

## Stack Technique

### Frontend
- **Framework:** React 18.x + TypeScript
- **Build:** Vite 6.x
- **Styling:** TailwindCSS 3.x avec palette orange personnalisée
- **Routing:** React Router 6.x
- **Forms:** React Hook Form
- **Icons:** Lucide React
- **Dates:** date-fns

### Mobile
- **Wrapper:** Capacitor 6.x (iOS)
- **Plugins:**
  - `@capacitor/local-notifications` - Rappels push locaux
  - `@capacitor/preferences` - Stockage des paramètres
  - `@capacitor/haptics` - Feedback tactile

### Backend & Services
- **Database:** InstantDB (real-time, offline-first)
- **Email:** Resend.com (bilan hebdomadaire)
- **Hosting:** Vercel (serverless functions + cron)

## Installation

### Prérequis
- Node.js 22+ et npm 10+
- Xcode (pour build iOS, Mac uniquement)
- Compte InstantDB (https://instantdb.com/dash)
- Compte Resend.com (https://resend.com)

### Setup du projet

1. **Cloner le repository**
   ```bash
   git clone <repo-url>
   cd DidYouDo
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**

   Copier `.env.example` vers `.env` et remplir les valeurs :
   ```bash
   cp .env.example .env
   ```

   Éditer `.env` :
   ```env
   VITE_INSTANTDB_APP_ID=votre_app_id_instantdb
   VITE_RESEND_API_KEY=votre_api_key_resend
   VITE_EMAIL_FROM=noreply@votredomaine.com
   VITE_USER_EMAIL=votre@email.com
   ```

4. **Lancer en mode développement**
   ```bash
   npm run dev
   ```

   L'app web sera disponible sur http://localhost:3000

### Build iOS

1. **Build du projet web**
   ```bash
   npm run build
   ```

2. **Synchroniser avec Capacitor**
   ```bash
   npx cap sync ios
   ```

3. **Ouvrir dans Xcode** (Mac uniquement)
   ```bash
   npx cap open ios
   ```

4. **Build et installation**
   - Connecter votre iPhone
   - Sélectionner votre device dans Xcode
   - Appuyer sur "Run" (⌘+R)

Note: Avec Free Provisioning, l'app doit être réinstallée tous les 7 jours.

## Structure du projet

```
DidYouDo/
├── src/
│   ├── components/     # Composants UI réutilisables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── PriorityBadge.tsx
│   │   └── CategoryBadge.tsx
│   ├── pages/          # Pages de l'application
│   │   ├── TaskListPage.tsx
│   │   └── SettingsPage.tsx
│   ├── hooks/          # Hooks React personnalisés
│   ├── utils/          # Fonctions utilitaires
│   ├── types/          # Types TypeScript
│   │   ├── task.ts
│   │   ├── settings.ts
│   │   └── index.ts
│   ├── lib/            # Configuration librairies
│   │   └── instantdb.ts
│   ├── App.tsx         # Composant racine + routing
│   ├── main.tsx        # Point d'entrée
│   └── index.css       # Styles globaux
├── ios/                # Projet Xcode (généré)
├── dist/               # Build production (généré)
├── public/             # Assets statiques
├── DidYouDo-PRD.md     # Product Requirements Document
└── README.md           # Ce fichier
```

## Palette de couleurs

```css
Orange principal: #FF6B35
Orange clair:     #FFB380
Orange foncé:     #E85A2B
Fond crème:       #FFFDF7
Texte:            #2D3142

Priorités:
- Haute:   🔴 #EF4444 (Rouge)
- Moyenne: 🟡 #FBBF24 (Jaune)
- Basse:   🟢 #10B981 (Vert)
```

## Scripts disponibles

```bash
npm run dev      # Lancer le serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualiser le build
npm run lint     # Linter le code
```

## Roadmap Phase 1 (Semaine 1 - TERMINÉ ✅)

- [x] Setup React + Vite + TypeScript
- [x] Configuration TailwindCSS avec palette orange
- [x] Installation Capacitor + plugins iOS
- [x] Configuration InstantDB
- [x] Structure de dossiers et types
- [x] Composants UI de base (Button, Card, Badges)
- [x] Pages de base (TaskList, Settings)
- [x] Navigation React Router
- [x] Build iOS fonctionnel

## Roadmap Phase 2 (Semaine 2 - TERMINÉ ✅)

- [x] Intégration InstantDB (hooks et queries)
- [x] CRUD complet des tâches
- [x] Formulaire de création de tâche
- [x] Écran détails de tâche
- [x] Animation de complétion (son + confettis + haptic)
- [x] Système de catégories et priorités
- [x] Actions: compléter, reporter, supprimer
- [x] Persistance données avec InstantDB

## Phase 3 - TERMINÉ ✅

### Partie 1: Notifications Push Locales ✅
- [x] Hook useNotifications avec Capacitor Local Notifications
- [x] Logique scheduling quotidien/hebdomadaire
- [x] Notifications groupées (3-5 tâches + count)
- [x] Badge icon avec nombre de tâches
- [x] Gestion des permissions iOS
- [x] Fonction de test de notification
- [x] Page Settings complète avec configuration
- [x] Persistance des paramètres (Capacitor Preferences)
- [x] Intégration automatique au lancement de l'app

### Partie 2: Bilan Hebdomadaire par Email ✅
- [x] Fonction serverless Vercel pour envoi d'emails
- [x] Template HTML email professionnel avec branding
- [x] Calcul des statistiques complètes:
  - Taux de complétion (%)
  - Délai moyen de complétion (jours)
  - Streak (jours consécutifs avec tâches)
  - Catégorie la plus productive
  - Tâches en retard vs à venir
- [x] Message de félicitations dynamique (6 niveaux)
- [x] Intégration Resend.com API
- [x] Configuration cron job Vercel (dimanche 9h)
- [x] Bouton test email dans Settings
- [x] Archivage des tâches après envoi (prêt pour production)

### Prochaines étapes - Phase 4

- [ ] Polish & finitions UI/UX
- [ ] Loading/error/empty states
- [ ] Tests sur iPhone 13
- [ ] Déploiement Vercel production

## Documentation

- [PRD Complet](./DidYouDo-PRD.md)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [InstantDB Documentation](https://www.instantdb.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## Licence

Usage personnel uniquement - Christian

---

**Version:** 1.0.0 MVP
**Dernière mise à jour:** 18 novembre 2025
**Statut:** Phase 1 ✅ | Phase 2 ✅ | Phase 3 ✅ | Phase 4 🚧

## État actuel

**Application MVP complète !** Toutes les fonctionnalités P0 sont implémentées :
- ✅ Créer des tâches avec tous les champs
- ✅ Voir la liste organisée (actives/complétées)
- ✅ Compléter une tâche avec animation gamifiée
- ✅ Reporter, rouvrir ou supprimer des tâches
- ✅ Données persistées en temps réel (InstantDB)
- ✅ Notifications push locales quotidiennes/hebdomadaires
- ✅ Page Settings complète avec configuration
- ✅ Test de notifications avec gestion des permissions
- ✅ **NOUVEAU:** Bilan hebdomadaire par email avec statistiques complètes
- ✅ **NOUVEAU:** Fonction serverless Vercel avec cron automatique
- ✅ **NOUVEAU:** Template HTML email professionnel

**Prochaines étapes (Phase 4) :**
- 🚧 Polish & finitions UI/UX
- 🚧 Déploiement Vercel en production
- 🚧 Tests sur iPhone 13
