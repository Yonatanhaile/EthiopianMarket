import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useListings } from '../hooks/useListings';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import ListingCard from '../components/ListingCard';

function CategoryResults() {
  const { category } = useParams();
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ category, search: '', region: '' });

  const { data, isLoading } = useListings(filters);

  const handleSearch = (query) => {
    setFilters({ ...filters, search: query });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t(`categories.${category}`)}
        </h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FilterBar filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card">
                  <div className="skeleton aspect-video" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-6 w-3/4" />
                    <div className="skeleton h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {data && data.data.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-600">{t('common.noResults')}</p>
            </div>
          )}

          {data && data.data.length > 0 && (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {data.total} results
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.data.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryResults;

