import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser, useUserListings } from '../hooks/useListings';
import ListingCard from '../components/ListingCard';

function SellerProfile() {
  const { id } = useParams();
  const { t } = useTranslation();
  
  const { data: userData, isLoading: userLoading } = useUser(id);
  const { data: listingsData, isLoading: listingsLoading } = useUserListings(id);

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="skeleton h-32 w-full mb-6" />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">👤</div>
        <p className="text-xl text-gray-600">Seller not found</p>
        <Link to="/" className="btn-primary mt-6 inline-block">
          {t('common.back')}
        </Link>
      </div>
    );
  }

  const user = userData.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
        ← {t('common.back')}
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-5xl">👤</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>📅 Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
              <span>📦 {user.listingsCount} listings</span>
              <span>⭐ {user.rating} rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seller's Listings */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Listings by {user.name}
        </h2>

        {listingsLoading && (
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

        {listingsData && listingsData.data.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600">No listings yet</p>
          </div>
        )}

        {listingsData && listingsData.data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listingsData.data.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerProfile;

