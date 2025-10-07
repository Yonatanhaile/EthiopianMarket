import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function SearchBar({ onSearch, initialQuery = '' }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('common.search')}
          className="input-field pr-12"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-1 rounded-md hover:bg-primary-700 transition-colors"
        >
          🔍
        </button>
      </div>
    </form>
  );
}

export default SearchBar;

