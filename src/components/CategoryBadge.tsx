import type { Category } from '../types';

interface CategoryBadgeProps {
  category: Category;
}

function CategoryBadge({ category }: CategoryBadgeProps) {
  const icons: Record<Category, string> = {
    Maison: '🏠',
    Travail: '💼',
    Courses: '🛒',
    Personnel: '👤',
    Santé: '💊',
    Loisirs: '🎮',
  };

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary-light/20 text-primary-dark">
      <span>{icons[category]}</span>
      <span>{category}</span>
    </span>
  );
}

export default CategoryBadge;
