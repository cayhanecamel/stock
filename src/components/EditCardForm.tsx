import React from 'react';
import { Package, Tag, Store, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Props {
  cardId: string;
  initialValues: {
    name: string;
    category: string;
    store: string;
  };
  onSubmit: (cardId: string, formData: { name: string; category: string; store: string }) => void;
  onCancel: () => void;
}

export const EditCardForm: React.FC<Props> = ({
  cardId,
  initialValues,
  onSubmit,
  onCancel
}) => {
  const { currentBoard } = useStore();
  const [formData, setFormData] = React.useState(initialValues);
  const [suggestions, setSuggestions] = React.useState({
    category: [] as string[],
    store: [] as string[]
  });
  const [showSuggestions, setShowSuggestions] = React.useState({
    category: false,
    store: false
  });

  React.useEffect(() => {
    if (currentBoard) {
      const uniqueCategories = [...new Set(currentBoard.cards.map(card => card.category))];
      const uniqueStores = [...new Set(currentBoard.cards.map(card => card.store))];
      setSuggestions({
        category: uniqueCategories,
        store: uniqueStores
      });
    }
  }, [currentBoard]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.category && formData.store) {
      onSubmit(cardId, formData);
    }
  };

  const handleDelete = () => {
    if (currentBoard && confirm('このストックを削除してもよろしいですか？')) {
      useStore.getState().deleteCard(currentBoard.id, cardId);
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
      <form onSubmit={handleSubmit} className="w-full h-full md:h-auto md:max-w-2xl md:rounded-lg bg-white p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">ストックの編集</h3>
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            <Trash2 size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">ストック名</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Package className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="block w-full pl-10 pr-3 py-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, category: e.target.value }));
                  setShowSuggestions(prev => ({ ...prev, category: true }));
                }}
                onFocus={() => setShowSuggestions(prev => ({ ...prev, category: true }))}
                onBlur={() => {
                  setTimeout(() => {
                    setShowSuggestions(prev => ({ ...prev, category: false }));
                  }, 200);
                }}
                className="block w-full pl-10 pr-3 py-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
            {showSuggestions.category && suggestions.category.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border">
                {suggestions.category
                  .filter(cat => cat.toLowerCase().includes(formData.category.toLowerCase()))
                  .map((category, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, category }));
                        setShowSuggestions(prev => ({ ...prev, category: false }));
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-lg"
                    >
                      {category}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">店舗</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Store className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.store}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, store: e.target.value }));
                  setShowSuggestions(prev => ({ ...prev, store: true }));
                }}
                onFocus={() => setShowSuggestions(prev => ({ ...prev, store: true }))}
                onBlur={() => {
                  setTimeout(() => {
                    setShowSuggestions(prev => ({ ...prev, store: false }));
                  }, 200);
                }}
                className="block w-full pl-10 pr-3 py-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
            {showSuggestions.store && suggestions.store.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border">
                {suggestions.store
                  .filter(s => s.toLowerCase().includes(formData.store.toLowerCase()))
                  .map((store, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, store }));
                        setShowSuggestions(prev => ({ ...prev, store: false }));
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-lg"
                    >
                      {store}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors text-lg"
            >
              保存
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors text-lg"
            >
              キャンセル
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};