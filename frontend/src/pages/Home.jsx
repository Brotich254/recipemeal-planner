import { useEffect, useState } from 'react';
import api from '../api';
import RecipeCard from '../components/RecipeCard';

const CATEGORIES = ['', 'breakfast', 'lunch', 'dinner', 'snack'];

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      api.get('/recipes', { params: { q: search, category } })
        .then(({ data }) => setRecipes(data))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [search, category]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Discover Recipes</h1>
        <p className="text-gray-500 mt-1">Find, save, and plan your meals for the week.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text" placeholder="Search recipes..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-xl text-sm capitalize transition ${category === cat ? 'bg-green-600 text-white' : 'bg-white border border-stone-200 text-gray-600 hover:border-green-400'}`}
            >
              {cat || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />)}
        </div>
      ) : recipes.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No recipes found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}
    </div>
  );
}
