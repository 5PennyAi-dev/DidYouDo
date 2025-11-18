import { useState } from 'react';
import type { CreateTaskInput, Priority, Category } from '../types';
import Button from './Button';
import PrioritySelector from './PrioritySelector';
import CategorySelector from './CategorySelector';
import DatePicker from './DatePicker';

interface TaskFormProps {
  onSubmit: (task: CreateTaskInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function TaskForm({ onSubmit, onCancel, isSubmitting = false }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<Priority>('medium');
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    } else if (title.length > 100) {
      newErrors.title = 'Le titre ne doit pas dépasser 100 caractères';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Soumettre
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate,
      priority,
      categories,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Titre */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-text">
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setErrors({});
          }}
          placeholder="Ex: Acheter du lait"
          maxLength={100}
          className={`
            w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${errors.title ? 'border-red-500' : 'border-gray-300'}
          `}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
        <p className="text-xs text-gray-500">
          {title.length}/100 caractères
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-text">
          Description (optionnel)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ajoutez des détails..."
          maxLength={500}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500">
          {description.length}/500 caractères
        </p>
      </div>

      {/* Date d'échéance */}
      <DatePicker
        value={dueDate}
        onChange={setDueDate}
        label="Date d'échéance (optionnel)"
        placeholder="Choisir une date"
        minDate={new Date()}
      />

      {/* Priorité */}
      <PrioritySelector value={priority} onChange={setPriority} />

      {/* Catégories */}
      <CategorySelector
        selectedCategories={categories}
        onChange={setCategories}
      />

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Création...' : 'Créer la tâche'}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;
