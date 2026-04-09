import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-green-700">🥗 MealCraft</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-gray-600 hover:text-green-700">Recipes</Link>
          {user && (
            <>
              <Link to="/planner" className="text-gray-600 hover:text-green-700">Planner</Link>
              <Link to="/shopping-list" className="text-gray-600 hover:text-green-700">Shopping List</Link>
              <Link to="/recipes/new" className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition">+ Recipe</Link>
              <button onClick={logout} className="text-gray-400 hover:text-red-500 transition">Logout</button>
            </>
          )}
          {!user && (
            <Link to="/login" className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
