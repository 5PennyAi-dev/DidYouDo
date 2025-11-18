import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Function pour envoyer le bilan hebdomadaire
 *
 * Peut être appelé de deux façons:
 * 1. Via cron job (automatique le dimanche matin)
 * 2. Via test depuis Settings (avec ?test=true)
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Vérifier la méthode
    if (req.method !== 'POST' && req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Mode test ou prod
    const isTest = req.query.test === 'true';
    const email = req.query.email as string || process.env.VITE_USER_EMAIL;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // Vérifier les variables d'environnement
    const resendApiKey = process.env.VITE_RESEND_API_KEY;
    const instantDbAppId = process.env.VITE_INSTANTDB_APP_ID;
    const fromEmail = process.env.VITE_EMAIL_FROM || 'noreply@didyoudo.app';

    if (!resendApiKey || !instantDbAppId) {
      return res.status(500).json({ error: 'Missing API keys in environment' });
    }

    // Importer les dépendances (dynamique pour Vercel)
    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);

    // Fetch tasks from InstantDB
    // Note: Pour l'instant, on simule les données car InstantDB nécessite un setup admin
    // En production, il faudra utiliser InstantDB Admin SDK
    const tasks = await fetchTasksFromInstantDB(instantDbAppId);

    // Calculer les statistiques
    const stats = calculateStats(tasks);

    // Générer le contenu HTML de l'email
    const htmlContent = generateEmailHTML(stats, tasks, isTest);

    // Envoyer l'email
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: isTest
        ? '📧 Test - Bilan Hebdomadaire DidYouDo'
        : '📊 Votre Bilan Hebdomadaire DidYouDo',
      html: htmlContent,
    });

    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send email', details: error });
    }

    // Si ce n'est pas un test, archiver les tâches complétées
    if (!isTest) {
      await archiveCompletedTasks(instantDbAppId, tasks);
    }

    return res.status(200).json({
      success: true,
      message: isTest ? 'Test email sent successfully' : 'Weekly report sent successfully',
      emailId: data?.id,
      stats,
    });

  } catch (error: any) {
    console.error('Error in send-weekly-report:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

/**
 * Récupérer les tâches depuis InstantDB
 * TODO: Implémenter avec InstantDB Admin SDK
 */
async function fetchTasksFromInstantDB(appId: string): Promise<any[]> {
  // Pour l'instant, on retourne des données mockées
  // En production, utiliser InstantDB Admin SDK:
  // const { init } = await import('@instantdb/admin');
  // const db = init({ appId, adminToken: process.env.INSTANTDB_ADMIN_TOKEN });
  // const { tasks } = await db.query({ tasks: {} });
  // return tasks;

  const mockTasks = [
    {
      id: '1',
      title: 'Exemple de tâche complétée',
      description: 'Description de la tâche',
      priority: 'high',
      categories: ['Travail', 'Personnel'],
      isCompleted: true,
      completedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date().toISOString(),
      isArchived: false,
      isSnoozed: false,
      reminderFrequency: 'daily' as const,
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Tâche en cours',
      description: 'Une tâche restante',
      priority: 'medium',
      categories: ['Maison'],
      isCompleted: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      isArchived: false,
      isSnoozed: false,
      reminderFrequency: 'daily' as const,
      updatedAt: new Date().toISOString(),
    },
  ];

  return mockTasks;
}

/**
 * Calculer les statistiques hebdomadaires
 */
function calculateStats(tasks: any[]) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const completedThisWeek = tasks.filter(t => {
    if (!t.isCompleted || !t.completedAt) return false;
    const completedDate = new Date(t.completedAt);
    return completedDate >= oneWeekAgo;
  });

  const remainingTasks = tasks.filter(t => !t.isCompleted && !t.isArchived);
  const allCompleted = tasks.filter(t => t.isCompleted);

  const completionRate = tasks.length > 0
    ? Math.round((allCompleted.length / tasks.length) * 100)
    : 0;

  // Délai moyen
  let avgDelay = 0;
  if (allCompleted.length > 0) {
    const totalDelay = allCompleted.reduce((sum: number, t: any) => {
      const created = new Date(t.createdAt);
      const completed = new Date(t.completedAt);
      const days = Math.floor((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);
    avgDelay = Math.round((totalDelay / allCompleted.length) * 10) / 10;
  }

  // Catégorie top
  const categoryCount = new Map();
  completedThisWeek.forEach((t: any) => {
    t.categories.forEach((cat: string) => {
      categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1);
    });
  });

  let topCategory = null;
  let maxCount = 0;
  categoryCount.forEach((count, cat) => {
    if (count > maxCount) {
      maxCount = count;
      topCategory = cat;
    }
  });

  // Tâches en retard vs à venir
  let overdueCount = 0;
  let upcomingCount = 0;
  remainingTasks.forEach((t: any) => {
    if (!t.dueDate) {
      upcomingCount++;
    } else {
      const dueDate = new Date(t.dueDate);
      if (dueDate < now) overdueCount++;
      else upcomingCount++;
    }
  });

  return {
    completedCount: completedThisWeek.length,
    remainingCount: remainingTasks.length,
    completionRate,
    avgDelay,
    topCategory,
    overdueCount,
    upcomingCount,
    completedThisWeek,
    remainingTasks,
  };
}

/**
 * Générer le message de félicitations
 */
function getCongratulationsMessage(count: number): string {
  if (count === 0) return "Pas de tâches cette semaine. Prêt à repartir ? 💭";
  if (count === 1) return "Bravo ! 1 tâche complétée. Chaque pas compte ! 🎊";
  if (count <= 3) return `Super ! ${count} tâches. Tu prends de l'élan ! 🎉`;
  if (count <= 7) return `Excellent ! ${count} tâches. Belle lancée ! 🌟`;
  if (count <= 15) return `Incroyable ! ${count} tâches. Machine à productivité ! 🚀`;
  return `WOW ! ${count} tâches. Tu es en feu ! 🏆`;
}

/**
 * Générer le HTML de l'email
 */
function generateEmailHTML(stats: any, tasks: any[], isTest: boolean): string {
  const congratsMessage = getCongratulationsMessage(stats.completedCount);

  const priorityLabels: Record<string, string> = {
    high: '🔴 Haute',
    medium: '🟡 Moyenne',
    low: '🟢 Basse',
  };

  const completedTasksHTML = stats.completedThisWeek.length > 0
    ? stats.completedThisWeek.map((task: any) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #E5E7EB;">
            <strong>${task.title}</strong><br>
            <small style="color: #6B7280;">${priorityLabels[task.priority]} • ${task.categories.join(', ')}</small>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: right; color: #6B7280;">
            ${new Date(task.completedAt).toLocaleDateString('fr-FR')}
          </td>
        </tr>
      `).join('')
    : '<tr><td colspan="2" style="padding: 20px; text-align: center; color: #6B7280;">Aucune tâche complétée cette semaine</td></tr>';

  const remainingTasksHTML = stats.remainingTasks.length > 0
    ? stats.remainingTasks.slice(0, 10).map((task: any) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #E5E7EB;">
            <strong>${task.title}</strong><br>
            <small style="color: #6B7280;">${priorityLabels[task.priority]} • ${task.categories.join(', ')}</small>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: right; color: #6B7280;">
            ${task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR') : 'Pas de date'}
          </td>
        </tr>
      `).join('')
    : '<tr><td colspan="2" style="padding: 20px; text-align: center; color: #6B7280;">Aucune tâche restante ! 🎉</td></tr>';

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bilan Hebdomadaire DidYouDo</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FFFDF7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFDF7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF6B35 0%, #E85A2B 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 32px; font-weight: bold;">DidYouDo</h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                ${isTest ? '📧 Email de Test' : '📊 Votre Bilan Hebdomadaire'}
              </p>
            </td>
          </tr>

          <!-- Congratulations Message -->
          <tr>
            <td style="padding: 40px; text-align: center; background-color: #FFF7ED; border-bottom: 1px solid #FFEDD5;">
              <h2 style="margin: 0; color: #2D3142; font-size: 24px;">${congratsMessage}</h2>
            </td>
          </tr>

          <!-- Stats Grid -->
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding: 20px; text-align: center; background-color: #F9FAFB; border-radius: 8px;">
                    <div style="font-size: 36px; font-weight: bold; color: #FF6B35;">${stats.completedCount}</div>
                    <div style="color: #6B7280; margin-top: 5px;">Tâches complétées</div>
                  </td>
                  <td width="10"></td>
                  <td width="50%" style="padding: 20px; text-align: center; background-color: #F9FAFB; border-radius: 8px;">
                    <div style="font-size: 36px; font-weight: bold; color: #FF6B35;">${stats.remainingCount}</div>
                    <div style="color: #6B7280; margin-top: 5px;">Tâches restantes</div>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 15px;">
                <tr>
                  <td width="33%" style="padding: 15px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #2D3142;">${stats.completionRate}%</div>
                    <div style="color: #6B7280; font-size: 12px; margin-top: 3px;">Taux complétion</div>
                  </td>
                  <td width="33%" style="padding: 15px; text-align: center; border-left: 1px solid #E5E7EB; border-right: 1px solid #E5E7EB;">
                    <div style="font-size: 24px; font-weight: bold; color: #2D3142;">${stats.avgDelay}j</div>
                    <div style="color: #6B7280; font-size: 12px; margin-top: 3px;">Délai moyen</div>
                  </td>
                  <td width="33%" style="padding: 15px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #2D3142;">${stats.topCategory || 'N/A'}</div>
                    <div style="color: #6B7280; font-size: 12px; margin-top: 3px;">Top catégorie</div>
                  </td>
                </tr>
              </table>

              ${stats.overdueCount > 0 ? `
              <div style="margin-top: 15px; padding: 12px; background-color: #FEF2F2; border-left: 4px solid #EF4444; border-radius: 4px;">
                <span style="color: #991B1B; font-weight: 600;">⚠️ ${stats.overdueCount} tâche${stats.overdueCount > 1 ? 's' : ''} en retard</span>
              </div>
              ` : ''}
            </td>
          </tr>

          <!-- Completed Tasks Section -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h3 style="color: #2D3142; margin: 0 0 15px;">✅ Tâches complétées cette semaine</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
                ${completedTasksHTML}
              </table>
            </td>
          </tr>

          <!-- Remaining Tasks Section -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h3 style="color: #2D3142; margin: 0 0 15px;">📋 Tâches restantes</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
                ${remainingTasksHTML}
              </table>
              ${stats.remainingTasks.length > 10 ? `
              <p style="text-align: center; color: #6B7280; margin-top: 10px;">
                ... et ${stats.remainingTasks.length - 10} autre${stats.remainingTasks.length - 10 > 1 ? 's' : ''} tâche${stats.remainingTasks.length - 10 > 1 ? 's' : ''}
              </p>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #F9FAFB; border-radius: 0 0 12px 12px;">
              <p style="margin: 0; color: #6B7280; font-size: 14px;">
                Continuez comme ça ! 💪<br>
                <strong style="color: #FF6B35;">DidYouDo</strong> - Ne plus jamais oublier vos tâches
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Archiver les tâches complétées
 * TODO: Implémenter avec InstantDB Admin SDK
 */
async function archiveCompletedTasks(appId: string, tasks: any[]): Promise<void> {
  // En production:
  // const completedTasks = tasks.filter(t => t.isCompleted);
  // await db.transact(completedTasks.map(t => db.tx.tasks[t.id].update({ isArchived: true })));

  console.log('Archiving completed tasks (mock)');
}
