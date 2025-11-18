# API Serverless - DidYouDo

Ce dossier contient les fonctions serverless Vercel pour DidYouDo.

## 📧 send-weekly-report.ts

Fonction serverless pour envoyer le bilan hebdomadaire par email.

### Fonctionnalités

- ✅ Fetch des tâches depuis InstantDB
- ✅ Calcul des statistiques (taux de complétion, délai moyen, streak, etc.)
- ✅ Génération d'email HTML professionnel
- ✅ Envoi via Resend.com API
- ✅ Archivage des tâches complétées (en production)
- ✅ Mode test via query parameter

### Utilisation

**Mode test** (depuis Settings page):
```
POST /api/send-weekly-report?test=true&email=user@example.com
```

**Mode production** (via cron):
```
POST /api/send-weekly-report
```

### Variables d'environnement requises

Les variables suivantes doivent être configurées dans Vercel:

```bash
VITE_INSTANTDB_APP_ID=your_instantdb_app_id
VITE_RESEND_API_KEY=your_resend_api_key
VITE_EMAIL_FROM=noreply@votredomaine.com
VITE_USER_EMAIL=votre@email.com
```

## 🚀 Déploiement sur Vercel

### 1. Installer Vercel CLI

```bash
npm install -g vercel
```

### 2. Se connecter à Vercel

```bash
vercel login
```

### 3. Déployer le projet

```bash
vercel
```

### 4. Configurer les variables d'environnement

Dans le dashboard Vercel:
1. Aller dans **Settings** > **Environment Variables**
2. Ajouter les 4 variables listées ci-dessus
3. Redéployer si nécessaire

### 5. Configurer le cron job

Le cron job est déjà configuré dans `vercel.json`:
- **Schedule:** Dimanche à 9h00 (cron: `0 9 * * 0`)
- **Path:** `/api/send-weekly-report`

Vérifier dans le dashboard Vercel > **Cron Jobs** que le job est actif.

## 🧪 Tests

### Test local (sans Vercel)

```bash
# Démarrer le serveur de dev
vercel dev

# Tester l'endpoint
curl -X POST "http://localhost:3000/api/send-weekly-report?test=true&email=test@example.com"
```

### Test en production

Depuis la page Settings de l'app:
1. Entrer votre email
2. Cliquer sur "Envoyer email de test"
3. Vérifier votre boîte de réception

## 📊 Contenu de l'email

L'email contient:

1. **Message de félicitations** (dynamique selon le nombre de tâches)
2. **Statistiques de la semaine:**
   - Tâches complétées
   - Tâches restantes
   - Taux de complétion
   - Délai moyen de complétion
   - Catégorie la plus productive
   - Alerte si tâches en retard

3. **Liste des tâches complétées** cette semaine
4. **Liste des tâches restantes** (top 10)

## 🔧 Configuration Resend.com

1. Créer un compte sur [resend.com](https://resend.com)
2. Obtenir votre API key
3. (Optionnel) Configurer un domaine custom pour l'email `from`
4. Ajouter l'API key dans les variables d'environnement Vercel

## 📝 Notes

- **InstantDB Admin SDK:** Pour l'instant, la fonction utilise des données mockées. Pour la production, décommenter le code InstantDB Admin dans `send-weekly-report.ts`
- **Rate limits:** Resend gratuit = 3000 emails/mois (largement suffisant pour usage personnel)
- **Timezone:** Le cron utilise UTC. Pour 9h Paris (UTC+1), utiliser `0 8 * * 0`

## 🐛 Debugging

Logs disponibles dans:
- Vercel Dashboard > Deployments > Function Logs
- Console du navigateur (erreurs côté client)

Pour activer les logs détaillés:
```typescript
console.log('Debug:', { tasks, stats, email });
```
