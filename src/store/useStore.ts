import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Board, Card } from '../types';

interface StoreState {
  boards: Board[];
  currentBoard: Board | null;
  viewMode: 'category' | 'store';
  isBoardListVisible: boolean;
  isBoardListExpanded: boolean;
  addBoard: (name: string) => void;
  editBoard: (boardId: string, name: string) => void;
  addCard: (boardId: string, card: Omit<Card, 'id' | 'checked' | 'order'>) => void;
  editCard: (boardId: string, cardId: string, updates: Partial<Omit<Card, 'id'>>) => void;
  toggleCard: (boardId: string, cardId: string) => void;
  setViewMode: (mode: 'category' | 'store') => void;
  deleteCard: (boardId: string, cardId: string) => void;
  deleteBoard: (boardId: string) => void;
  setCurrentBoard: (boardId: string) => void;
  toggleBoardList: () => void;
  toggleBoardListExpanded: () => void;
  reorderCards: (boardId: string, sourceGroup: string, destinationGroup: string, cards: Card[]) => void;
  reorderGroups: (boardId: string, groups: string[]) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      boards: [],
      currentBoard: null,
      viewMode: 'category',
      isBoardListVisible: false,
      isBoardListExpanded: true,
      
      addBoard: (name) => set((state) => ({
        boards: [...state.boards, {
          id: crypto.randomUUID(),
          name,
          cards: [],
          sharedWith: [],
          createdBy: 'user'
        }]
      })),

      editBoard: (boardId, name) => set((state) => ({
        boards: state.boards.map(board =>
          board.id === boardId ? { ...board, name } : board
        ),
        currentBoard: state.currentBoard?.id === boardId
          ? { ...state.currentBoard, name }
          : state.currentBoard
      })),

      deleteBoard: (boardId) => set((state) => ({
        boards: state.boards.filter(board => board.id !== boardId),
        currentBoard: state.currentBoard?.id === boardId ? null : state.currentBoard
      })),

      addCard: (boardId, cardData) => {
        const board = get().boards.find(b => b.id === boardId);
        const maxOrder = board?.cards.reduce((max, c) => Math.max(max, c.order || 0), 0) || 0;
        const newCard = { 
          ...cardData, 
          id: crypto.randomUUID(), 
          checked: false,
          order: maxOrder + 1
        };

        set((state) => ({
          boards: state.boards.map(board => 
            board.id === boardId
              ? {
                  ...board,
                  cards: [...board.cards, newCard]
                }
              : board
          ),
          currentBoard: state.currentBoard?.id === boardId
            ? {
                ...state.currentBoard,
                cards: [...state.currentBoard.cards, newCard]
              }
            : state.currentBoard
        }));
      },

      editCard: (boardId, cardId, updates) => set((state) => ({
        boards: state.boards.map(board =>
          board.id === boardId
            ? {
                ...board,
                cards: board.cards.map(card =>
                  card.id === cardId
                    ? { ...card, ...updates }
                    : card
                )
              }
            : board
        ),
        currentBoard: state.currentBoard?.id === boardId
          ? {
              ...state.currentBoard,
              cards: state.currentBoard.cards.map(card =>
                card.id === cardId
                  ? { ...card, ...updates }
                  : card
              )
            }
          : state.currentBoard
      })),

      toggleCard: (boardId, cardId) => {
        const currentBoard = get().boards.find(b => b.id === boardId);
        const currentCard = currentBoard?.cards.find(c => c.id === cardId);
        if (currentCard) {
          get().editCard(boardId, cardId, { checked: !currentCard.checked });
        }
      },

      setViewMode: (mode) => set({ viewMode: mode }),

      deleteCard: (boardId, cardId) => set((state) => ({
        boards: state.boards.map(board =>
          board.id === boardId
            ? {
                ...board,
                cards: board.cards.filter(card => card.id !== cardId)
              }
            : board
        ),
        currentBoard: state.currentBoard?.id === boardId
          ? {
              ...state.currentBoard,
              cards: state.currentBoard.cards.filter(card => card.id !== cardId)
            }
          : state.currentBoard
      })),

      setCurrentBoard: (boardId) => set((state) => ({
        currentBoard: state.boards.find(board => board.id === boardId) || null
      })),

      toggleBoardList: () => set((state) => ({
        isBoardListVisible: !state.isBoardListVisible
      })),

      toggleBoardListExpanded: () => set((state) => ({
        isBoardListExpanded: !state.isBoardListExpanded
      })),

      reorderCards: (boardId, sourceGroup, destinationGroup, reorderedCards) => set((state) => {
        if (!state.currentBoard) return state;

        const viewKey = state.viewMode === 'category' ? 'category' : 'store';
        const allCards = [...state.currentBoard.cards];
        
        const reorderedCardIds = new Set(reorderedCards.map(card => card.id));
        const otherCards = allCards.filter(card => !reorderedCardIds.has(card.id));
        const destinationCards = otherCards.filter(
          card => card[viewKey] === destinationGroup
        );
        
        const updatedCards = reorderedCards.map((card, index) => ({
          ...card,
          [viewKey]: destinationGroup,
          order: (destinationCards.length + index) * 10
        }));
        
        const newCards = [...otherCards, ...updatedCards].sort((a, b) => a.order - b.order);
        
        return {
          boards: state.boards.map(board =>
            board.id === boardId
              ? { ...board, cards: newCards }
              : board
          ),
          currentBoard: {
            ...state.currentBoard,
            cards: newCards
          }
        };
      }),

      reorderGroups: (boardId, groups) => set((state) => {
        if (!state.currentBoard) return state;

        const viewKey = state.viewMode === 'category' ? 'category' : 'store';
        const updatedCards = state.currentBoard.cards.map(card => {
          const groupIndex = groups.indexOf(card[viewKey]);
          return {
            ...card,
            order: groupIndex * 1000 + (card.order % 1000)
          };
        });

        return {
          boards: state.boards.map(board =>
            board.id === boardId
              ? { ...board, cards: updatedCards }
              : board
          ),
          currentBoard: {
            ...state.currentBoard,
            cards: updatedCards
          }
        };
      })
    }),
    {
      name: 'shopping-list-storage',
      version: 1,
    }
  )
);