import { useState } from 'react';
import { Plus, Settings, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, Modal, TaskForm, TaskCard } from '../components';
import { useTasks } from '../hooks/useTasks';
import type { CreateTaskInput } from '../types';

function TaskListPage() {
  const { tasks, activeTasks, completedTasks, createTask, isLoading } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTask = async (taskInput: CreateTaskInput) => {
    try {
      setIsSubmitting(true);
      await createTask(taskInput);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      alert('Une erreur est survenue lors de la création de la tâche');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {/* Bouton Ajouter */}
          <Button
            fullWidth
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-5 h-5 inline-block mr-2" />
            Ajouter une tâche
          </Button>

          {/* Loading */}
          {isLoading && (
            <Card>
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            </Card>
          )}

          {/* Liste des tâches */}
          {!isLoading && tasks.length === 0 && (
            <Card>
              <p className="text-center text-gray-600 py-8">
                Aucune tâche pour le moment.<br />
                Cliquez sur "Ajouter une tâche" pour commencer !
              </p>
            </Card>
          )}

          {!isLoading && tasks.length > 0 && (
            <>
              {/* Tâches actives */}
              {activeTasks.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    À faire ({activeTasks.length})
                  </h2>
                  {activeTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}

              {/* Tâches complétées */}
              {completedTasks.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Complétées ({completedTasks.length})
                  </h2>
                  {completedTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        {/* Modal Création */}
        <Modal
          isOpen={isFormOpen}
          onClose={() => !isSubmitting && setIsFormOpen(false)}
          title="Nouvelle tâche"
          size="lg"
        >
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={isSubmitting}
          />
        </Modal>
      </div>
    </div>
  );
}

export default TaskListPage;
