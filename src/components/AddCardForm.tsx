import React from 'react';
import { useStore } from '../store/useStore';
import { Plus, Package, Tag, Store } from 'lucide-react';

export const AddCardForm: React.FC = () => {
  const { currentBoard } = useStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    category: '',
    store: ''
  });
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
    if (currentBoard && formData.name && formData.category && formData.store) {
      useStore.getState().addCard(currentBoard.id, formData);
      setFormData({ name: '', category: '', store: '' });
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (field: 'category' | 'store', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setShowSuggestions(prev => ({ ...prev, [field]: false }));
  };

  if (!currentBoard) return null;

  return (
    <div className="bg-white rounded-lg shadow">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-4 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <Plus size={20} />
          <span>新しいストックを追加</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">新しいストック</h3>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700">ストック名</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-gray-700">カテゴリ</label>
              <div className="mt-1 relative rounded-md shadow-sm">
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
                  className="block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                        onClick={() => handleSuggestionClick('category', category)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {category}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-gray-700">店舗</label>
              <div className="mt-1 relative rounded-md shadow-sm">
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
                  className="block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                        onClick={() => handleSuggestionClick('store', store)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {store}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                追加
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};