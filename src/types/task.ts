export type Priority = 'high' | 'medium' | 'low';

export type ReminderFrequency = 'daily' | 'weekly';

export const CATEGORIES = [
  'Maison',
  'Travail',
  'Courses',
  'Personnel',
  'Santé',
  'Loisirs'
] as const;

export type Category = typeof CATEGORIES[number];

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: Priority;
  categories: Category[];
  reminderFrequency: ReminderFrequency;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
  isSnoozed: boolean;
  snoozeUntil?: Date;
  lastReminderSent?: Date;
  isArchived: boolean;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: Priority;
  categories: Category[];
  reminderFrequency?: ReminderFrequency;
}
