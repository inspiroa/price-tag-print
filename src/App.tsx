import React, { useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { fetchGoogleSheetsData } from 'google-sheets-data-fetcher';
import PriceTagList from './components/PriceTagList';

interface Item {
  id: number;
  data: string | number;
  price: number;
  discountPrice: number;
}

interface GoogleSheetsResponse {
  [columnKey: string]: {
    id: string;
    label: string;
    type: string;
    rows: {
      [rowKey: string]: { id: number; data: string | number };
    };
  };
}

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [columnLabels, setColumnLabels] = useState<string[]>([]);

  const componentRef = React.useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const extractSheetIdFromUrl = (url: string): string => {
    const parts = url.split('/');
    const sheetIdIndex = parts.indexOf('d') + 1;
    return parts[sheetIdIndex];
  };

  const fetchData = async (url: string) => {
    setLoading(true);
    try {
      const sheetId = extractSheetIdFromUrl(url);

      const data: GoogleSheetsResponse = await fetchGoogleSheetsData(
        [
          {
            sheetId: sheetId,
            subSheetsIds: ['0'],
          },
        ],
        ['JSON_COLUMNS']
      );

      console.log('Received data from Google Sheets API:', data);

      if (data) {
        const columnKeys = Object.keys(data);
        const columnKey = columnKeys.length > 0 ? columnKeys[0] : '';

        if (columnKey && data[columnKey].rows) {
          const receivedItems = Object.values(data[columnKey].rows).map(
            (row: { id: number; data: string | number }) => ({
              ...row,
              data: row.data,
              price: Number(data[columnKey === 'A' ? 'B' : 'A'].rows[row.id].data), // Extract price from the second column
              discountPrice: Number(data[columnKey === 'A' ? 'B' : 'A'].rows[row.id].data) - 55, // Calculate discount price
            })
          ) as Item[];

          setItems(receivedItems);
          setColumnLabels([data['A'].label, data['B'].label]); // Assuming A is for product names and B is for prices
          setError(null);
        } else {
          console.error('Invalid data structure received from Google Sheets API:', data);
          setError('Invalid data structure received from Google Sheets API');
        }
      } else {
        console.error('Invalid data structure received from Google Sheets API:', data);
        setError('Invalid data structure received from Google Sheets API');
      }
    } catch (error) {
      console.error('Error fetching data from Google Sheets API:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchData(url);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <label className="block mb-2">Enter Google Sheets URL:</label>
        <input
          type="text"
          value={url || "https://docs.google.com/spreadsheets/d/1aMIkngA9vuoxLo8UIhutGbvLw6IBzhy5ekxwBjm0vEY/edit?usp=sharing"}
          onChange={handleUrlChange}
          className="w-full border p-2"
          // value="https://docs.google.com/spreadsheets/d/1iOjJrU0bKyC6wQWHzpp9UYh_iEcPKkbORU29sHLlRFU/edit?usp=sharing"
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
          Generate Price Tags
        </button>
      </form>

      {loading && <div>Loading...</div>}

      {error && <div className="mb-4 text-red-500">{error}</div>}

      {items.length > 0 && (
        <>
          <button onClick={handlePrint} className="mb-4 bg-green-500 text-white p-2 rounded">
            Print Price Tags (PDF)
          </button>
          <div ref={componentRef}>
            <PriceTagList items={items} />
          </div>
        </>
      )}

      {/* Render your items here */}
      {/* <div className="mb-4">
        <h1>Data from Google Sheets:</h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              {columnLabels.map((label, index) => (
                <th key={index} className="border px-4 py-2">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.data}</td>
                <td className="border px-4 py-2">{new Intl.NumberFormat('ru-RU').format(item.price)}</td>
                <td className="border px-4 py-2">{new Intl.NumberFormat('ru-RU').format(item.discountPrice)}₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default App;
