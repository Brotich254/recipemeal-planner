import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

export default function NewRecipe() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', instructions: '', image_url: '',
    prep_time: '', cook_time: '', servings: 2, category: 'dinner', public: true,
  });
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [loading, setLoading] = useState(false);

  const updateIng = (i, field, val) => {
    setIngredients((prev) => prev.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/recipes', {
        ...form,
        prep_time: form.prep_time || null,
        cook_time: form.cook_time || null,
        ingredients: ingredients.filter((i) => i.name.trim()),
      });
      toast.success('Recipe created');
      navigate(`/recipes/${data.id}`);
    } catch {
      toast.error('Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">New Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input required placeholder="Recipe title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />

        <textarea placeholder="Short description" rows={2} value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />

        <input placeholder="Image URL (optional)" value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <input type="number" placeholder="Prep (min)" value={form.prep_time}
            onChange={(e) => setForm({ ...form, prep_time: e.target.value })}
            className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          <input type="number" placeholder="Cook (min)" value={form.cook_time}
            onChange={(e) => setForm({ ...form, cook_time: e.target.value })}
            className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          <input type="number" placeholder="Servings" value={form.servings}
            onChange={(e) => setForm({ ...form, servings: e.target.value })}
            className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Ingredients */}
        <div>
          <h2 className="font-semibold mb-2">Ingredients</h2>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <input placeholder="Name" value={ing.name} onChange={(e) => updateIng(i, 'name', e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                <input placeholder="Qty" value={ing.quantity} onChange={(e) => updateIng(i, 'quantity', e.target.value)}
                  className="w-20 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                <input placeholder="Unit" value={ing.unit} onChange={(e) => updateIng(i, 'unit', e.target.value)}
                  className="w-20 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                {ingredients.length > 1 && (
                  <button type="button" onClick={() => setIngredients((p) => p.filter((_, idx) => idx !== i))}
                    className="text-red-400 hover:text-red-600 px-1">✕</button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setIngredients((p) => [...p, { name: '', quantity: '', unit: '' }])}
            className="mt-2 text-sm text-green-600 hover:underline">+ Add ingredient</button>
        </div>

        <textarea placeholder="Instructions (step by step)" rows={6} value={form.instructions}
          onChange={(e) => setForm({ ...form, instructions: e.target.value })}
          className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={form.public} onChange={(e) => setForm({ ...form, public: e.target.checked })} />
          Make this recipe public
        </label>

        <button type="submit" disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition">
          {loading ? 'Saving...' : 'Create Recipe'}
        </button>
      </form>
    </div>
  );
}
