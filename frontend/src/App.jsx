import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import NewRecipe from './pages/NewRecipe';
import MealPlanner from './pages/MealPlanner';
import ShoppingList from './pages/ShoppingList';
import Login from './pages/Login';
import Register from './pages/Register';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipes/new" element={<PrivateRoute><NewRecipe /></PrivateRoute>} />
          <Route path="/planner" element={<PrivateRoute><MealPlanner /></PrivateRoute>} />
          <Route path="/shopping-list" element={<PrivateRoute><ShoppingList /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
