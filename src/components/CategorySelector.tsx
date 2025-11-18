import type { Category } from '../types';
import { CATEGORIES } from '../types';

interface CategorySelectorProps {
  selectedCategories: Category[];
  onChange: (categories: Category[]) => void;
}

const categoryIcons: Record<Category, string> = {
  Maison: '🏠',
  Travail: '💼',
  Courses: '🛒',
  Personnel: '👤',
  Santé: '💊',
  Loisirs: '🎮',
};

function CategorySelector({ selectedCategories, onChange }: CategorySelectorProps) {
  const toggleCategory = (category: Category) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter(c => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text">
        Catégories
      </label>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              className={`
                inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  isSelected
                    ? 'bg-primary text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <span>{categoryIcons[category]}</span>
              <span>{category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategorySelector;
