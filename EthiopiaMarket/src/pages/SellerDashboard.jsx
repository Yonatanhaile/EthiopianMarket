import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useUserListings } from '../hooks/useListings';
import ListingCard from '../components/ListingCard';

function SellerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const { data, isLoading } = useUserListings(user?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {t('nav.dashboard')}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-2">📦</div>
            <div className="text-2xl font-bold text-gray-900">{data?.data.length || 0}</div>
            <div className="text-sm text-gray-600">{t('dashboard.totalListings')}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-2">👁️</div>
            <div className="text-2xl font-bold text-gray-900">
              {data?.data.reduce((sum, l) => sum + l.views, 0) || 0}
            </div>
            <div className="text-sm text-gray-600">{t('dashboard.totalViews')}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-2xl font-bold text-gray-900">
              {data?.data.filter(l => l.status === 'active').length || 0}
            </div>
            <div className="text-sm text-gray-600">{t('dashboard.activeListings')}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link to="/dashboard/create" className="btn-primary">
            + {t('dashboard.createListing')}
          </Link>
          <button className="btn-outline">
            💬 {t('dashboard.messages')} (3)
          </button>
        </div>
      </div>

      {/* My Listings */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t('dashboard.myListings')}
        </h2>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
            <p className="text-xl text-gray-600 mb-6">No listings yet</p>
            <Link to="/dashboard/create" className="btn-primary inline-block">
              Create your first listing
            </Link>
          </div>
        )}

        {data && data.data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((listing) => {
              const listingId = listing.id || listing._id;
              return (
                <div key={listingId} className="relative">
                  <ListingCard listing={listing} />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Link
                      to={`/dashboard/edit/${listingId}`}
                      className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                    >
                      ✏️
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerDashboard;

