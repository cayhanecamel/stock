import React from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableCard } from './SortableCard';
import { Card } from '../types';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';

interface Props {
  group: string;
  cards: Card[];
  isExpanded: boolean;
  onToggle: () => void;
  onEditCard: (card: Card) => void;
}

export const SortableGroup: React.FC<Props> = ({
  group,
  cards,
  isExpanded,
  onToggle,
  onEditCard,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: group,
    data: {
      type: 'group'
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const checkedCount = cards.filter(card => card.checked).length;
  const sortedCards = [...cards].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow"
    >
      <div className="flex items-center p-4">
        <div {...attributes} {...listeners} className="cursor-grab mr-2">
          <GripVertical size={20} className="text-gray-400" />
        </div>
        <button
          onClick={onToggle}
          className="flex-1 flex items-center gap-2"
        >
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <span className="font-medium">{group}</span>
          <span className={`text-sm ${checkedCount > 0 ? 'font-bold text-red-500' : 'text-gray-500'} transition-all duration-300 ease-in-out`}>
            ({checkedCount})
          </span>
        </button>
      </div>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pb-4 space-y-2">
          <SortableContext
            items={sortedCards.map(card => card.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedCards.map(card => (
              <SortableCard
                key={card.id}
                card={card}
                onEdit={() => onEditCard(card)}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};