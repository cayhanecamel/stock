import React from 'react';
import { useStore } from '../store/useStore';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableGroup } from './SortableGroup';
import { EditCardForm } from './EditCardForm';

export const CardList: React.FC = () => {
  const { currentBoard, viewMode } = useStore();
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>([]);
  const [editingCard, setEditingCard] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState({
    name: '',
    category: '',
    store: ''
  });
  const [activeGroup, setActiveGroup] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev =>
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const startEditing = (card: { id: string; name: string; category: string; store: string }) => {
    setEditingCard(card.id);
    setEditForm({
      name: card.name,
      category: card.category,
      store: card.store
    });
  };

  const handleEditSubmit = (cardId: string, updatedData: { name: string; category: string; store: string }) => {
    if (currentBoard && updatedData.name && updatedData.category && updatedData.store) {
      useStore.getState().editCard(currentBoard.id, cardId, updatedData);
      setEditingCard(null);
    }
  };

  const handleDragStart = (event: DragEndEvent) => {
    const { active } = event;
    if (!active || !currentBoard) return;

    const card = currentBoard.cards.find(c => c.id === active.id);
    if (card) {
      const groupKey = viewMode === 'category' ? 'category' : 'store';
      setActiveGroup(card[groupKey as keyof typeof card] as string);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || !currentBoard) return;
    setActiveGroup(null);

    // グループのドラッグ&ドロップ
    if (active.data.current?.type === 'group' && over.data.current?.type === 'group') {
      const groups = Object.keys(groupedCards);
      const oldIndex = groups.indexOf(active.id as string);
      const newIndex = groups.indexOf(over.id as string);

      if (oldIndex !== newIndex) {
        const newGroups = [...groups];
        const [movedGroup] = newGroups.splice(oldIndex, 1);
        newGroups.splice(newIndex, 0, movedGroup);
        useStore.getState().reorderGroups(currentBoard.id, newGroups);
      }
      return;
    }

    // カードのドラッグ&ドロップ
    const activeCard = currentBoard.cards.find(card => card.id === active.id);
    const overCard = currentBoard.cards.find(card => card.id === over.id);
    if (!activeCard || !overCard) return;

    const groupKey = viewMode === 'category' ? 'category' : 'store';
    const sourceGroup = activeCard[groupKey as keyof typeof activeCard] as string;
    const destinationGroup = overCard[groupKey as keyof typeof overCard] as string;

    const cards = currentBoard.cards.filter(card => 
      card[groupKey as keyof typeof card] === destinationGroup
    );
    const oldIndex = cards.findIndex(card => card.id === active.id);
    const newIndex = cards.findIndex(card => card.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newCards = [...cards];
      const [movedCard] = newCards.splice(oldIndex, 1);
      newCards.splice(newIndex, 0, movedCard);
      useStore.getState().reorderCards(currentBoard.id, sourceGroup, destinationGroup, newCards);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!active || !over || !currentBoard || !activeGroup) return;

    const activeCard = currentBoard.cards.find(card => card.id === active.id);
    if (!activeCard) return;

    const groupKey = viewMode === 'category' ? 'category' : 'store';
    const overCard = currentBoard.cards.find(card => card.id === over.id);
    
    if (overCard) {
      const overGroup = overCard[groupKey as keyof typeof overCard] as string;
      if (activeGroup !== overGroup) {
        const cards = [activeCard];
        useStore.getState().reorderCards(currentBoard.id, activeGroup, overGroup, cards);
        setActiveGroup(overGroup);
      }
    }
  };

  if (!currentBoard) return null;

  const groupedCards = currentBoard.cards.reduce((acc, card) => {
    const key = viewMode === 'category' ? card.category : card.store;
    if (!acc[key]) acc[key] = [];
    acc[key].push(card);
    return acc;
  }, {} as Record<string, typeof currentBoard.cards>);

  const sortedGroups = Object.entries(groupedCards).sort(([groupA], [groupB]) => {
    const cardA = groupedCards[groupA][0];
    const cardB = groupedCards[groupB][0];
    return (cardA.order || 0) - (cardB.order || 0);
  });

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext
          items={Object.keys(groupedCards)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {sortedGroups.map(([group, cards]) => (
              <SortableGroup
                key={group}
                group={group}
                cards={cards}
                isExpanded={expandedGroups.includes(group)}
                onToggle={() => toggleGroup(group)}
                onEditCard={startEditing}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editingCard && (
        <EditCardForm
          cardId={editingCard}
          initialValues={editForm}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingCard(null)}
        />
      )}
    </>
  );
};