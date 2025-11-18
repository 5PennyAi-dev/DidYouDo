import { format, formatDistanceToNow, addDays, isPast, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formater une date pour l'affichage
 */
export function formatTaskDate(date: Date | string | undefined): string {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date) : date;

  if (isToday(d)) return 'Aujourd\'hui';
  if (isTomorrow(d)) return 'Demain';

  return format(d, 'dd MMM yyyy', { locale: fr });
}

/**
 * Obtenir une date relative (ex: "dans 3 jours", "il y a 2 jours")
 */
export function getRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  return formatDistanceToNow(d, {
    addSuffix: true,
    locale: fr,
  });
}

/**
 * Ajouter des jours à une date
 */
export function addDaysToDate(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  return addDays(d, days);
}

/**
 * Vérifier si une date est passée
 */
export function isDatePast(date: Date | string | undefined): boolean {
  if (!date) return false;
  const d = typeof date === 'string' ? new Date(date) : date;
  return isPast(d) && !isToday(d);
}

/**
 * Vérifier si une date est aujourd'hui
 */
export function isDateToday(date: Date | string | undefined): boolean {
  if (!date) return false;
  const d = typeof date === 'string' ? new Date(date) : date;
  return isToday(d);
}

/**
 * Formater une date pour un input HTML
 */
export function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'yyyy-MM-dd');
}
