# DidYouDo - Guide de Développement pour Claude Code

## Vue d'ensemble du projet

**DidYouDo** est une application mobile iOS de gestion de tâches avec rappels intelligents et gamification. L'objectif est d'aider l'utilisateur à ne plus oublier ses tâches grâce à des rappels persistants, des animations motivantes et un bilan hebdomadaire par email.

**Utilisateur cible:** Christian (usage personnel, iPhone 13)
**Timeline:** 4 semaines (MVP)
**Statut actuel:** Phase 1 (Setup) complétée ✅

## Documentation principale

- **PRD complet:** `DidYouDo-PRD.md` (lire en priorité pour comprendre toutes les specs)
- **README:** `README.md` (instructions d'installation et structure)
- **Ce fichier:** Guide de développement pour Claude Code

## Architecture du projet

### Stack technique

```
Frontend:
├── React 18.3 + TypeScript
├── Vite 6.0 (build tool)
├── TailwindCSS 3.4 (styling)
├── React Router 6.x (navigation)
├── React Hook Form (formulaires)
├── Lucide React (icons)
└── date-fns (manipulation dates)

Mobile:
├── Capacitor 6.x (wrapper iOS)
├── @capacitor/local-notifications (rappels push)
├── @capacitor/preferences (stockage settings)
└── @capacitor/haptics (feedback tactile)

Backend/Services:
├── InstantDB (database real-time, offline-first)
├── Resend.com (envoi emails bilan hebdo)
└── Vercel (hosting + serverless functions + cron)
```

### Structure des dossiers

```
src/
├── components/          # Composants UI réutilisables
│   ├── Button.tsx      # Bouton avec variants (primary, secondary, danger, ghost)
│   ├── Card.tsx        # Conteneur avec shadow
│   ├── PriorityBadge.tsx  # Badge priorité (🔴🟡🟢)
│   ├── CategoryBadge.tsx  # Badge catégorie (🏠💼🛒👤💊🎮)
│   └── index.ts        # Barrel export
├── pages/              # Pages principales
│   ├── TaskListPage.tsx    # Liste des tâches (page d'accueil)
│   └── SettingsPage.tsx    # Paramètres utilisateur
├── hooks/              # Custom React hooks (vide pour l'instant)
├── utils/              # Fonctions utilitaires (vide pour l'instant)
├── types/              # Types TypeScript
│   ├── task.ts         # Type Task + CreateTaskInput
│   ├── settings.ts     # Type Settings + DEFAULT_SETTINGS
│   └── index.ts        # Barrel export
├── lib/                # Configuration des librairies externes
│   └── instantdb.ts    # Init InstantDB
├── App.tsx             # Composant racine + routing
├── main.tsx            # Point d'entrée React
└── index.css           # Styles globaux + Tailwind imports
```

## Design System

### Palette de couleurs (Tailwind config)

```javascript
// Principales (theme.extend.colors dans tailwind.config.js)
primary: '#FF6B35',          // Orange principal
'primary-light': '#FFB380',  // Orange clair
'primary-dark': '#E85A2B',   // Orange foncé
cream: '#FFFDF7',            // Fond crème
text: '#2D3142',             // Texte principal

// Priorités des tâches
priority: {
  high: '#EF4444',    // Rouge 🔴
  medium: '#FBBF24',  // Jaune 🟡
  low: '#10B981',     // Vert 🟢
}
```

### Composants UI disponibles

**Button:**
```tsx
<Button variant="primary|secondary|danger|ghost" size="sm|md|lg" fullWidth>
  Texte du bouton
</Button>
```

**Card:**
```tsx
<Card padding="none|sm|md|lg">Contenu</Card>
```

**PriorityBadge:**
```tsx
<PriorityBadge priority="high|medium|low" />
```

**CategoryBadge:**
```tsx
<CategoryBadge category="Maison|Travail|Courses|Personnel|Santé|Loisirs" />
```

## Types TypeScript importants

### Task (src/types/task.ts)

```typescript
interface Task {
  id: string;
  title: string;                      // Max 100 chars, obligatoire
  description?: string;               // Max 500 chars, optionnel
  dueDate?: Date;                     // Date d'échéance
  priority: 'high' | 'medium' | 'low';
  categories: Category[];             // Array de catégories
  reminderFrequency: 'daily' | 'weekly';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;                 // null si active
  isCompleted: boolean;
  isSnoozed: boolean;
  snoozeUntil?: Date;
  lastReminderSent?: Date;
  isArchived: boolean;                // true après bilan hebdo
}
```

### Settings (src/types/settings.ts)

```typescript
interface Settings {
  id: 'user-settings';                // Singleton
  email: string;
  reminderTime: string;               // "HH:MM" (défaut: "17:00")
  weeklyReportDay: number;            // 0-6 (dimanche-samedi, défaut: 0)
  weeklyReportTime: string;           // "HH:MM" (défaut: "09:00")
  notificationsEnabled: boolean;
  weeklyReportEnabled: boolean;
}
```

## Conventions de code

### Naming

- **Composants:** PascalCase (`TaskCard.tsx`, `PriorityBadge.tsx`)
- **Hooks:** camelCase avec préfixe `use` (`useTasks.ts`, `useNotifications.ts`)
- **Utils:** camelCase (`formatDate.ts`, `calculateStreak.ts`)
- **Types:** PascalCase pour interfaces, camelCase pour types (`Task`, `Priority`)

### Structure d'un composant

```tsx
import { ... } from 'react';
import { ... } from 'external-libs';
import { ... } from '../components'; // Imports locaux en dernier

interface ComponentProps {
  // Props typées
}

function Component({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  // 2. État local
  // 3. Fonctions handlers
  // 4. useEffect si besoin

  return (
    // JSX
  );
}

export default Component;
```

### Styling

- Utiliser **Tailwind** uniquement (pas de CSS modules)
- Classes utilitaires en priorité
- Pour les animations complexes, utiliser Tailwind animate

## Variables d'environnement

Fichier `.env` (NE PAS COMMIT) :

```env
VITE_INSTANTDB_APP_ID=       # À obtenir sur instantdb.com/dash
VITE_RESEND_API_KEY=         # À obtenir sur resend.com
VITE_EMAIL_FROM=             # Email expéditeur
VITE_USER_EMAIL=             # Email utilisateur (Christian)
```

Fichier `.env.example` (committed) contient les clés sans valeurs.

## Workflows de développement

### Commandes principales

```bash
npm run dev          # Dev server (http://localhost:3000)
npm run build        # Build production
npm run lint         # Linter ESLint
npm run preview      # Preview du build

# Capacitor iOS
npm run build && npx cap sync ios    # Sync avec iOS
npx cap open ios                     # Ouvre Xcode
```

### Git Workflow

- **Branche principale:** `main`
- **Branche de dev:** `claude/setup-didyoudo-project-01VFvdQH4b68H9ffT5BvoPST`
- Commits descriptifs avec détails des changements
- Push uniquement sur la branche de dev

## État actuel du projet

### ✅ Phase 1 complétée (Semaine 1)

- [x] Setup React + Vite + TypeScript
- [x] Configuration TailwindCSS avec palette orange
- [x] Installation Capacitor + plugins iOS
- [x] Configuration InstantDB (APP_ID configuré)
- [x] Structure de dossiers complète
- [x] Types TypeScript (Task, Settings)
- [x] Composants UI de base (Button, Card, PriorityBadge, CategoryBadge)
- [x] Pages de base (TaskListPage, SettingsPage)
- [x] Navigation React Router
- [x] Build iOS fonctionnel

### ✅ Phase 2 complétée (Semaine 2)

**Objectif atteint :** CRUD complet des tâches + animations gamifiées

**Hooks créés :**
- [x] `useTasks` - Hook complet InstantDB avec toutes les actions
  - Query: tasks, activeTasks, completedTasks
  - Mutations: create, update, complete, uncomplete, delete, postpone, snooze

**Utils créés :**
- [x] `dateHelpers.ts` - Formatage dates (formatTaskDate, getRelativeDate, etc.)
- [x] `taskHelpers.ts` - Logique métier (isTaskOverdue, sortByPriority, etc.)
- [x] `completionAnimation.ts` - Animation complétion (confettis + son + haptic)

**Composants créés :**
- [x] `TaskForm` - Formulaire complet avec validation
- [x] `TaskCard` - Affichage tâche dans liste
- [x] `CategorySelector` - Multi-select avec emojis
- [x] `PrioritySelector` - Sélecteur 3 priorités
- [x] `DatePicker` - Sélecteur de date iOS-friendly
- [x] `Modal` - Modal réutilisable avec animations

**Pages enrichies :**
- [x] `TaskListPage` - Liste complète avec sections actives/complétées
- [x] `TaskDetailPage` - Détails + actions (compléter, reporter, supprimer)

**Features fonctionnelles :**
- ✅ Créer une tâche avec tous les champs
- ✅ Voir la liste organisée (actives/complétées)
- ✅ Compléter une tâche avec animation (confettis + son + haptic)
- ✅ Reporter une tâche (+1j, +3j, +1sem, +2sem)
- ✅ Supprimer une tâche (avec confirmation)
- ✅ Rouvrir une tâche complétée
- ✅ Persistance temps réel avec InstantDB

### ✅ Phase 3 - Partie 1 complétée (Notifications)

**Objectif atteint :** Système de notifications push locales + Settings

**Hooks créés :**
- [x] `useNotifications` - Hook complet pour notifications locales
  - Permissions: requestPermission, checkPermission
  - Scheduling: scheduleTaskReminder, scheduleGroupedReminder, rescheduleAllReminders
  - Gestion: updateBadgeCount, cancelAllReminders, sendTestNotification
  - Configuration: getReminderTime, areNotificationsEnabled

**Features implémentées :**
- [x] Notifications quotidiennes pour tâches ≤7 jours
- [x] Notifications hebdomadaires pour tâches >7 jours
- [x] Notifications groupées (3-5 tâches + count)
- [x] Badge icon avec nombre de tâches en attente
- [x] Gestion complète des permissions iOS
- [x] Test de notification (envoi dans 5 secondes)
- [x] Page Settings complète et fonctionnelle
- [x] Persistance avec Capacitor Preferences
- [x] Auto-rescheduling au lancement de l'app
- [x] Respect des préférences utilisateur (on/off, horaire)

**Page Settings :**
- [x] Section Email avec validation
- [x] Section Notifications avec time picker (défaut 17h)
- [x] Section Bilan hebdo avec day/time picker
- [x] Toggles pour activer/désactiver
- [x] Boutons de test (notification + email)
- [x] Sauvegarde automatique avec feedback visuel
- [x] Warning si permissions non accordées

**Intégration App :**
- [x] Reschedule automatique au lancement (App.tsx)
- [x] Update quand le nombre de tâches change

### 🚧 Phase 3 - Partie 2 à venir (Email & Stats)

**Objectif :** Bilan hebdomadaire par email + Finitions

Tâches prioritaires :

1. **Bilan hebdomadaire par email**
   - [ ] Créer route API `/api/send-weekly-report` (Vercel serverless)
   - [ ] Template HTML email professionnel
   - [ ] Sections: Message félicitations (dynamique selon count) + Tâches complétées + Tâches restantes
   - [ ] Calcul stats mensuelles:
     - Tâches créées/réalisées/restantes
     - Taux complétion (%)
     - Délai moyen complétion (jours)
     - Streak (jours consécutifs ≥1 tâche)
     - Catégorie la plus productive
     - Tâches en retard vs à venir
   - [ ] Intégration Resend.com API
   - [ ] Fonction `archiveCompletedTasks()` post-envoi (déjà dans useTasks)
   - [ ] Configurer Vercel cron job (dimanches 9h)
   - [ ] Connecter le bouton "Test email" dans Settings
   - [ ] Tests envoi

2. **Finitions & Polish**
   - [ ] Vérifier toutes les animations 60fps
   - [ ] Loading states partout
   - [ ] Error states avec messages clairs
   - [ ] Empty states motivants
   - [ ] Respect safe areas iOS (notch + home indicator)
   - [ ] Tests sur iPhone 13 réel
   - [ ] Documentation utilisateur (README)

## Spécifications critiques (extraites du PRD)

### Logique de fréquence des rappels

```javascript
// Auto-détermination (modifiable par utilisateur)
if (dueDate && dueDate <= today + 7 days) {
  reminderFrequency = 'daily'
} else {
  reminderFrequency = 'weekly'
}
```

### Animation de complétion (CRITIQUE pour l'UX)

Séquence exacte :
1. Son joyeux ("success bell", ~500ms)
2. Animation confettis/étoiles (couleurs: orange, jaune, rose)
3. Haptic feedback iOS (3 micro-vibrations)
4. Transition: scale button → fade écran → retour liste
5. Tâche apparaît barrée/grisée avec animation

Librairie suggérée : `canvas-confetti` ou `react-confetti-explosion`

### Notifications push (Phase 3)

- Type : Notifications locales (pas de serveur)
- Heure défaut : 17h
- Contenu : Liste 3-5 premières tâches non complétées + count
- Badge icon = nombre tâches en attente

### Bilan hebdomadaire email (Phase 3)

- Jour/heure : Dimanche 9h (configurable)
- Service : Resend.com API
- Trigger : Vercel cron job
- Contenu : Message félicitations + tâches complétées + tâches restantes + stats mensuelles
- Post-envoi : Archivage tâches complétées

## Ressources utiles

### Documentation externe
- [React](https://react.dev)
- [Capacitor](https://capacitorjs.com/docs)
- [InstantDB](https://www.instantdb.com/docs)
- [Resend](https://resend.com/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [iOS HIG](https://developer.apple.com/design/human-interface-guidelines/)

### Capacitor Plugins
- [Local Notifications](https://capacitorjs.com/docs/apis/local-notifications)
- [Preferences](https://capacitorjs.com/docs/apis/preferences)
- [Haptics](https://capacitorjs.com/docs/apis/haptics)

## Points d'attention

### Sécurité
- ⚠️ Ne jamais commit le fichier `.env` (contient les clés API)
- ⚠️ Les clés API doivent rester côté serveur pour la prod
- ✅ `.env` est dans `.gitignore`

### Performance
- InstantDB est offline-first : penser à la sync
- Optimiser les re-renders (React.memo si besoin)
- Lazy loading des pages avec React Router

### iOS Spécifique
- Respect des safe areas (notch + home indicator)
- Touch targets minimum 44x44px (accessibilité)
- Tester sur iPhone réel (les simulateurs ne supportent pas tout)
- Free Provisioning : app à réinstaller tous les 7 jours

### Priorités strictes (selon PRD)

**P0 - Must-Have (Bloquant pour MVP):**
1. CRUD tâches
2. Notifications push
3. Bilan hebdo email
4. Animations complétion

**P1 - Should-Have (si temps):**
5. Stats avancées bilan
6. Système catégories
7. Système priorités
8. Reporter/Snoozer

**P2 - Nice-to-Have (post-MVP):**
- Recherche/filtres
- Graphiques progression
- Sous-tâches
- Dark mode
- Widgets iOS

## Messages types pour félicitations

```javascript
// Pour le bilan hebdomadaire
const getMessage = (count) => {
  if (count === 0) return "Pas de tâches cette semaine. Prêt à repartir ? 💭";
  if (count === 1) return "Bravo ! 1 tâche complétée. Chaque pas compte ! 🎊";
  if (count <= 3) return `Super ! ${count} tâches. Tu prends de l'élan ! 🎉`;
  if (count <= 7) return `Excellent ! ${count} tâches. Belle lancée ! 🌟`;
  if (count <= 15) return `Incroyable ! ${count} tâches. Machine à productivité ! 🚀`;
  return `WOW ! ${count} tâches. Tu es en feu ! 🏆`;
};
```

## Formules de calcul (pour Phase 4 - Bilan)

```javascript
// Taux de complétion
const completionRate = (completedTasks.length / totalTasks.length) * 100;

// Délai moyen de complétion (en jours)
const avgDelay = completedTasks.reduce((sum, t) =>
  sum + (t.completedAt - t.createdAt) / (1000*60*60*24), 0
) / completedTasks.length;

// Tâches complétées avant rappel
const beforeReminder = completedTasks.filter(t =>
  !t.lastReminderSent || t.completedAt < t.lastReminderSent
).length / completedTasks.length * 100;
```

## Exclusions MVP (ne PAS implémenter)

- ❌ Multi-utilisateurs / partage
- ❌ Pièces jointes / médias
- ❌ Sous-tâches / checklists
- ❌ Récurrence automatique
- ❌ Intégration calendrier
- ❌ Dark mode
- ❌ Widgets iOS
- ❌ Apple Watch
- ❌ Support VoiceOver (a11y complet)

## Commandes de débogage

```bash
# Voir les logs Capacitor
npx cap run ios --livereload

# Nettoyer les builds
rm -rf dist/ ios/App/App/public/

# Réinstaller Capacitor
npx cap sync ios

# Vérifier les types TypeScript
npm run build -- --mode development
```

## Philosophie MVP

> "Fait vaut mieux que parfait. Lance simple, utilise, apprends, itère."

Focus absolu sur les 4 must-have critiques (P0). Tout le reste est pour plus tard.

---

**Version:** 1.0
**Dernière mise à jour:** 18 novembre 2025
**Auteur:** Christian avec Claude Code
**Statut:** Phase 1 ✅ | Phase 2 ✅ | Phase 3.1 ✅ | Phase 3.2 🚧

---

## 📝 Note pour la prochaine session

**Ce qui a été accompli :**
- ✅ Phase 1 complète: Setup projet React + Vite + Capacitor
- ✅ Phase 2 complète: CRUD tâches + animations gamifiées
- ✅ **Phase 3.1 complète: Notifications push locales + Settings**
  - Hook useNotifications avec Capacitor Local Notifications
  - Notifications quotidiennes/hebdomadaires intelligentes
  - Page Settings complète avec persistance
  - Test de notifications fonctionnel
  - Gestion des permissions iOS
  - Auto-rescheduling au lancement

**Application actuellement utilisable pour :**
- ✅ Créer, voir, compléter, reporter et supprimer des tâches
- ✅ Animation motivante lors de la complétion
- ✅ Données persistées en temps réel
- ✅ **Notifications push quotidiennes/hebdomadaires**
- ✅ **Configuration complète dans Settings**
- ✅ **Test de notifications en un clic**

**Prochaine priorité - Phase 3.2 :**
1. **Bilan hebdomadaire par email (Priority 2)**
   - Créer API serverless Vercel `/api/send-weekly-report`
   - Template HTML email professionnel avec stats
   - Calcul statistiques: taux complétion, streak, délai moyen, etc.
   - Intégration Resend.com API (clé déjà configurée dans .env)
   - Vercel cron job pour envoi automatique dimanche 9h
   - Connecter le bouton "Test email" dans Settings

2. **Polish et finitions**
   - Loading/error/empty states
   - Safe areas iOS
   - Tests iPhone 13

**Commandes utiles pour démarrer :**
```bash
npm install              # Installer dépendances
npm run dev              # Lancer en dev (http://localhost:3000)
npm run build            # Build production
npx cap sync ios         # Sync avec iOS
npx cap open ios         # Ouvrir Xcode
```

**Fichiers clés à connaître :**
- `src/hooks/useTasks.ts` - Hook principal pour gérer les tâches
- `src/hooks/useNotifications.ts` - **NOUVEAU** Hook notifications push
- `src/pages/SettingsPage.tsx` - **NOUVEAU** Page Settings complète
- `src/utils/completionAnimation.ts` - Animation de complétion
- `src/pages/TaskListPage.tsx` - Page principale
- `src/pages/TaskDetailPage.tsx` - Détails + actions
- `src/App.tsx` - Integration notifications (reschedule au lancement)
- `.env` - Clés API configurées (InstantDB + Resend)

**Structure pour Phase 3.2 (à créer) :**
- `api/send-weekly-report.ts` - Vercel serverless function
- `vercel.json` - Configuration cron job
- Optionnel: `api/templates/weekly-email.html` - Template email
