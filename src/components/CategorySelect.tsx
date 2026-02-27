import type { CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';

interface Props {
  onSelect: (categoryId: CategoryId) => void;
  onBack: () => void;
}

export function CategorySelect({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-pink-100 to-pink-50">
      <div className="max-w-lg w-full">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Category</h2>
        <p className="text-gray-600 mb-6">Pick the buzzword pack for your meeting</p>

        <div className="space-y-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className="w-full text-left p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.description}</p>
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {cat.words.slice(0, 6).join(', ')}...
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
