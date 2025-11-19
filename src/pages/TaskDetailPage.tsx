import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  Edit2,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Button, Card, PriorityBadge, CategoryBadge, Modal, TaskForm } from '../components';
import { useTasks } from '../hooks/useTasks';
import { formatTaskDate, getRelativeDate } from '../utils/dateHelpers';
import { isTaskOverdue, isTaskDueToday } from '../utils/taskHelpers';
import { playCompletionAnimation } from '../utils/completionAnimation';
import type { CreateTaskInput } from '../types';

function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, completeTask, uncompleteTask, deleteTask, postponeTask, updateTask } = useTasks();

  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPostponeMenu, setShowPostponeMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Card>
          <p className="text-center text-gray-600">Tâche introuvable</p>
          <Link to="/" className="block mt-4">
            <Button fullWidth>Retour à la liste</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isOverdue = isTaskOverdue(task);
  const isDueToday = isTaskDueToday(task);

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      await completeTask(task.id);

      // Animation de complétion (confettis + son + haptic)
      await playCompletionAnimation();

      // Retour à la liste après l'animation
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Erreur lors de la complétion:', error);
      alert('Erreur lors de la complétion de la tâche');
      setIsCompleting(false);
    }
  };

  const handleUncomplete = async () => {
    try {
      await uncompleteTask(task.id);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTask(task.id);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la tâche');
      setIsDeleting(false);
    }
  };

  const handlePostpone = async (days: number) => {
    try {
      await postponeTask(task.id, days);
      setShowPostponeMenu(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEdit = async (updates: CreateTaskInput) => {
    try {
      setIsEditing(true);
      await updateTask(task.id, {
        title: updates.title,
        description: updates.description,
        dueDate: updates.dueDate as any,
        priority: updates.priority,
        categories: updates.categories,
      });
      setShowEditModal(false);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('Erreur lors de la modification de la tâche');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <header className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </Link>
        </header>

        <main className="space-y-4">
          {/* Titre et statut */}
          <Card>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1
                className={`text-3xl font-bold ${
                  task.isCompleted ? 'line-through text-gray-500' : 'text-text'
                }`}
              >
                {task.title}
              </h1>
              {task.isCompleted && (
                <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
              )}
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-gray-700 mb-6 whitespace-pre-wrap">
                {task.description}
              </p>
            )}

            {/* Infos */}
            <div className="space-y-3 mb-6">
              {/* Date d'échéance */}
              {task.dueDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span
                    className={`font-medium ${
                      isOverdue
                        ? 'text-red-600'
                        : isDueToday
                        ? 'text-primary'
                        : 'text-gray-700'
                    }`}
                  >
                    Échéance : {formatTaskDate(task.dueDate)}
                    {isOverdue && ' (en retard)'}
                    {isDueToday && !task.isCompleted && ' (aujourd\'hui)'}
                  </span>
                </div>
              )}

              {/* Dates de création/complétion */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Créée {getRelativeDate(task.createdAt)}</span>
              </div>

              {task.completedAt && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Complétée {getRelativeDate(task.completedAt)}</span>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <PriorityBadge priority={task.priority} />
              {task.categories.map((category) => (
                <CategoryBadge key={category} category={category} />
              ))}
            </div>

            {/* Actions principales */}
            {!task.isCompleted ? (
              <div className="space-y-3">
                <Button
                  fullWidth
                  size="lg"
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="relative"
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="w-5 h-5 inline-block mr-2 animate-spin" />
                      Complétion en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 inline-block mr-2" />
                      Marquer comme complétée
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setShowEditModal(true)}
                  >
                    <Edit2 className="w-4 h-4 inline-block mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setShowPostponeMenu(true)}
                  >
                    <Calendar className="w-4 h-4 inline-block mr-2" />
                    Reporter
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                fullWidth
                variant="secondary"
                onClick={handleUncomplete}
              >
                Rouvrir la tâche
              </Button>
            )}
          </Card>

          {/* Zone de danger */}
          <Card padding="sm">
            <Button
              fullWidth
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 inline-block mr-2" />
              {isDeleting ? 'Suppression...' : 'Supprimer la tâche'}
            </Button>
          </Card>
        </main>

        {/* Modal Confirmation suppression */}
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Confirmer la suppression"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal Modifier */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Modifier la tâche"
          size="md"
        >
          <TaskForm
            initialTask={task}
            onSubmit={handleEdit}
            onCancel={() => setShowEditModal(false)}
            isSubmitting={isEditing}
          />
        </Modal>

        {/* Modal Reporter */}
        <Modal
          isOpen={showPostponeMenu}
          onClose={() => setShowPostponeMenu(false)}
          title="Reporter la tâche"
          size="sm"
        >
          <div className="space-y-2">
            {[
              { label: '+1 jour', days: 1 },
              { label: '+3 jours', days: 3 },
              { label: '+1 semaine', days: 7 },
              { label: '+2 semaines', days: 14 },
            ].map(({ label, days }) => (
              <Button
                key={days}
                fullWidth
                variant="secondary"
                onClick={() => handlePostpone(days)}
              >
                {label}
              </Button>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default TaskDetailPage;
