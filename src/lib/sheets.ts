import axios from 'axios';
import { Card } from '../types';

const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const STORAGE_KEY = 'stock_spreadsheet_id';

export const sheetsApi = {
  async createSpreadsheet(accessToken: string): Promise<string> {
    try {
      const response = await axios.post(
        SHEETS_API_URL,
        {
          properties: {
            title: 'Stock Management App Data'
          },
          sheets: [{
            properties: {
              title: 'Cards',
              gridProperties: {
                rowCount: 1000,
                columnCount: 6
              }
            }
          }]
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );

      const spreadsheetId = response.data.spreadsheetId;

      // Initialize headers
      await axios.put(
        `${SHEETS_API_URL}/${spreadsheetId}/values/Cards!A1:F1`,
        {
          values: [['ID', 'Name', 'Category', 'Store', 'Checked', 'Order']]
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            valueInputOption: 'RAW'
          }
        }
      );

      localStorage.setItem(STORAGE_KEY, spreadsheetId);
      return spreadsheetId;
    } catch (error) {
      console.error('Failed to create spreadsheet:', error);
      throw error;
    }
  },

  getSpreadsheetId(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  },

  async getCards(accessToken: string): Promise<Card[]> {
    try {
      let spreadsheetId = this.getSpreadsheetId();
      if (!spreadsheetId) {
        spreadsheetId = await this.createSpreadsheet(accessToken);
      }

      const response = await axios.get(
        `${SHEETS_API_URL}/${spreadsheetId}/values/Cards!A2:F`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const rows = response.data.values || [];
      return rows.map((row: any[]) => ({
        id: row[0],
        name: row[1],
        category: row[2],
        store: row[3],
        checked: row[4] === 'true',
        order: parseInt(row[5], 10)
      }));
    } catch (error) {
      console.error('Failed to fetch cards:', error);
      return [];
    }
  },

  async saveCard(accessToken: string, card: Card): Promise<boolean> {
    try {
      const spreadsheetId = this.getSpreadsheetId();
      if (!spreadsheetId) return false;

      await axios.post(
        `${SHEETS_API_URL}/${spreadsheetId}/values/Cards!A2:F:append`,
        {
          values: [[
            card.id,
            card.name,
            card.category,
            card.store,
            card.checked.toString(),
            card.order.toString()
          ]]
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS'
          }
        }
      );
      return true;
    } catch (error) {
      console.error('Failed to save card:', error);
      return false;
    }
  },

  async updateCard(accessToken: string, card: Card): Promise<boolean> {
    try {
      const spreadsheetId = this.getSpreadsheetId();
      if (!spreadsheetId) return false;

      const findResponse = await axios.get(
        `${SHEETS_API_URL}/${spreadsheetId}/values/Cards!A2:A`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );

      const rows = findResponse.data.values || [];
      const rowIndex = rows.findIndex((row: any[]) => row[0] === card.id);

      if (rowIndex === -1) return false;

      await axios.put(
        `${SHEETS_API_URL}/${spreadsheetId}/values/Cards!A${rowIndex + 2}:F${rowIndex + 2}`,
        {
          values: [[
            card.id,
            card.name,
            card.category,
            card.store,
            card.checked.toString(),
            card.order.toString()
          ]]
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            valueInputOption: 'RAW'
          }
        }
      );
      return true;
    } catch (error) {
      console.error('Failed to update card:', error);
      return false;
    }
  },

  async deleteCard(accessToken: string, cardId: string): Promise<boolean> {
    try {
      const spreadsheetId = this.getSpreadsheetId();
      if (!spreadsheetId) return false;

      const findResponse = await axios.get(
        `${SHEETS_API_URL}/${spreadsheetId}/values/Cards!A2:A`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );

      const rows = findResponse.data.values || [];
      const rowIndex = rows.findIndex((row: any[]) => row[0] === cardId);

      if (rowIndex === -1) return false;

      await axios.post(
        `${SHEETS_API_URL}/${spreadsheetId}:batchUpdate`,
        {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: rowIndex + 1,
                endIndex: rowIndex + 2
              }
            }
          }]
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );
      return true;
    } catch (error) {
      console.error('Failed to delete card:', error);
      return false;
    }
  }
};