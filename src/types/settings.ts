export interface Settings {
  id: 'user-settings';
  email: string;
  reminderTime: string; // "HH:MM"
  weeklyReportDay: number; // 0-6 (dimanche-samedi)
  weeklyReportTime: string; // "HH:MM"
  notificationsEnabled: boolean;
  weeklyReportEnabled: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  id: 'user-settings',
  email: '',
  reminderTime: '17:00',
  weeklyReportDay: 0, // Dimanche
  weeklyReportTime: '09:00',
  notificationsEnabled: true,
  weeklyReportEnabled: true,
};
