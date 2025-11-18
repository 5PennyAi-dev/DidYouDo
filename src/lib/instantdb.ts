import { init } from '@instantdb/react';

// IMPORTANT: L'APP_ID doit être configuré via une variable d'environnement
// Pour obtenir votre APP_ID, créez un compte sur https://instantdb.com/dash
const APP_ID = import.meta.env.VITE_INSTANTDB_APP_ID || 'YOUR_APP_ID_HERE';

// Initialisation d'InstantDB sans schéma TypeScript pour l'instant
// Le schéma sera défini via le dashboard InstantDB
const db = init({ appId: APP_ID });

export { db };
