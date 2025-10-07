import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('app.name')}</h3>
            <p className="text-gray-400 text-sm">{t('app.tagline')}</p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-3">{t('nav.categories')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{t('categories.electronics')}</li>
              <li>{t('categories.vehicles')}</li>
              <li>{t('categories.realestate')}</li>
              <li>{t('categories.fashion')}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-3">{t('settings.language')}</h4>
            <p className="text-gray-400 text-sm">
              English | አማርኛ
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 {t('app.name')}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

