import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useUserListings, useDeleteListing } from '../hooks/useListings';
import ListingCard from '../components/ListingCard';

function SellerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Debug logging
  console.log('SellerDashboard - User:', user);
  console.log('SellerDashboard - User ID:', user?.id || user?._id);
  
  const userId = user?.id || user?._id;
  const { data, isLoading, error } = useUserListings(userId);
  const deleteListingMutation = useDeleteListing();

  // Debug logging for data
  console.log('SellerDashboard - Data:', data);
  console.log('SellerDashboard - Loading:', isLoading);
  console.log('SellerDashboard - Error:', error);

  const handleDelete = async (listingId, listingTitle) => {
    if (window.confirm(`Are you sure you want to delete "${listingTitle}"? This action cannot be undone.`)) {
      try {
        await deleteListingMutation.mutateAsync(listingId);
        alert('Listing deleted successfully!');
      } catch (error) {
        alert('Failed to delete listing. Please try again.');
      }
    }
  };

  const pendingCount = data?.data?.filter(l => l.status === 'pending').length || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {t('nav.dashboard')}
        </h1>

        {/* Pending Approval Notice */}
        {pendingCount > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-orange-800">
                  <strong>Pending Approval:</strong> You have {pendingCount} listing{pendingCount > 1 ? 's' : ''} waiting for admin approval. 
                  They will be visible to buyers once approved.
                </p>
              </div>
            </div>
          </div>
        )}

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
              const statusColors = {
                pending: 'bg-orange-100 text-orange-800',
                active: 'bg-green-100 text-green-800',
                rejected: 'bg-red-100 text-red-800',
                expired: 'bg-gray-100 text-gray-800',
                sold: 'bg-blue-100 text-blue-800'
              };
              const statusEmojis = {
                pending: '⏳',
                active: '✅',
                rejected: '❌',
                expired: '⏰',
                sold: '🎉'
              };
              return (
                <div key={listingId} className="relative">
                  <ListingCard listing={listing} />
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[listing.status] || 'bg-gray-100 text-gray-800'}`}>
                      {statusEmojis[listing.status] || '📦'} {listing.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Link
                      to={`/dashboard/edit/${listingId}`}
                      className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                      title="Edit listing"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => handleDelete(listingId, listing.title)}
                      disabled={deleteListingMutation.isPending}
                      className="bg-white rounded-full p-2 shadow-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete listing"
                    >
                      🗑️
                    </button>
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

