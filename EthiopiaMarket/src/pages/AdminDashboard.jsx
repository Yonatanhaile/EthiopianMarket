import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  useAdminStats, 
  usePendingListings, 
  useApproveListing, 
  useRejectListing 
} from '../hooks/useListings';

function AdminDashboard() {
  const { t } = useTranslation();
  const [selectedListing, setSelectedListing] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: pendingData, isLoading: pendingLoading, error: pendingError } = usePendingListings();
  const approveMutation = useApproveListing();
  const rejectMutation = useRejectListing();

  // Debug logging
  console.log('AdminDashboard - Stats:', stats);
  console.log('AdminDashboard - Stats Error:', statsError);
  console.log('AdminDashboard - Pending Data:', pendingData);
  console.log('AdminDashboard - Pending Error:', pendingError);

  const handleApprove = async (listingId, title) => {
    if (window.confirm(`Approve listing: "${title}"?`)) {
      try {
        await approveMutation.mutateAsync(listingId);
        alert('Listing approved successfully!');
      } catch (error) {
        alert('Failed to approve listing: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handleReject = async (listingId, title) => {
    const reason = prompt(`Reject listing: "${title}"\n\nPlease provide a reason (optional):`);
    if (reason !== null) {
      try {
        await rejectMutation.mutateAsync({ id: listingId, reason });
        alert('Listing rejected successfully!');
      } catch (error) {
        alert('Failed to reject listing: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-2">📦</div>
          <div className="text-2xl font-bold text-gray-900">
            {statsLoading ? '...' : stats?.data?.listings?.total || 0}
          </div>
          <div className="text-sm text-gray-600">Total Listings</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-2">⏳</div>
          <div className="text-2xl font-bold text-orange-600">
            {statsLoading ? '...' : stats?.data?.listings?.pending || 0}
          </div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">
            {statsLoading ? '...' : stats?.data?.listings?.active || 0}
          </div>
          <div className="text-sm text-gray-600">Active Listings</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-2xl font-bold text-gray-900">
            {statsLoading ? '...' : stats?.data?.users?.total || 0}
          </div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
      </div>

      {/* Pending Review Listings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Pending Listings - Awaiting Approval
        </h2>
        
        {pendingLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-32 w-full" />
            ))}
          </div>
        ) : pendingData?.data && pendingData.data.length > 0 ? (
          <div className="space-y-4">
            {pendingData.data.map((listing) => {
              const listingId = listing.id || listing._id;
              return (
                <div 
                  key={listingId} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    {listing.images && listing.images.length > 0 && (
                      <div className="w-full md:w-48 h-32 flex-shrink-0">
                        <img
                          src={listing.images[0].url || listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {listing.shortDescription}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Category:</span>{' '}
                          <span className="text-gray-600">{listing.category}</span>
                        </div>
                        <div>
                          <span className="font-medium">Region:</span>{' '}
                          <span className="text-gray-600">{listing.region}</span>
                        </div>
                        <div>
                          <span className="font-medium">Seller:</span>{' '}
                          <span className="text-gray-600">
                            {listing.seller?.name || 'Unknown'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span>{' '}
                          <span className="text-gray-600">
                            {new Date(listing.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {listing.contactMethods && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Contact:</span>{' '}
                          <span className="text-gray-600">
                            {listing.contactMethods.phone || listing.contactMethods.email || 'N/A'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex md:flex-col gap-2 justify-end">
                      <button
                        onClick={() => handleApprove(listingId, listing.title)}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleReject(listingId, listing.title)}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-xl text-gray-600">No pending listings</p>
            <p className="text-sm text-gray-500 mt-2">All listings have been reviewed</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

