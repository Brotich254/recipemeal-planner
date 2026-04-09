import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, startOfWeek, addDays } from 'date-fns';
import api from '../api';
import toast from 'react-hot-toast';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function MealPlanner() {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [plans, setPlans] = useState([]);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const start = format(weekStart, 'yyyy-MM-dd');
  const end = format(addDays(weekStart, 6), 'yyyy-MM-dd');

  useEffect(() => {
    api.get('/meal_plans', { params: { start, end } }).then(({ data }) => setPlans(data));
  }, [weekStart]);

  const handleDelete = async (id) => {
    await api.delete(`/meal_plans/${id}`);
    setPlans((prev) => prev.filter((p) => p.id !== id));
    toast.success('Removed from plan');
  };

  const getPlansFor = (date, mealType) =>
    plans.filter((p) => p.planned_date === format(date, 'yyyy-MM-dd') && p.meal_type === mealType);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Weekly Meal Planner</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setWeekStart(addDays(weekStart, -7))}
            className="border rounded-lg px-3 py-1.5 text-sm hover:bg-stone-100 transition">← Prev</button>
          <span className="text-sm text-gray-500">
            {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </span>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))}
            className="border rounded-lg px-3 py-1.5 text-sm hover:bg-stone-100 transition">Next →</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-24 text-left text-xs text-gray-400 font-medium pb-2 pr-3">Meal</th>
              {weekDays.map((day) => (
                <th key={day} className="text-center text-xs font-medium pb-2 px-1">
                  <div className="text-gray-400">{format(day, 'EEE')}</div>
                  <div className={`text-sm mt-0.5 ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'text-green-600 font-bold' : 'text-gray-700'}`}>
                    {format(day, 'd')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEAL_TYPES.map((mealType) => (
              <tr key={mealType} className="border-t border-stone-100">
                <td className="py-2 pr-3 text-xs text-gray-500 capitalize font-medium align-top pt-3">{mealType}</td>
                {weekDays.map((day) => (
                  <td key={day} className="py-2 px-1 align-top min-w-[110px]">
                    <div className="space-y-1">
                      {getPlansFor(day, mealType).map((plan) => (
                        <div key={plan.id} className="bg-green-50 border border-green-100 rounded-lg p-1.5 text-xs group relative">
                          <Link to={`/recipes/${plan.recipe.id}`} className="font-medium text-green-800 hover:underline line-clamp-2">
                            {plan.recipe.title}
                          </Link>
                          <button onClick={() => handleDelete(plan.id)}
                            className="absolute top-1 right-1 text-green-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">✕</button>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-3">
        <Link to="/" className="text-sm text-green-600 hover:underline">Browse recipes to add →</Link>
        <Link to="/shopping-list" className="text-sm text-green-600 hover:underline">Generate shopping list →</Link>
      </div>
    </div>
  );
}
