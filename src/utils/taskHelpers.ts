import type { Task, Priority, ReminderFrequency } from '../types';
import { isDatePast, isDateToday } from './dateHelpers';

/**
 * Déterminer la fréquence de rappel selon la date d'échéance
 */
export function determineReminderFrequency(dueDate: Date | string | undefined): ReminderFrequency {
  if (!dueDate) return 'weekly';

  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const daysUntilDue = Math.ceil((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return daysUntilDue <= 7 ? 'daily' : 'weekly';
}

/**
 * Vérifier si une tâche est en retard
 */
export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || task.isCompleted) return false;
  return isDatePast(task.dueDate);
}

/**
 * Vérifier si une tâche est due aujourd'hui
 */
export function isTaskDueToday(task: Task): boolean {
  if (!task.dueDate || task.isCompleted) return false;
  return isDateToday(task.dueDate);
}

/**
 * Trier les tâches par priorité
 */
export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder: Record<Priority, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return [...tasks].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Filtrer les tâches par statut
 */
export function filterTasksByStatus(
  tasks: Task[],
  status: 'active' | 'completed' | 'all'
): Task[] {
  if (status === 'all') return tasks;
  if (status === 'completed') return tasks.filter(t => t.isCompleted);
  return tasks.filter(t => !t.isCompleted);
}

/**
 * Obtenir le nombre de tâches par priorité
 */
export function countTasksByPriority(tasks: Task[]): Record<Priority, number> {
  return tasks.reduce(
    (acc, task) => {
      acc[task.priority]++;
      return acc;
    },
    { high: 0, medium: 0, low: 0 } as Record<Priority, number>
  );
}
