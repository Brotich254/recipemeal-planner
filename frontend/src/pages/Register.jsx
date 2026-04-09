import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.user);
      navigate('/');
    } catch {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white border border-stone-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full name" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />
          <input type="email" placeholder="Email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />
          <input type="password" placeholder="Password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition">
            {loading ? 'Creating...' : 'Sign up'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Have an account? <Link to="/login" className="text-green-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
