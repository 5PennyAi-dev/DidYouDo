import { Calendar, CheckCircle2, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Task } from '../types';
import PriorityBadge from './PriorityBadge';
import CategoryBadge from './CategoryBadge';
import { formatTaskDate } from '../utils/dateHelpers';
import { isTaskOverdue, isTaskDueToday } from '../utils/taskHelpers';

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const isOverdue = isTaskOverdue(task);
  const isDueToday = isTaskDueToday(task);

  return (
    <Link
      to={`/task/${task.id}`}
      className={`
        block p-4 rounded-lg border-2 transition-all hover:shadow-md
        ${task.isCompleted
          ? 'bg-gray-50 border-gray-200 opacity-75'
          : 'bg-white border-gray-200 hover:border-primary'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icône de complétion */}
        <div className="flex-shrink-0 mt-1">
          {task.isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-gray-300" />
          )}
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          {/* Titre */}
          <h3
            className={`
              text-lg font-semibold mb-1
              ${task.isCompleted ? 'line-through text-gray-500' : 'text-text'}
            `}
          >
            {task.title}
          </h3>

          {/* Description (si présente) */}
          {task.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Date d'échéance */}
          {task.dueDate && (
            <div className="flex items-center gap-1 mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span
                className={`text-sm ${
                  isOverdue
                    ? 'text-red-600 font-medium'
                    : isDueToday
                    ? 'text-primary font-medium'
                    : 'text-gray-600'
                }`}
              >
                {formatTaskDate(task.dueDate)}
                {isOverdue && ' (en retard)'}
                {isDueToday && !task.isCompleted && ' (aujourd\'hui)'}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <PriorityBadge priority={task.priority} />
            {task.categories.map((category) => (
              <CategoryBadge key={category} category={category} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TaskCard;
