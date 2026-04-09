import { Link } from 'react-router-dom';

const categoryColors = {
  breakfast: 'bg-yellow-100 text-yellow-700',
  lunch: 'bg-blue-100 text-blue-700',
  dinner: 'bg-purple-100 text-purple-700',
  snack: 'bg-orange-100 text-orange-700',
};

export default function RecipeCard({ recipe, onAddToPlanner }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
      <Link to={`/recipes/${recipe.id}`}>
        <div className="aspect-video bg-stone-100 overflow-hidden">
          <img
            src={recipe.image_url || 'https://placehold.co/400x225?text=Recipe'}
            alt={recipe.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-4">
        {recipe.category && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[recipe.category] || 'bg-gray-100 text-gray-600'}`}>
            {recipe.category}
          </span>
        )}
        <Link to={`/recipes/${recipe.id}`}>
          <h3 className="font-semibold mt-2 hover:text-green-700 transition">{recipe.title}</h3>
        </Link>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{recipe.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-3 text-xs text-gray-400">
            {recipe.prep_time && <span>⏱ {recipe.prep_time}m prep</span>}
            {recipe.cook_time && <span>🔥 {recipe.cook_time}m cook</span>}
          </div>
          {onAddToPlanner && (
            <button
              onClick={() => onAddToPlanner(recipe)}
              className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-2.5 py-1 rounded-lg transition"
            >
              + Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
