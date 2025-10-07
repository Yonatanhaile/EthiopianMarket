import { useTranslation } from 'react-i18next';

function FilterBar({ filters, onFilterChange }) {
  const { t } = useTranslation();

  const categories = [
    'electronics', 'vehicles', 'realestate', 'fashion', 
    'home', 'services', 'jobs', 'other'
  ];

  const regions = [
    'addisababa', 'oromia', 'amhara', 'tigray', 
    'somali', 'afar', 'sidama', 'snnpr', 'other'
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <h3 className="font-semibold text-gray-900">{t('common.filter')}</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('common.category')}
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="input-field"
        >
          <option value="">{t('common.viewAll')}</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {t(`categories.${cat}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('common.region')}
        </label>
        <select
          value={filters.region || ''}
          onChange={(e) => onFilterChange({ ...filters, region: e.target.value })}
          className="input-field"
        >
          <option value="">{t('common.viewAll')}</option>
          {regions.map(reg => (
            <option key={reg} value={reg}>
              {t(`regions.${reg}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;

