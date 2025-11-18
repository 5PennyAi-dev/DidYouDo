import type { Priority } from '../types';

interface PriorityBadgeProps {
  priority: Priority;
}

function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = {
    high: {
      label: 'Haute',
      icon: '🔴',
      classes: 'bg-red-100 text-red-800',
    },
    medium: {
      label: 'Moyenne',
      icon: '🟡',
      classes: 'bg-yellow-100 text-yellow-800',
    },
    low: {
      label: 'Basse',
      icon: '🟢',
      classes: 'bg-green-100 text-green-800',
    },
  };

  const { label, icon, classes } = config[priority];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${classes}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}

export default PriorityBadge;
