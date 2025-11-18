import { ArrowLeft, Bell, Mail, Save, TestTube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, Button } from '../components';
import { useNotifications } from '../hooks/useNotifications';
import { Preferences } from '@capacitor/preferences';

function SettingsPage() {
  const { sendTestNotification, requestPermission, checkPermission } = useNotifications();

  // État des paramètres
  const [email, setEmail] = useState('');
  const [reminderTime, setReminderTime] = useState('17:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [weeklyReportEnabled, setWeeklyReportEnabled] = useState(true);
  const [weeklyReportDay, setWeeklyReportDay] = useState(0); // 0 = Dimanche
  const [weeklyReportTime, setWeeklyReportTime] = useState('09:00');

  // État UI
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [testingNotif, setTestingNotif] = useState(false);
  const [hasNotifPermission, setHasNotifPermission] = useState(false);

  // Charger les paramètres au montage
  useEffect(() => {
    loadSettings();
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    const hasPermission = await checkPermission();
    setHasNotifPermission(hasPermission);
  };

  const loadSettings = async () => {
    try {
      const [
        emailResult,
        reminderTimeResult,
        notifEnabledResult,
        reportEnabledResult,
        reportDayResult,
        reportTimeResult,
      ] = await Promise.all([
        Preferences.get({ key: 'email' }),
        Preferences.get({ key: 'reminderTime' }),
        Preferences.get({ key: 'notificationsEnabled' }),
        Preferences.get({ key: 'weeklyReportEnabled' }),
        Preferences.get({ key: 'weeklyReportDay' }),
        Preferences.get({ key: 'weeklyReportTime' }),
      ]);

      if (emailResult.value) setEmail(emailResult.value);
      if (reminderTimeResult.value) setReminderTime(reminderTimeResult.value);
      if (notifEnabledResult.value !== null) setNotificationsEnabled(notifEnabledResult.value !== 'false');
      if (reportEnabledResult.value !== null) setWeeklyReportEnabled(reportEnabledResult.value !== 'false');
      if (reportDayResult.value) setWeeklyReportDay(parseInt(reportDayResult.value));
      if (reportTimeResult.value) setWeeklyReportTime(reportTimeResult.value);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      await Promise.all([
        Preferences.set({ key: 'email', value: email }),
        Preferences.set({ key: 'reminderTime', value: reminderTime }),
        Preferences.set({ key: 'notificationsEnabled', value: notificationsEnabled.toString() }),
        Preferences.set({ key: 'weeklyReportEnabled', value: weeklyReportEnabled.toString() }),
        Preferences.set({ key: 'weeklyReportDay', value: weeklyReportDay.toString() }),
        Preferences.set({ key: 'weeklyReportTime', value: weeklyReportTime }),
      ]);

      setSaveMessage('✅ Paramètres sauvegardés avec succès !');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveMessage('❌ Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async () => {
    setTestingNotif(true);

    try {
      // Vérifier/demander les permissions
      if (!hasNotifPermission) {
        const granted = await requestPermission();
        if (!granted) {
          alert('Permission de notification refusée. Veuillez activer les notifications dans les paramètres de votre appareil.');
          setTestingNotif(false);
          return;
        }
        setHasNotifPermission(true);
      }

      await sendTestNotification();
      alert('✅ Notification de test envoyée ! Elle apparaîtra dans 5 secondes.');
    } catch (error) {
      console.error('Erreur lors du test de notification:', error);
      alert('❌ Erreur lors de l\'envoi de la notification de test');
    } finally {
      setTestingNotif(false);
    }
  };

  const handleTestEmail = async () => {
    alert('📧 Test d\'email à implémenter (Phase 3 - partie 2)');
  };

  const weekDays = [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </Link>

          <h1 className="text-3xl font-bold text-text mb-2">Paramètres</h1>
          <p className="text-gray-600">
            Configurez vos préférences de rappels et notifications
          </p>
        </header>

        <main className="space-y-6">
          {/* Section Email */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-text">Email</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email pour le bilan hebdomadaire
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="weeklyReportEnabled"
                  checked={weeklyReportEnabled}
                  onChange={(e) => setWeeklyReportEnabled(e.target.checked)}
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <label htmlFor="weeklyReportEnabled" className="text-sm text-gray-700">
                  Activer le bilan hebdomadaire par email
                </label>
              </div>

              {weeklyReportEnabled && (
                <div className="grid grid-cols-2 gap-4 pl-8">
                  <div>
                    <label htmlFor="weeklyReportDay" className="block text-sm font-medium text-gray-700 mb-2">
                      Jour d'envoi
                    </label>
                    <select
                      id="weeklyReportDay"
                      value={weeklyReportDay}
                      onChange={(e) => setWeeklyReportDay(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {weekDays.map((day, index) => (
                        <option key={index} value={index}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="weeklyReportTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Heure d'envoi
                    </label>
                    <input
                      type="time"
                      id="weeklyReportTime"
                      value={weeklyReportTime}
                      onChange={(e) => setWeeklyReportTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Section Notifications */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-text">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="notificationsEnabled"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <label htmlFor="notificationsEnabled" className="text-sm text-gray-700">
                  Activer les rappels quotidiens
                </label>
              </div>

              {notificationsEnabled && (
                <div className="pl-8">
                  <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Heure des rappels quotidiens
                  </label>
                  <input
                    type="time"
                    id="reminderTime"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Vous recevrez une notification avec vos tâches en attente
                  </p>
                </div>
              )}

              {!hasNotifPermission && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Les notifications ne sont pas autorisées. Testez une notification pour activer les permissions.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Section Tests */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <TestTube className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-text">Tests</h2>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Testez vos paramètres de notification et email
              </p>

              <Button
                variant="secondary"
                fullWidth
                onClick={handleTestNotification}
                disabled={testingNotif}
              >
                {testingNotif ? 'Envoi...' : '🔔 Envoyer notification de test'}
              </Button>

              <Button
                variant="secondary"
                fullWidth
                onClick={handleTestEmail}
              >
                📧 Envoyer email de test
              </Button>
            </div>
          </Card>

          {/* Bouton Sauvegarder */}
          <div className="sticky bottom-6">
            <Button
              variant="primary"
              fullWidth
              onClick={saveSettings}
              disabled={isSaving}
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
            </Button>

            {saveMessage && (
              <div className="mt-3 text-center">
                <p className={`text-sm font-medium ${saveMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                  {saveMessage}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SettingsPage;
