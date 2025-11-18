import type { Task } from '../types';
import { differenceInDays, startOfDay, subDays } from 'date-fns';

/**
 * Calculer les statistiques pour le bilan hebdomadaire
 */
export interface WeeklyStats {
  completedCount: number;
  remainingCount: number;
  completionRate: number;
  averageDelayDays: number;
  streak: number;
  topCategory: string | null;
  overdueCount: number;
  upcomingCount: number;
}

/**
 * Obtenir le message de félicitations basé sur le nombre de tâches complétées
 */
export function getCongratulationsMessage(count: number): string {
  if (count === 0) return "Pas de tâches cette semaine. Prêt à repartir ? 💭";
  if (count === 1) return "Bravo ! 1 tâche complétée. Chaque pas compte ! 🎊";
  if (count <= 3) return `Super ! ${count} tâches. Tu prends de l'élan ! 🎉`;
  if (count <= 7) return `Excellent ! ${count} tâches. Belle lancée ! 🌟`;
  if (count <= 15) return `Incroyable ! ${count} tâches. Machine à productivité ! 🚀`;
  return `WOW ! ${count} tâches. Tu es en feu ! 🏆`;
}

/**
 * Calculer toutes les statistiques pour le bilan
 */
export function calculateWeeklyStats(tasks: Task[]): WeeklyStats {
  const now = new Date();
  const oneWeekAgo = subDays(now, 7);

  // Tâches complétées cette semaine
  const completedThisWeek = tasks.filter(t => {
    if (!t.isCompleted || !t.completedAt) return false;
    const completedDate = new Date(t.completedAt);
    return completedDate >= oneWeekAgo && completedDate <= now;
  });

  // Tâches restantes (actives)
  const remainingTasks = tasks.filter(t => !t.isCompleted && !t.isArchived);

  // Taux de complétion (toutes les tâches)
  const allCompletedTasks = tasks.filter(t => t.isCompleted);
  const completionRate = tasks.length > 0
    ? (allCompletedTasks.length / tasks.length) * 100
    : 0;

  // Délai moyen de complétion (en jours)
  const averageDelayDays = calculateAverageDelay(allCompletedTasks);

  // Streak (jours consécutifs avec au moins 1 tâche complétée)
  const streak = calculateStreak(allCompletedTasks);

  // Catégorie la plus productive
  const topCategory = findTopCategory(completedThisWeek);

  // Tâches en retard vs à venir
  const { overdueCount, upcomingCount } = categorizeTasksByDueDate(remainingTasks);

  return {
    completedCount: completedThisWeek.length,
    remainingCount: remainingTasks.length,
    completionRate: Math.round(completionRate),
    averageDelayDays: Math.round(averageDelayDays * 10) / 10, // 1 décimale
    streak,
    topCategory,
    overdueCount,
    upcomingCount,
  };
}

/**
 * Calculer le délai moyen entre création et complétion
 */
function calculateAverageDelay(completedTasks: Task[]): number {
  if (completedTasks.length === 0) return 0;

  const totalDelay = completedTasks.reduce((sum, task) => {
    if (!task.completedAt) return sum;
    const created = new Date(task.createdAt);
    const completed = new Date(task.completedAt);
    const delayDays = differenceInDays(completed, created);
    return sum + delayDays;
  }, 0);

  return totalDelay / completedTasks.length;
}

/**
 * Calculer le streak (jours consécutifs avec au moins 1 tâche complétée)
 */
function calculateStreak(completedTasks: Task[]): number {
  if (completedTasks.length === 0) return 0;

  // Grouper les tâches par jour de complétion
  const completionDates = completedTasks
    .filter(t => t.completedAt)
    .map(t => startOfDay(new Date(t.completedAt!)))
    .sort((a, b) => b.getTime() - a.getTime()); // Tri décroissant

  if (completionDates.length === 0) return 0;

  // Retirer les doublons
  const uniqueDates = Array.from(
    new Set(completionDates.map(d => d.getTime()))
  ).map(t => new Date(t));

  let streak = 0;
  let currentDate = startOfDay(new Date());

  // Compter les jours consécutifs en remontant dans le temps
  for (let i = 0; i < uniqueDates.length; i++) {
    const completionDate = uniqueDates[i];
    const daysDiff = differenceInDays(currentDate, completionDate);

    if (daysDiff === 0 || daysDiff === streak) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else if (daysDiff > streak) {
      // Le streak est cassé
      break;
    }
  }

  return streak;
}

/**
 * Trouver la catégorie la plus productive (avec le plus de tâches complétées)
 */
function findTopCategory(completedTasks: Task[]): string | null {
  if (completedTasks.length === 0) return null;

  // Compter les tâches par catégorie
  const categoryCounts = new Map<string, number>();

  completedTasks.forEach(task => {
    task.categories.forEach(category => {
      const count = categoryCounts.get(category) || 0;
      categoryCounts.set(category, count + 1);
    });
  });

  if (categoryCounts.size === 0) return null;

  // Trouver la catégorie avec le plus de tâches
  let topCategory = '';
  let maxCount = 0;

  categoryCounts.forEach((count, category) => {
    if (count > maxCount) {
      maxCount = count;
      topCategory = category;
    }
  });

  return topCategory || null;
}

/**
 * Catégoriser les tâches par date d'échéance (en retard vs à venir)
 */
function categorizeTasksByDueDate(tasks: Task[]): {
  overdueCount: number;
  upcomingCount: number;
} {
  const now = new Date();

  let overdueCount = 0;
  let upcomingCount = 0;

  tasks.forEach(task => {
    if (!task.dueDate) {
      upcomingCount++; // Pas de date = à venir
      return;
    }

    const dueDate = new Date(task.dueDate);
    if (dueDate < now) {
      overdueCount++;
    } else {
      upcomingCount++;
    }
  });

  return { overdueCount, upcomingCount };
}

/**
 * Formater une tâche pour l'affichage dans l'email
 */
export function formatTaskForEmail(task: Task): {
  title: string;
  priority: string;
  dueDate: string | null;
  categories: string[];
  completedDate: string | null;
} {
  const priorityLabels = {
    high: '🔴 Haute',
    medium: '🟡 Moyenne',
    low: '🟢 Basse',
  };

  return {
    title: task.title,
    priority: priorityLabels[task.priority],
    dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR') : null,
    categories: task.categories,
    completedDate: task.completedAt ? new Date(task.completedAt).toLocaleDateString('fr-FR') : null,
  };
}
