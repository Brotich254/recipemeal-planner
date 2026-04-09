import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RecipeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [planForm, setPlanForm] = useState({ date: '', meal_type: 'dinner', servings: 1 });
  const [planning, setPlanning] = useState(false);

  useEffect(() => {
    api.get(`/recipes/${id}`).then(({ data }) => setRecipe(data));
  }, [id]);

  const handlePlan = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await api.post('/meal_plans', {
        recipe_id: recipe.id,
        planned_date: planForm.date,
        meal_type: planForm.meal_type,
        servings: planForm.servings,
      });
      toast.success('Added to meal plan');
      setPlanning(false);
    } catch {
      toast.error('Failed to add to plan');
    }
  };

  if (!recipe) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 mb-10">
        <img
          src={recipe.image_url || 'https://placehold.co/600x400?text=Recipe'}
          alt={recipe.title}
          className="w-full rounded-2xl object-cover aspect-video"
        />
        <div>
          {recipe.category && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full capitalize">{recipe.category}</span>
          )}
          <h1 className="text-3xl font-bold mt-2">{recipe.title}</h1>
          <p className="text-gray-500 mt-3">{recipe.description}</p>
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            {recipe.prep_time && <span>⏱ {recipe.prep_time}m prep</span>}
            {recipe.cook_time && <span>🔥 {recipe.cook_time}m cook</span>}
            {totalTime > 0 && <span>⏰ {totalTime}m total</span>}
            <span>🍽 {recipe.servings} servings</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">By {recipe.author}</p>

          <button
            onClick={() => setPlanning(!planning)}
            className="mt-6 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition font-semibold"
          >
            + Add to Meal Plan
          </button>

          {planning && (
            <form onSubmit={handlePlan} className="mt-4 bg-stone-50 rounded-xl p-4 space-y-3">
              <input type="date" required value={planForm.date}
                onChange={(e) => setPlanForm({ ...planForm, date: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              <select value={planForm.meal_type}
                onChange={(e) => setPlanForm({ ...planForm, meal_type: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                {['breakfast', 'lunch', 'dinner', 'snack'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input type="number" min="1" value={planForm.servings}
                onChange={(e) => setPlanForm({ ...planForm, servings: e.target.value })}
                placeholder="Servings"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition">
                Confirm
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-bold mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients?.map((ing) => (
              <li key={ing.id} className="flex justify-between text-sm bg-white rounded-lg px-4 py-2.5 border border-stone-100">
                <span>{ing.name}</span>
                <span className="text-gray-400">{ing.quantity} {ing.unit}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Instructions</h2>
          <div className="prose prose-sm text-gray-600 whitespace-pre-line">{recipe.instructions}</div>
        </div>
      </div>
    </div>
  );
}
