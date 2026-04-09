import { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import api from '../api';

export default function ShoppingList() {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const [start, setStart] = useState(format(weekStart, 'yyyy-MM-dd'));
  const [end, setEnd] = useState(format(addDays(weekStart, 6), 'yyyy-MM-dd'));
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/shopping_list', { params: { start, end } });
      setItems(data);
      setChecked({});
    } finally {
      setLoading(false);
    }
  };

  const toggle = (i) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Shopping List</h1>

      <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-6 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">From</label>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">To</label>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
        </div>
        <button onClick={generate} disabled={loading}
          className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition">
          {loading ? 'Generating...' : 'Generate List'}
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Select a date range and generate your list.</p>
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-stone-100 flex justify-between items-center">
            <span className="font-semibold">{items.length} items</span>
            <button onClick={() => setChecked({})} className="text-xs text-gray-400 hover:text-gray-600">Clear checks</button>
          </div>
          <ul className="divide-y divide-stone-50">
            {items.map((item, i) => (
              <li key={i}
                onClick={() => toggle(i)}
                className={`flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-stone-50 transition ${checked[i] ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${checked[i] ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                    {checked[i] && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-sm ${checked[i] ? 'line-through text-gray-400' : ''}`}>{item.name}</span>
                </div>
                <span className="text-sm text-gray-400">{item.quantity} {item.unit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
