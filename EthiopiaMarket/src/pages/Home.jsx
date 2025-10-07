import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useListings } from '../hooks/useListings';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, isLoading, error } = useListings({ search: searchQuery });

  const categories = [
    { id: 'electronics', icon: '📱', color: 'bg-blue-100 text-blue-600' },
    { id: 'vehicles', icon: '🚗', color: 'bg-purple-100 text-purple-600' },
    { id: 'realestate', icon: '🏠', color: 'bg-green-100 text-green-600' },
    { id: 'fashion', icon: '👕', color: 'bg-pink-100 text-pink-600' },
    { id: 'home', icon: '🛋️', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'services', icon: '🔧', color: 'bg-indigo-100 text-indigo-600' },
    { id: 'jobs', icon: '💼', color: 'bg-red-100 text-red-600' },
    { id: 'other', icon: '📦', color: 'bg-gray-100 text-gray-600' },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {t('app.name')}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('app.tagline')}
        </p>
        
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <Link
          to="/dashboard/create"
          className="btn-primary inline-block"
        >
          + {t('dashboard.createListing')}
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t('nav.categories')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className={`${category.color} p-6 rounded-lg hover:shadow-md transition-shadow text-center`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="font-medium">{t(`categories.${category.id}`)}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Listings */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery ? t('common.search') + ': ' + searchQuery : 'Recent Listings'}
          </h2>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card">
                <div className="skeleton aspect-video" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-6 w-3/4" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-600">
            Error loading listings: {error.message}
          </div>
        )}

        {data && data.data.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600">{t('common.noResults')}</p>
          </div>
        )}

        {data && data.data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((listing) => (
              <ListingCard key={listing.id || listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

