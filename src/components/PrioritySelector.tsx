import type { Priority } from '../types';

interface PrioritySelectorProps {
  value: Priority;
  onChange: (priority: Priority) => void;
}

const priorities: Array<{ value: Priority; label: string; icon: string; color: string }> = [
  { value: 'high', label: 'Haute', icon: '🔴', color: 'border-red-500 bg-red-50 text-red-700' },
  { value: 'medium', label: 'Moyenne', icon: '🟡', color: 'border-yellow-500 bg-yellow-50 text-yellow-700' },
  { value: 'low', label: 'Basse', icon: '🟢', color: 'border-green-500 bg-green-50 text-green-700' },
];

function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text">
        Priorité
      </label>
      <div className="grid grid-cols-3 gap-2">
        {priorities.map((priority) => {
          const isSelected = value === priority.value;
          return (
            <button
              key={priority.value}
              type="button"
              onClick={() => onChange(priority.value)}
              className={`
                flex flex-col items-center justify-center gap-1 p-3 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? `${priority.color} border-current shadow-md scale-105`
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
              `}
            >
              <span className="text-2xl">{priority.icon}</span>
              <span className="text-xs font-medium">{priority.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PrioritySelector;
