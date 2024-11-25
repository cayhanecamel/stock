import React from 'react';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/useAuthStore';
import { LoginPage } from './components/LoginPage';
import { BoardList } from './components/BoardList';
import { CardList } from './components/CardList';
import { AddCardForm } from './components/AddCardForm';
import { Tag, Store, Menu, X } from 'lucide-react';

function App() {
  const { currentBoard, viewMode, setViewMode, isBoardListVisible, toggleBoardList } = useStore();
  const { user } = useAuthStore();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
          <button
            onClick={toggleBoardList}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isBoardListVisible ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Stock</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className={`
            fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto
            ${isBoardListVisible ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <BoardList />
          </div>

          {currentBoard && (
            <div className="md:col-span-12">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{currentBoard.name}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('category')}
                    className={`p-2 rounded ${
                      viewMode === 'category' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
                    }`}
                  >
                    <Tag size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('store')}
                    className={`p-2 rounded ${
                      viewMode === 'store' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
                    }`}
                  >
                    <Store size={20} />
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <CardList />
              </div>
              <div className="mt-6">
                <AddCardForm />
              </div>
            </div>
          )}
        </div>
      </main>

      {isBoardListVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleBoardList}
        />
      )}
    </div>
  );
}

export default App;