import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api/mockApi';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await api.loginUser(formData.email, formData.password);
      
      // Save user data and token
      login(response.user, response.token);
      
      // Redirect to home
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || err.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full text-2xl font-bold mb-4">
            EM
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('auth.welcomeBack') || 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {t('auth.loginSubtitle') || 'Login to your account'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email') || 'Email'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password') || 'Password'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (t('common.loading') || 'Logging in...') : (t('auth.login') || 'Login')}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {t('auth.dontHaveAccount') || "Don't have an account?"}{' '}
            <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
              {t('auth.registerHere') || 'Register here'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
