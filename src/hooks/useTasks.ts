import { db } from '../lib/instantdb';
import type { Task, CreateTaskInput, ReminderFrequency } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook pour gérer les tâches avec InstantDB
 */
export function useTasks() {
  // Query toutes les tâches non archivées
  const { isLoading, error, data } = db.useQuery({
    tasks: {
      $: {
        where: {
          isArchived: false,
        },
      },
    },
  });

  const tasks = (data?.tasks || []) as Task[];

  // Trier : non complétées en premier, puis complétées
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.isCompleted ? 1 : -1;
  });

  // Séparer les tâches complétées et non complétées
  const activeTasks = sortedTasks.filter(t => !t.isCompleted);
  const completedTasks = sortedTasks.filter(t => t.isCompleted);

  /**
   * Créer une nouvelle tâche
   */
  const createTask = async (input: CreateTaskInput) => {
    const now = new Date().toISOString();

    // Auto-détermination de la fréquence de rappel
    let reminderFrequency: ReminderFrequency = 'weekly';
    if (input.dueDate) {
      const daysUntilDue = Math.ceil(
        (new Date(input.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilDue <= 7) {
        reminderFrequency = 'daily';
      }
    }

    const task: Omit<Task, 'id'> = {
      title: input.title.trim(),
      description: input.description?.trim(),
      dueDate: input.dueDate,
      priority: input.priority,
      categories: input.categories,
      reminderFrequency: input.reminderFrequency || reminderFrequency,
      createdAt: now as any,
      updatedAt: now as any,
      isCompleted: false,
      isSnoozed: false,
      isArchived: false,
    };

    await db.transact([
      db.tx.tasks[uuidv4()].update(task as any),
    ]);
  };

  /**
   * Mettre à jour une tâche
   */
  const updateTask = async (id: string, updates: Partial<Task>) => {
    await db.transact([
      db.tx.tasks[id].update({
        ...updates,
        updatedAt: new Date().toISOString() as any,
      }),
    ]);
  };

  /**
   * Compléter une tâche
   */
  const completeTask = async (id: string) => {
    await db.transact([
      db.tx.tasks[id].update({
        isCompleted: true,
        completedAt: new Date().toISOString() as any,
        updatedAt: new Date().toISOString() as any,
      }),
    ]);
  };

  /**
   * Annuler la complétion d'une tâche
   */
  const uncompleteTask = async (id: string) => {
    await db.transact([
      db.tx.tasks[id].update({
        isCompleted: false,
        completedAt: undefined,
        updatedAt: new Date().toISOString() as any,
      }),
    ]);
  };

  /**
   * Reporter la date d'échéance
   */
  const postponeTask = async (id: string, days: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newDueDate = new Date();
    if (task.dueDate) {
      newDueDate.setTime(new Date(task.dueDate).getTime());
    }
    newDueDate.setDate(newDueDate.getDate() + days);

    await updateTask(id, {
      dueDate: newDueDate as any,
    });
  };

  /**
   * Snoozer une tâche (désactiver rappels temporairement)
   */
  const snoozeTask = async (id: string, until: Date) => {
    await db.transact([
      db.tx.tasks[id].update({
        isSnoozed: true,
        snoozeUntil: until.toISOString() as any,
        updatedAt: new Date().toISOString() as any,
      }),
    ]);
  };

  /**
   * Supprimer une tâche
   */
  const deleteTask = async (id: string) => {
    await db.transact([
      db.tx.tasks[id].delete(),
    ]);
  };

  /**
   * Archiver les tâches complétées (pour le bilan hebdo)
   */
  const archiveCompletedTasks = async () => {
    const toArchive = tasks.filter(t => t.isCompleted);

    await db.transact(
      toArchive.map(task =>
        db.tx.tasks[task.id].update({
          isArchived: true,
          updatedAt: new Date().toISOString() as any,
        })
      )
    );
  };

  return {
    // État
    tasks: sortedTasks,
    activeTasks,
    completedTasks,
    isLoading,
    error,

    // Actions
    createTask,
    updateTask,
    completeTask,
    uncompleteTask,
    postponeTask,
    snoozeTask,
    deleteTask,
    archiveCompletedTasks,
  };
}
