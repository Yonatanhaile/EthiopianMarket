import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useDataMode } from '../contexts/DataModeContext';

function Header() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const { isLowDataMode, toggleDataMode } = useDataMode();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">EM</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">
              {t('app.name')}
            </span>
          </Link>

          <nav className="flex items-center space-x-2 md:space-x-4">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors text-sm md:text-base">
              {t('nav.home')}
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors text-sm md:text-base">
                  {t('nav.dashboard')}
                </Link>
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-700">
                  <span>👤</span>
                  <span>{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600 transition-colors text-sm md:text-base"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors text-sm md:text-base">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="bg-primary-600 text-white px-3 py-1 rounded-md hover:bg-primary-700 transition-colors text-sm md:text-base">
                  Register
                </Link>
              </>
            )}
            
            <button
              onClick={toggleLanguage}
              className="px-2 md:px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {i18n.language === 'en' ? 'አማ' : 'EN'}
            </button>

            <button
              onClick={toggleDataMode}
              className={`px-2 md:px-3 py-1 text-sm rounded-md transition-colors ${
                isLowDataMode 
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={t('settings.dataMode')}
            >
              {isLowDataMode ? '📵' : '📶'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

