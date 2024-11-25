import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../types';
import { Pencil, GripVertical } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Props {
  card: Card;
  onEdit: () => void;
}

export const SortableCard: React.FC<Props> = ({ card, onEdit }) => {
  const { currentBoard, viewMode } = useStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggle = () => {
    if (currentBoard) {
      useStore.getState().toggleCard(currentBoard.id, card.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-4 p-2 rounded transition-all duration-300 ${
        card.checked ? 'bg-red-50' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical size={18} className="text-gray-400" />
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={card.checked}
            onChange={handleToggle}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
        <span>
          {card.name}
          {viewMode === 'category' && (
            <span className="text-xs text-gray-500 ml-1">@{card.store}</span>
          )}
        </span>
      </div>
      <button
        onClick={onEdit}
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Pencil size={18} />
      </button>
    </div>
  );
};