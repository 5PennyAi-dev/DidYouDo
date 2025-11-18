# Product Requirements Document - DidYouDo
## To-Do List avec Rappels Intelligents

**Version** 1.0 MVP | **Date** 17 novembre 2025 | **Auteur** Christian  
**Timeline** 4 semaines | **Statut** ✅ Prêt pour développement

---

## 🎯 Vision Produit

### Problème
"J'écris mes tâches à faire mais je les oublie ensuite - elles ne se réalisent jamais."

### Solution
Application mobile iOS avec **rappels persistants** + **gamification** + **bilan hebdomadaire motivant**

### Objectif Mesurable
Devenir plus productif, réaliser les tâches, développer l'autonomie (moins besoin de rappels au fil du temps)

---

## 👤 Utilisateur

- **Qui:** Christian (usage personnel uniquement)
- **Device:** iPhone 13
- **Volume:** 5-10 tâches actives, 100+ tâches/an
- **Préférences:** Interface ludique style Duolingo, couleur orange, gamification

---

## ⚡ Fonctionnalités MVP (Must-Have)

###  1. CRUD Tâches Complet ✅

**Formulaire de création (tous champs visibles):**
- Titre (obligatoire, max 100 car)
- Description (optionnel, max 500 car)
- Date d'échéance (optionnel)
- Priorité: Haute 🔴 / Moyenne 🟡 / Basse 🟢
- Catégories: Maison, Travail, Courses, Personnel, Santé, Loisirs
- Fréquence rappel: Quotidien / Hebdomadaire (auto selon échéance, modifiable)

**Actions disponibles:**
- ✏️ Modifier tous les champs
- 📅 Reporter l'échéance (+1j, +3j, +1sem, custom)
- 🔕 Snoozer les rappels (1j, 3j, 1sem, jusqu'à date)
- 🗑️ Supprimer (avec confirmation)
- ✅ **Compléter** → Son + Animation confettis + Haptic feedback

**Affichage:**
- Liste avec bouton orange "Ajouter une tâche"
- Tâches complétées restent visibles (barrées/grisées) jusqu'au bilan hebdo
- Tap sur tâche → Écran détails

---

### 2. Notifications Push 🔔

**Configuration:**
- Heure par défaut: 17h (configurable)
- Type: Notifications locales Capacitor (pas de serveur)
- Permission iOS requise au lancement

**Logique:**
- **Quotidien:** Notif tous les jours à 17h pour tâches avec échéance ≤ 7 jours
- **Hebdomadaire:** Notif tous les 7 jours (depuis création) pour tâches avec échéance > 7 jours
- **Contenu:** Liste des 3-5 premières tâches non complétées + count si plus

**Comportement:**
- Tap notif → Ouvre l'app sur liste
- Pas d'action forcée
- Badge icon = nombre tâches en attente

---

### 3. Bilan Hebdomadaire Email 📧

**Envoi:**
- Jour: Dimanche matin 9h (configurable)
- Service: Resend.com (API)
- Trigger: Vercel cron job

**Contenu email:**

1. **Message félicitations** (dynamique selon nb tâches complétées)
2. **Tâches complétées cette semaine** (liste avec dates)
3. **Tâches restantes** (toutes, avec priorités et échéances)
4. **Stats mensuelles:**
   - Tâches créées / réalisées / restantes
   - Taux de complétion (%)
   - Délai moyen de complétion (jours)
   - Streak (jours consécutifs avec ≥1 tâche)
   - Catégorie la plus productive
   - Tâches en retard vs à venir

**Post-envoi:**
- Tâches complétées archivées (disparaissent de la liste active)

---

### 4. Animations & Gamification ✨

**Moment de complétion (CRITIQUE):**

Séquence d'animation (~2s total):
1. Son joyeux ("success bell", ~500ms)
2. Animation confettis/étoiles (couleurs: orange, jaune, rose)
3. Haptic feedback iOS (3 micro-vibrations)
4. Transition: scale button → fade écran → retour liste
5. Tâche apparaît barrée/grisée avec animation

**Autres animations:**
- Ajout tâche: slide up (300ms)
- Sauvegarde: scale pulse bouton (200ms)
- Suppression: fade out + collapse (400ms)
- Erreur: shake horizontal (300ms)

---

## 🛠️ Stack Technique

### Frontend
- **Framework:** React 18.x + Vite
- **Styling:** TailwindCSS (palette orange)
- **Forms:** React Hook Form
- **Icons:** Lucide React
- **Dates:** date-fns
- **Routing:** React Router 6.x

### Mobile
- **Wrapper:** Capacitor 6.x (iOS uniquement)
- **Plugins:**
  - @capacitor/local-notifications (rappels)
  - @capacitor/preferences (settings)
  - @capacitor/haptics (feedback tactile)

### Backend / Services
- **Database:** InstantDB (real-time, offline-first, sync cloud)
- **Email:** Resend.com (plan gratuit 3000/mois)
- **Hosting:** Vercel (serverless functions + cron)
- **Coûts:** 0$/mois (tous plans gratuits)

### Développement
- **IDE:** VSCode + Claude Code
- **Build iOS:** Xcode (Free Provisioning - réinstall tous les 7j)
- **Version Control:** Git + GitHub

---

## 🎨 Design & UX

### Direction Artistique
- **Style:** Ludique et motivant (inspiration Duolingo)
- **Palette:**
  - 🧡 Orange principal: `#FF6B35`
  - 🌅 Orange clair: `#FFB380`
  - 🔥 Orange foncé: `#E85A2B`
  - ⚪ Fond: `#FFFDF7` (crème)
  - ⚫ Texte: `#2D3142`

### Workflows Clés

**Ajout tâche:**
```
Ouvrir app → Bouton orange "Ajouter" → Formulaire (1 écran)
→ Remplir champs → Sauvegarder → Son + animation → Tâche en haut de liste
```

**Complétion tâche:**
```
Liste → Tap tâche → Détails → Bouton "Compléter" (gros, orange)
→ Son + confettis + haptic → Retour liste (tâche barrée/grisée)
```

**Rappel quotidien:**
```
17h → Notification push → (optionnel) Tap notif → App s'ouvre sur liste
```

### Contraintes
- **Device:** iPhone 13 (portrait uniquement)
- **Safe areas:** Respect notch + home indicator iOS
- **Thème:** Clair uniquement (pas de dark mode MVP)
- **Accessibilité:** Contraste WCAG AA, touch targets 44x44px min

---

## 📊 Critères de Succès

### Après 4 semaines d'utilisation:

✅ **Productivité:**
- 70%+ des tâches créées sont complétées
- Délai moyen < 3 jours
- <20% tâches en retard

✅ **Autonomie:**
- 50%+ tâches complétées AVANT rappel
- Progression visible (semaine 1 vs semaine 4)

✅ **Engagement:**
- Utilisation 5+ jours/semaine
- 100% emails bilans ouverts
- Streak 7+ jours maintenu

---

## 📅 Timeline & Priorisation

### Durée Totale: 4 Semaines

**Semaine 1: Setup** (5-7 jours)
- Setup React + Capacitor + InstantDB
- Design system (TailwindCSS)
- Structure projet
- Premier build iOS fonctionnel

**Semaine 2: Features Core** (7-10 jours)
- CRUD tâches complet
- Formulaire création (tous champs)
- Écran détails + actions
- Animation complétion (son + confettis)

**Semaine 3: Notifs + Email** (7-10 jours)
- Système notifications push
- Logique scheduling
- API email (Resend)
- Template bilan HTML
- Cron hebdomadaire
- Page Settings

**Semaine 4: Polish** (5-7 jours)
- Bug fixing
- Optimisations performance
- Tests sur iPhone
- Ajustements UI/UX
- Documentation

### Priorisation

**P0 - Must-Have (Bloquant):**
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

---

## ⚠️ Risques & Mitigations

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Complexité Capacitor/Xcode | Moyen | Moyenne | Claude Code + doc complète |
| Notifications iOS | Élevé | Faible | Tests précoces, fallback email si besoin |
| InstantDB sync | Faible | Très faible | Offline-first garanti |
| Motivation/Abandon | Moyen | Moyenne | Priorisation claire, dev itératif |
| Scope creep | Moyen | Moyenne | PRD strict, focus P0 uniquement |

**Stratégie:** Développement incrémental, tests fréquents iPhone réel, assistance Claude Code max

---

## ✅ Checklist Développement

### Phase 1: Setup ⚙️
- [ ] Créer projet React + Vite
- [ ] Installer + configurer TailwindCSS
- [ ] Installer Capacitor + plugins
- [ ] Setup InstantDB
- [ ] Configurer Resend
- [ ] Premier build iOS fonctionnel

### Phase 2: CRUD 📝
- [ ] Intégration InstantDB (hooks)
- [ ] Écran liste tâches
- [ ] Formulaire création (tous champs)
- [ ] Validation + logique auto fréquence
- [ ] Écran détails tâche
- [ ] Actions: Modifier, Reporter, Snoozer, Supprimer
- [ ] **Animation complétion** (son + confettis + haptic)

### Phase 3: Notifications 🔔
- [ ] Setup Capacitor Local Notifications
- [ ] Fonction `scheduleTaskReminders(task)`
- [ ] Fonction `rescheduleAllReminders()` (au lancement app)
- [ ] Logique quotidien/hebdo
- [ ] Contenu notification (format liste)
- [ ] Tests sur iPhone

### Phase 4: Bilan Email 📧
- [ ] API route `/api/send-weekly-report` (Vercel)
- [ ] Template HTML email (sections + stats)
- [ ] Calcul toutes les stats (formules)
- [ ] Cron job Vercel (dimanches 9h)
- [ ] Archivage tâches post-envoi
- [ ] Tests envoi

### Phase 5: Settings ⚙️
- [ ] Page Settings
- [ ] Config email, heure rappels, jour/heure bilan
- [ ] Toggles activer/désactiver notifs + bilan
- [ ] Boutons test (notif + email)
- [ ] Sauvegarde Capacitor Preferences

### Phase 6: Polish ✨
- [ ] Vérifier animations 60fps
- [ ] Loading/empty/error states
- [ ] Safe areas iOS
- [ ] Tests scénarios complets
- [ ] Bug fixing
- [ ] Documentation (README)

### Phase 7: Déploiement 🚀
- [ ] Build final iOS
- [ ] Install sur iPhone 13
- [ ] Configuration initiale (email, heure)
- [ ] Première tâche réelle
- [ ] Début utilisation quotidienne

---

## 📐 Modèle de Données (InstantDB)

### Table: tasks

```typescript
interface Task {
  id: string;                    // UUID
  title: string;                 // Max 100 chars
  description?: string;          // Max 500 chars
  dueDate?: Date;                // Date d'échéance
  priority: 'high' | 'medium' | 'low';
  categories: string[];          // Array de catégories
  reminderFrequency: 'daily' | 'weekly';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;            // null si active
  isCompleted: boolean;
  isSnoozed: boolean;
  snoozeUntil?: Date;
  lastReminderSent?: Date;
  isArchived: boolean;           // true après bilan hebdo
}
```

### Table: settings

```typescript
interface Settings {
  id: 'user-settings';           // Singleton
  email: string;
  reminderTime: string;          // "HH:MM"
  weeklyReportDay: number;       // 0-6 (dimanche-samedi)
  weeklyReportTime: string;      // "HH:MM"
  notificationsEnabled: boolean;
  weeklyReportEnabled: boolean;
}
```

---

## 📚 Ressources

**Documentation:**
- [React](https://react.dev) | [Capacitor](https://capacitorjs.com/docs) | [InstantDB](https://www.instantdb.com/docs)
- [Resend](https://resend.com/docs) | [TailwindCSS](https://tailwindcss.com/docs)

**Capacitor Plugins:**
- [Local Notifications](https://capacitorjs.com/docs/apis/local-notifications)
- [Preferences](https://capacitorjs.com/docs/apis/preferences)
- [Haptics](https://capacitorjs.com/docs/apis/haptics)

**Design:**
- [iOS HIG](https://developer.apple.com/design/human-interface-guidelines/)
- [Lucide Icons](https://lucide.dev/)
- [Duolingo Design](https://design.duolingo.com/)

---

## 🚫 Exclusions MVP

**Hors scope V1:**
- ❌ Multi-utilisateurs / partage
- ❌ Pièces jointes / médias
- ❌ Sous-tâches / checklists
- ❌ Récurrence automatique
- ❌ Intégration calendrier
- ❌ Dark mode
- ❌ Widgets iOS
- ❌ Apple Watch
- ❌ Support VoiceOver

---

## 🎓 Formules Stats (Pour Bilan)

**Taux complétion:**
```javascript
(completedTasks.length / totalTasks.length) * 100
```

**Délai moyen:**
```javascript
completedTasks.reduce((sum, t) => 
  sum + (t.completedAt - t.createdAt) / (1000*60*60*24), 0
) / completedTasks.length
```

**Streak:**
```javascript
// Compter jours consécutifs avec ≥1 tâche complétée
// À partir d'aujourd'hui, remonter dans le temps
```

**Tâches avant rappel:**
```javascript
completedTasks.filter(t => 
  !t.lastReminderSent || t.completedAt < t.lastReminderSent
).length / completedTasks.length * 100
```

---

## 💡 Messages Félicitations

```javascript
const getMessage = (count) => {
  if (count === 0) return "Pas de tâches cette semaine. Prêt à repartir ? 💭";
  if (count === 1) return "Bravo ! 1 tâche complétée. Chaque pas compte ! 🎊";
  if (count <= 3) return `Super ! ${count} tâches. Tu prends de l'élan ! 🎉`;
  if (count <= 7) return `Excellent ! ${count} tâches. Belle lancée ! 🌟`;
  if (count <= 15) return `Incroyable ! ${count} tâches. Machine à productivité ! 🚀`;
  return `WOW ! ${count} tâches. Tu es en feu ! 🏆`;
};
```

---

## 🗺️ Roadmap Post-MVP

**V1.1 - UX:** Dark mode, recherche, swipe actions, widgets
**V1.2 - Features:** Sous-tâches, récurrence, pièces jointes, calendrier
**V1.3 - Social:** Auth Apple, partage, multi-devices
**V2.0 - AI:** Suggestions IA, catégorisation auto, rappels adaptatifs

---

## ✨ Conclusion

Ce PRD définit un **MVP réalisable en 4 semaines** avec une approche pragmatique:

🎯 **Focus absolu** sur 4 must-have critiques  
🎨 **Expérience ludique** type Duolingo pour motivation  
📱 **Stack moderne** React + Capacitor = dev rapide  
💰 **Coût 0$** (tous services gratuits)  
🚀 **Livraison itérative** (app utilisable dès semaine 2)

### Philosophie MVP
> "Fait vaut mieux que parfait. Lance simple, utilise, apprends, itère."

---

**Prochaine étape:** Commencer Phase 1 (Setup) avec Claude Code !

**Bonne chance ! 🎉 "Did you do it today?" - Oui, grâce à DidYouDo !**

---
*Document v1.0 | 17 novembre 2025 | ✅ Prêt pour développement*
