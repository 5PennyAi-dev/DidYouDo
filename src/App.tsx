import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import TaskListPage from './pages/TaskListPage';
import TaskDetailPage from './pages/TaskDetailPage';
import SettingsPage from './pages/SettingsPage';
import { useTasks } from './hooks/useTasks';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const { tasks } = useTasks();
  const { rescheduleAllReminders } = useNotifications();

  // Replanifier toutes les notifications au lancement de l'app
  useEffect(() => {
    if (tasks.length > 0) {
      rescheduleAllReminders(tasks);
    }
  }, [tasks.length]); // Replanifier quand le nombre de tâches change

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskListPage />} />
        <Route path="/task/:id" element={<TaskDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
