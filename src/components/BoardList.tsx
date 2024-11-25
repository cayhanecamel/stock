import React from 'react';
import { Plus, Pencil, ChevronDown, ChevronRight, Trash2, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export const BoardList: React.FC = () => {
  const { boards, setCurrentBoard, toggleBoardList, isBoardListExpanded, toggleBoardListExpanded } = useStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [newBoardName, setNewBoardName] = React.useState('');
  const [editingBoardId, setEditingBoardId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');
  const [checkedCounts, setCheckedCounts] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    const newCounts: Record<string, number> = {};
    boards.forEach(board => {
      newCounts[board.id] = board.cards.filter(card => card.checked).length;
    });
    setCheckedCounts(prev => {
      const changes = Object.keys(newCounts).some(
        id => newCounts[id] !== prev[id]
      );
      return changes ? newCounts : prev;
    });
  }, [boards]);

  const handleAddBoard = () => {
    if (newBoardName.trim()) {
      useStore.getState().addBoard(newBoardName);
      setNewBoardName('');
      setIsAddDialogOpen(false);
    }
  };

  const startEditing = (board: { id: string; name: string }) => {
    setEditingBoardId(board.id);
    setEditingName(board.name);
  };

  const handleEditBoard = (boardId: string) => {
    if (editingName.trim()) {
      useStore.getState().editBoard(boardId, editingName);
      setEditingBoardId(null);
    }
  };

  const handleDeleteBoard = (boardId: string) => {
    if (confirm('このボードを削除してもよろしいですか？')) {
      useStore.getState().deleteBoard(boardId);
      setEditingBoardId(null);
    }
  };

  return (
    <div className="h-full p-4">
      <button
        onClick={toggleBoardListExpanded}
        className="w-full flex items-center justify-between mb-4"
      >
        <h2 className="text-lg font-bold">ボード一覧</h2>
        {isBoardListExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>

      <div className={`space-y-4 overflow-hidden transition-all duration-300 ease-in-out ${
        isBoardListExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="space-y-2">
          {boards.map(board => (
            <div
              key={board.id}
              className="bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div
                onClick={() => {
                  setCurrentBoard(board.id);
                  toggleBoardList();
                }}
                className="p-4 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{board.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(board);
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
                <div className="text-sm mt-1">
                  {checkedCounts[board.id] > 0 ? (
                    <span className="text-red-500 transition-all duration-300">
                      補充が必要です！😰
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      ストックは十分です！😊
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="w-full flex items-center justify-center gap-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          <span>新しいボードを追加</span>
        </button>
      </div>

      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-4">
            <h3 className="text-lg font-medium mb-4">新しいボード</h3>
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="ボード名を入力"
              className="w-full px-3 py-2 border rounded-lg mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddBoard}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                追加
              </button>
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {editingBoardId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="w-full h-full bg-white p-6 md:h-auto md:max-w-2xl md:rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium">ボードの編集</h3>
              <button
                onClick={() => setEditingBoardId(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="w-full px-4 py-3 text-lg border rounded-lg"
                autoFocus
              />
              <div className="flex gap-4">
                <button
                  onClick={() => handleEditBoard(editingBoardId)}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg"
                >
                  保存
                </button>
                <button
                  onClick={() => handleDeleteBoard(editingBoardId)}
                  className="flex items-center justify-center gap-2 px-6 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};