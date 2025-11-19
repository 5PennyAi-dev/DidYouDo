# 🧪 Guide de Test Local - DidYouDo

Ce guide vous explique comment tester l'application DidYouDo sur votre ordinateur local.

## ✅ Prérequis

- Node.js 18+ installé
- npm ou yarn
- Git
- VSCode (ou tout autre éditeur)

## 🚀 Installation Rapide

### 1. Installer les dépendances

Ouvrez un terminal dans VSCode et exécutez:

```bash
npm install
```

### 2. Configuration des variables d'environnement

Le fichier `.env` a déjà été créé avec les valeurs de configuration. Il contient:

- `VITE_INSTANTDB_APP_ID`: ID de votre base de données InstantDB
- `VITE_RESEND_API_KEY`: Clé API Resend pour l'envoi d'emails
- `VITE_EMAIL_FROM`: Adresse email d'envoi
- `VITE_USER_EMAIL`: Votre adresse email pour recevoir les bilans

### 3. Démarrer l'application

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

Vous devriez voir dans le terminal:
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

## 🎯 Fonctionnalités Testables Localement

### ✅ Fonctionnalités qui FONCTIONNENT localement:

1. **Interface utilisateur complète**
   - Liste des tâches
   - Création de nouvelles tâches
   - Modification de tâches existantes
   - Suppression de tâches

2. **Gestion des tâches**
   - Compléter une tâche avec animation (confettis)
   - Reporter une tâche (snooze)
   - Rouvrir une tâche complétée
   - Filtrage par catégorie et priorité

3. **Base de données en temps réel**
   - Les données sont sauvegardées dans InstantDB (cloud)
   - Synchronisation automatique
   - Persistance des données

4. **Page des paramètres**
   - Configuration de l'email
   - Paramètres de notifications
   - Interface complète

### ⚠️ Limitations en Local:

1. **Notifications push iOS**
   - Les notifications ne fonctionneront PAS dans le navigateur
   - Nécessite l'app iOS compilée avec Xcode
   - Test possible uniquement sur iPhone/iPad

2. **Fonction serverless d'envoi d'emails**
   - La fonction `api/send-weekly-report.ts` est une fonction Vercel
   - Ne s'exécute PAS automatiquement en local
   - Le bouton "Tester l'email" dans Settings ne fonctionnera pas sans déploiement

3. **Cron job automatique**
   - L'envoi automatique du dimanche matin ne fonctionne pas en local
   - Nécessite un déploiement sur Vercel

## 🧪 Tester les Fonctionnalités

### Test 1: Créer une tâche

1. Ouvrez http://localhost:3000
2. Cliquez sur le bouton "➕ Nouvelle tâche"
3. Remplissez le formulaire:
   - Titre: "Acheter du lait"
   - Description: "2 bouteilles de lait écrémé"
   - Priorité: Haute
   - Catégorie: Courses
   - Fréquence: Quotidien
4. Cliquez sur "Créer la tâche"
5. La tâche doit apparaître dans la liste

### Test 2: Compléter une tâche

1. Cliquez sur la checkbox à gauche d'une tâche
2. Vous devriez voir une animation de confettis
3. La tâche se déplace dans la section "Tâches complétées"

### Test 3: Reporter une tâche

1. Cliquez sur le bouton "Zzz" sur une tâche active
2. La tâche est mise en pause pour 24h
3. Elle reste dans la liste mais est marquée comme "snoozed"

### Test 4: Naviguer dans l'app

1. Testez le menu de navigation en bas
2. Accédez à la page des paramètres (⚙️)
3. Retournez à la liste des tâches (📋)

### Test 5: Persistance des données

1. Créez quelques tâches
2. Fermez le navigateur complètement
3. Rouvrez http://localhost:3000
4. Vos tâches doivent toujours être là (grâce à InstantDB)

## 🔧 Tester la Fonction Email (Optionnel)

Si vous voulez tester l'envoi d'emails en local, vous avez deux options:

### Option A: Utiliser Vercel CLI (Recommandé)

Vercel CLI est déjà installé dans le projet comme dépendance de développement.

```bash
# Lancer l'émulation locale des fonctions serverless
npm run dev:vercel
```

**Note**: La première fois, Vercel CLI vous demandera de vous connecter et de lier le projet. Suivez les instructions à l'écran.

L'app sera disponible sur `http://localhost:3000` et les fonctions API seront émulées.

Vous pourrez alors tester l'envoi d'email en cliquant sur "📧 Envoyer email de test" dans les paramètres.

📚 **Pour plus de détails**, consultez [EMAIL_TESTING.md](./EMAIL_TESTING.md)

### Option B: Déployer sur Vercel

Pour un test complet avec le cron job automatique, vous devrez déployer sur Vercel (comme prévu initialement).

## 📱 Tester sur iOS (Optionnel)

Si vous avez un Mac et souhaitez tester les notifications push:

### 1. Build du projet

```bash
npm run build
```

### 2. Synchroniser avec Capacitor

```bash
npx cap sync ios
```

### 3. Ouvrir dans Xcode

```bash
npx cap open ios
```

### 4. Lancer sur votre iPhone

- Connectez votre iPhone au Mac
- Dans Xcode, sélectionnez votre iPhone comme destination
- Cliquez sur le bouton "Play" (▶️)
- L'app s'installera sur votre iPhone

## 🐛 Résolution de Problèmes

### Erreur "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 déjà utilisé

Modifiez le port dans `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001  // Changez ici
  }
})
```

### Erreur InstantDB

Vérifiez que `VITE_INSTANTDB_APP_ID` est bien défini dans `.env`

### Page blanche

1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs
3. Essayez de vider le cache (Ctrl+Shift+R)

## 📊 Vérifier que tout fonctionne

Checklist rapide:

- [ ] `npm install` s'est exécuté sans erreur
- [ ] `npm run dev` démarre le serveur
- [ ] L'app s'ouvre sur http://localhost:3000
- [ ] Je peux créer une nouvelle tâche
- [ ] Je peux compléter une tâche (avec confettis!)
- [ ] Je peux voir mes tâches dans la liste
- [ ] Je peux accéder à la page des paramètres
- [ ] Les données persistent après rechargement

## 🎉 Prochaines Étapes

Une fois que tout fonctionne en local:

1. **Test approfondi**: Testez toutes les fonctionnalités
2. **Déploiement Vercel**: Pour les emails et notifications automatiques
3. **Build iOS**: Pour tester sur iPhone avec notifications push
4. **Personnalisation**: Ajustez les couleurs, textes, etc.

## 📚 Ressources Utiles

- [Documentation Vite](https://vitejs.dev)
- [Documentation React](https://react.dev)
- [Documentation InstantDB](https://instantdb.com/docs)
- [Documentation Capacitor](https://capacitorjs.com/docs)
- [Documentation Vercel CLI](https://vercel.com/docs/cli)

---

**Bon test! 🚀**

Si vous rencontrez des problèmes, vérifiez d'abord la console du navigateur pour les erreurs.
