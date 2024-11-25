import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';

const app = express();
app.use(cors());
app.use(express.json());

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

app.post('/api/sheets/cards', async (req, res) => {
  try {
    const { accessToken } = req.body;
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Cards!A2:F',
    });

    const rows = response.data.values || [];
    const cards = rows.map(row => ({
      id: row[0],
      name: row[1],
      category: row[2],
      store: row[3],
      checked: row[4] === 'true',
      order: parseInt(row[5], 10)
    }));

    res.json(cards);
  } catch (error) {
    console.error('Failed to fetch cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

app.post('/api/sheets/cards/add', async (req, res) => {
  try {
    const { accessToken, card } = req.body;
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Cards!A2:F',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          card.id,
          card.name,
          card.category,
          card.store,
          card.checked.toString(),
          card.order.toString()
        ]]
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to save card:', error);
    res.status(500).json({ error: 'Failed to save card' });
  }
});

app.put('/api/sheets/cards/:id', async (req, res) => {
  try {
    const { accessToken, card } = req.body;
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Cards!A2:A',
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === req.params.id);

    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Card not found' });
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Cards!A${rowIndex + 2}:F${rowIndex + 2}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          card.id,
          card.name,
          card.category,
          card.store,
          card.checked.toString(),
          card.order.toString()
        ]]
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to update card:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

app.delete('/api/sheets/cards/:id', async (req, res) => {
  try {
    const { accessToken } = req.body;
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Cards!A2:A',
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === req.params.id);

    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Card not found' });
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
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
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete card:', error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});