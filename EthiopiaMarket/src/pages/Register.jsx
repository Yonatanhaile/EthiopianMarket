import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api/mockApi';

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
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

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined
      };

      const response = await api.registerUser(userData);
      
      // Save user data and token
      login(response.user, response.token);
      
      // Redirect to home
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || err.error || 'Failed to register. Please try again.');
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
            {t('auth.createAccount') || 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {t('auth.registerSubtitle') || 'Join Ethiopia Market today'}
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
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.fullName') || 'Full Name'} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Abebe Kebede"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email') || 'Email'} *
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
                {t('auth.password') || 'Password'} *
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
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('auth.passwordRequirement') || 'Must be at least 6 characters'}
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.confirmPassword') || 'Confirm Password'} *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
                required
              />
            </div>

            {/* Phone (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.phone') || 'Phone Number'} ({t('common.optional') || 'Optional'})
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+251911234567 or 0911234567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (t('common.loading') || 'Creating Account...') : (t('auth.createAccount') || 'Create Account')}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {t('auth.alreadyHaveAccount') || 'Already have an account?'}{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
              {t('auth.loginHere') || 'Login here'}
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-gray-500">
          {t('auth.termsAgreement') || 'By continuing, you agree to our Terms of Service and Privacy Policy'}
        </p>
      </div>
    </div>
  );
}
