import axios from 'axios';
import { Card } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  async getCards(accessToken: string): Promise<Card[]> {
    try {
      const response = await axios.post(`${API_BASE_URL}/sheets/cards`, { accessToken });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cards:', error);
      return [];
    }
  },

  async saveCard(accessToken: string, card: Card): Promise<boolean> {
    try {
      await axios.post(`${API_BASE_URL}/sheets/cards/add`, { accessToken, card });
      return true;
    } catch (error) {
      console.error('Failed to save card:', error);
      return false;
    }
  },

  async updateCard(accessToken: string, card: Card): Promise<boolean> {
    try {
      await axios.put(`${API_BASE_URL}/sheets/cards/${card.id}`, { accessToken, card });
      return true;
    } catch (error) {
      console.error('Failed to update card:', error);
      return false;
    }
  },

  async deleteCard(accessToken: string, cardId: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/sheets/cards/${cardId}`, {
        data: { accessToken }
      });
      return true;
    } catch (error) {
      console.error('Failed to delete card:', error);
      return false;
    }
  }
};