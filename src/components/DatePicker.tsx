import { Calendar } from 'lucide-react';
import { formatDateForInput } from '../utils/dateHelpers';

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  minDate?: Date;
}

function DatePicker({ value, onChange, label, placeholder, minDate }: DatePickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    if (dateStr) {
      onChange(new Date(dateStr));
    } else {
      onChange(undefined);
    }
  };

  const handleClear = () => {
    onChange(undefined);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="date"
          value={value ? formatDateForInput(value) : ''}
          onChange={handleChange}
          min={minDate ? formatDateForInput(minDate) : undefined}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Effacer la date"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default DatePicker;
