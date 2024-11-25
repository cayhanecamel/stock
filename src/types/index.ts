export interface Card {
  id: string;
  name: string;
  category: string;
  store: string;
  checked: boolean;
  order: number;
}

export interface Board {
  id: string;
  name: string;
  cards: Card[];
  sharedWith: string[];
  createdBy: string;
}