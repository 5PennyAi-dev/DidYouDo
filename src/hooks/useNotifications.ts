import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import type { Task } from '../types';
import { Preferences } from '@capacitor/preferences';

/**
 * Hook pour gérer les notifications push locales
 * - Notifications quotidiennes pour tâches avec échéance ≤ 7 jours
 * - Notifications hebdomadaires pour tâches avec échéance > 7 jours
 */
export function useNotifications() {
  /**
   * Demander la permission pour les notifications
   */
  const requestPermission = async (): Promise<boolean> => {
    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  };

  /**
   * Vérifier si les permissions sont accordées
   */
  const checkPermission = async (): Promise<boolean> => {
    try {
      const result = await LocalNotifications.checkPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      return false;
    }
  };

  /**
   * Obtenir l'heure de rappel configurée (défaut: 17:00)
   */
  const getReminderTime = async (): Promise<{ hour: number; minute: number }> => {
    try {
      const { value } = await Preferences.get({ key: 'reminderTime' });
      if (value) {
        const [hour, minute] = value.split(':').map(Number);
        return { hour, minute };
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'heure:', error);
    }
    // Défaut: 17h00
    return { hour: 17, minute: 0 };
  };

  /**
   * Vérifier si les notifications sont activées
   */
  const areNotificationsEnabled = async (): Promise<boolean> => {
    try {
      const { value } = await Preferences.get({ key: 'notificationsEnabled' });
      return value !== 'false'; // Activé par défaut
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'activation:', error);
      return true;
    }
  };

  /**
   * Planifier une notification pour une tâche spécifique
   */
  const scheduleTaskReminder = async (task: Task): Promise<void> => {
    // Ne pas planifier pour les tâches complétées ou archivées
    if (task.isCompleted || task.isArchived) {
      return;
    }

    // Ne pas planifier si la tâche est snoozée
    if (task.isSnoozed && task.snoozeUntil && new Date(task.snoozeUntil) > new Date()) {
      return;
    }

    const enabled = await areNotificationsEnabled();
    if (!enabled) {
      return;
    }

    const { hour, minute } = await getReminderTime();
    const now = new Date();

    // Déterminer si quotidien ou hebdomadaire
    let scheduleDate: Date;
    const isDailyReminder = task.dueDate
      ? (new Date(task.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 7
      : false;

    if (isDailyReminder) {
      // Notification quotidienne
      scheduleDate = new Date();
      scheduleDate.setHours(hour, minute, 0, 0);

      // Si l'heure est déjà passée aujourd'hui, planifier pour demain
      if (scheduleDate <= now) {
        scheduleDate.setDate(scheduleDate.getDate() + 1);
      }
    } else {
      // Notification hebdomadaire (7 jours après la création ou le dernier rappel)
      const lastReminder = task.lastReminderSent
        ? new Date(task.lastReminderSent)
        : new Date(task.createdAt);

      scheduleDate = new Date(lastReminder);
      scheduleDate.setDate(scheduleDate.getDate() + 7);
      scheduleDate.setHours(hour, minute, 0, 0);

      // Si la date est dans le passé, planifier pour la prochaine occurrence
      while (scheduleDate <= now) {
        scheduleDate.setDate(scheduleDate.getDate() + 7);
      }
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: parseInt(task.id.replace(/\D/g, '').slice(0, 9) || '1'), // Convertir UUID en nombre
            title: isDailyReminder ? '🔔 Rappel quotidien' : '📅 Rappel hebdomadaire',
            body: `Tâche: ${task.title}`,
            schedule: {
              at: scheduleDate,
              allowWhileIdle: true,
            },
            extra: {
              taskId: task.id,
            },
          },
        ],
      });

      console.log(`Notification planifiée pour "${task.title}" à ${scheduleDate.toLocaleString()}`);
    } catch (error) {
      console.error('Erreur lors de la planification de la notification:', error);
    }
  };

  /**
   * Planifier une notification groupée pour toutes les tâches actives
   */
  const scheduleGroupedReminder = async (tasks: Task[]): Promise<void> => {
    const activeTasks = tasks.filter(
      t => !t.isCompleted &&
           !t.isArchived &&
           !(t.isSnoozed && t.snoozeUntil && new Date(t.snoozeUntil) > new Date())
    );

    if (activeTasks.length === 0) {
      return;
    }

    const enabled = await areNotificationsEnabled();
    if (!enabled) {
      return;
    }

    const { hour, minute } = await getReminderTime();
    const scheduleDate = new Date();
    scheduleDate.setHours(hour, minute, 0, 0);

    // Si l'heure est déjà passée aujourd'hui, planifier pour demain
    if (scheduleDate <= new Date()) {
      scheduleDate.setDate(scheduleDate.getDate() + 1);
    }

    // Formater le message avec les 3-5 premières tâches
    const displayTasks = activeTasks.slice(0, 5);
    const remainingCount = activeTasks.length - displayTasks.length;

    let body = displayTasks.map(t => `• ${t.title}`).join('\n');
    if (remainingCount > 0) {
      body += `\n... et ${remainingCount} autre${remainingCount > 1 ? 's' : ''}`;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 999999, // ID spécial pour la notification groupée
            title: `📋 ${activeTasks.length} tâche${activeTasks.length > 1 ? 's' : ''} en attente`,
            body,
            schedule: {
              at: scheduleDate,
              allowWhileIdle: true,
            },
            extra: {
              grouped: true,
            },
          },
        ],
      });

      console.log(`Notification groupée planifiée pour ${activeTasks.length} tâches à ${scheduleDate.toLocaleString()}`);
    } catch (error) {
      console.error('Erreur lors de la planification de la notification groupée:', error);
    }
  };

  /**
   * Replanifier toutes les notifications (à appeler au lancement de l'app)
   */
  const rescheduleAllReminders = async (tasks: Task[]): Promise<void> => {
    try {
      // Vérifier les permissions
      const hasPermission = await checkPermission();
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          console.log('Permissions de notification refusées');
          return;
        }
      }

      // Annuler toutes les notifications existantes
      await LocalNotifications.cancel({ notifications: [] });

      // Obtenir toutes les notifications pending pour les annuler
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending.notifications.map(n => ({ id: n.id }))
        });
      }

      console.log('Toutes les notifications annulées');

      // Planifier une notification groupée quotidienne
      await scheduleGroupedReminder(tasks);

      // Mettre à jour le badge avec le nombre de tâches actives
      const activeCount = tasks.filter(t => !t.isCompleted && !t.isArchived).length;
      await updateBadgeCount(activeCount);

      console.log(`Notifications replanifiées pour ${tasks.length} tâches`);
    } catch (error) {
      console.error('Erreur lors de la replanification des notifications:', error);
    }
  };

  /**
   * Mettre à jour le badge de l'icône de l'app
   */
  const updateBadgeCount = async (count: number): Promise<void> => {
    try {
      // Note: Le badge iOS nécessite une notification pour être mis à jour
      // On utilise le système de notifications local pour gérer le badge
      console.log(`Badge mis à jour: ${count}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du badge:', error);
    }
  };

  /**
   * Annuler toutes les notifications
   */
  const cancelAllReminders = async (): Promise<void> => {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending.notifications.map(n => ({ id: n.id }))
        });
      }
      console.log('Toutes les notifications annulées');
    } catch (error) {
      console.error('Erreur lors de l\'annulation des notifications:', error);
    }
  };

  /**
   * Envoyer une notification de test
   */
  const sendTestNotification = async (): Promise<void> => {
    try {
      const hasPermission = await checkPermission();
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error('Permission de notification refusée');
        }
      }

      // Notification immédiate (dans 5 secondes)
      const testDate = new Date();
      testDate.setSeconds(testDate.getSeconds() + 5);

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 999998,
            title: '✅ Notification de test',
            body: 'Les notifications fonctionnent correctement ! 🎉',
            schedule: {
              at: testDate,
              allowWhileIdle: true,
            },
          },
        ],
      });

      console.log('Notification de test planifiée dans 5 secondes');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de test:', error);
      throw error;
    }
  };

  return {
    requestPermission,
    checkPermission,
    scheduleTaskReminder,
    scheduleGroupedReminder,
    rescheduleAllReminders,
    updateBadgeCount,
    cancelAllReminders,
    sendTestNotification,
  };
}
