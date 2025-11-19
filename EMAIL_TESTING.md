# 📧 Guide de Test des Emails - DidYouDo

Ce guide explique comment tester la fonctionnalité d'envoi d'emails en local.

## ⚠️ Important

La fonction d'envoi d'emails (`/api/send-weekly-report`) est une **fonction serverless Vercel** qui ne fonctionne PAS avec `npm run dev` (Vite seul).

## 🚀 Solution : Utiliser Vercel Dev

Pour tester les emails localement, vous devez utiliser **Vercel CLI** qui émule l'environnement Vercel.

### 1. Installer les dépendances (si ce n'est pas déjà fait)

```bash
npm install
```

### 2. Démarrer avec Vercel Dev

```bash
npm run dev:vercel
```

**Note :** La première fois que vous exécutez cette commande, Vercel CLI vous demandera:
- De vous connecter à votre compte Vercel (ou de créer un compte gratuit)
- De lier le projet à un projet Vercel

Suivez les instructions à l'écran. Vous pouvez créer un compte gratuit sur https://vercel.com

### 3. Accéder à l'application

Une fois démarré, l'application sera disponible sur **http://localhost:3000**

### 4. Tester l'envoi d'email

1. Ouvrez http://localhost:3000
2. Allez dans **Paramètres** (icône ⚙️)
3. Entrez votre adresse email dans le champ "Email"
4. Cliquez sur **"📧 Envoyer email de test"**
5. Vérifiez votre boîte de réception (et vos spams!)

## 🔧 Configuration Requise

Pour que l'envoi d'emails fonctionne, assurez-vous que:

1. **Le fichier `.env` existe** avec les variables suivantes:
   ```
   VITE_RESEND_API_KEY=votre_clé_api_resend
   VITE_EMAIL_FROM=votre@email.com
   VITE_USER_EMAIL=destinataire@email.com
   VITE_INSTANTDB_APP_ID=votre_app_id
   ```

2. **Clé API Resend valide**: Obtenez-en une sur https://resend.com/api-keys
   - Créez un compte gratuit (3000 emails/mois)
   - Créez une clé API
   - Copiez-la dans `.env` pour `VITE_RESEND_API_KEY`

3. **Email d'envoi vérifié**: Sur Resend, vous devez vérifier le domaine ou utiliser l'email de test fourni

## 🐛 Dépannage

### Erreur "Unexpected end of JSON input"

➡️ Cela signifie que vous utilisez `npm run dev` au lieu de `npm run dev:vercel`

**Solution**: Arrêtez le serveur et lancez `npm run dev:vercel`

### Erreur "Failed to send email"

Vérifiez:
- ✅ Que votre clé API Resend est valide
- ✅ Que l'email d'envoi est vérifié sur Resend
- ✅ Que les variables d'environnement sont correctement définies dans `.env`

### Erreur "Missing API keys in environment"

➡️ Les variables d'environnement ne sont pas chargées

**Solution**:
1. Vérifiez que le fichier `.env` existe à la racine du projet
2. Vérifiez que toutes les variables sont définies
3. Redémarrez `npm run dev:vercel`

### L'email n'arrive pas

- ✅ Vérifiez vos spams
- ✅ Attendez 1-2 minutes
- ✅ Vérifiez les logs dans le terminal
- ✅ Vérifiez les logs sur https://resend.com/emails

## 📊 Comparaison des modes

| Fonctionnalité | `npm run dev` (Vite) | `npm run dev:vercel` (Vercel CLI) |
|----------------|---------------------|-----------------------------------|
| Interface UI | ✅ Fonctionne | ✅ Fonctionne |
| Gestion des tâches | ✅ Fonctionne | ✅ Fonctionne |
| Base de données | ✅ Fonctionne | ✅ Fonctionne |
| **Envoi d'emails** | ❌ Ne fonctionne pas | ✅ **Fonctionne** |
| Cron jobs | ❌ Ne fonctionne pas | ⚠️ Simulation possible |
| Rechargement rapide | ✅ Très rapide | ⚠️ Plus lent |

## 💡 Recommandation

**Pour le développement général**: Utilisez `npm run dev` (plus rapide)

**Pour tester les emails**: Utilisez `npm run dev:vercel`

## 🎉 Test Complet en Production

Pour un test complet avec les cron jobs automatiques, déployez sur Vercel:

```bash
# Installer Vercel CLI globalement (optionnel)
npm install -g vercel

# Déployer
vercel
```

Suivez les instructions pour déployer votre application sur Vercel. Une fois déployée:
- Les emails de test fonctionneront
- Le cron job s'exécutera automatiquement tous les dimanches à 9h
- Vous pourrez voir les logs dans le dashboard Vercel

---

**Questions?** Consultez la [documentation Vercel](https://vercel.com/docs) ou la [documentation Resend](https://resend.com/docs).
