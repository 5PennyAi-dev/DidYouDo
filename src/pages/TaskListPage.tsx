import { Plus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components';

function TaskListPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="text-center mb-8 relative">
          <Link
            to="/settings"
            className="absolute right-0 top-0 p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Paramètres"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </Link>

          <h1 className="text-4xl font-bold text-primary mb-2">
            DidYouDo
          </h1>
          <p className="text-gray-600">
            Vos tâches à accomplir
          </p>
        </header>

        <main className="space-y-4">
          <Card>
            <p className="text-center text-gray-700 mb-4">
              Aucune tâche pour le moment
            </p>
            <Button fullWidth>
              <Plus className="w-5 h-5 inline-block mr-2" />
              Ajouter une tâche
            </Button>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default TaskListPage;
