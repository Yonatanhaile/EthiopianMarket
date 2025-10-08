import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  useAdminStats, 
  usePendingListings, 
  useApproveListing, 
  useRejectListing,
  useListings,
  useDeleteListing
} from '../hooks/useListings';

function AdminDashboard() {
  const { t } = useTranslation();
  const [selectedListing, setSelectedListing] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showAllListings, setShowAllListings] = useState(false);
  
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: pendingData, isLoading: pendingLoading, error: pendingError } = usePendingListings();
  const { data: allListings, isLoading: allListingsLoading } = useListings({ limit: 100 });
  const approveMutation = useApproveListing();
  const rejectMutation = useRejectListing();
  const deleteMutation = useDeleteListing();

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

  const handleDeleteListing = async (listingId, title, status) => {
    try {
      await deleteMutation.mutateAsync(listingId);
      alert(`✅ "${title}" deleted successfully!`);
    } catch (error) {
      alert('❌ Failed to delete listing: ' + (error.message || 'Unknown error'));
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

      {/* All Listings Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            All Listings Management
          </h2>
          <button
            onClick={() => setShowAllListings(!showAllListings)}
            className="btn-outline"
          >
            {showAllListings ? '▲ Hide' : '▼ Show All Listings'}
          </button>
        </div>

        {showAllListings && (
          <>
            {allListingsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-32 w-full" />
                ))}
              </div>
            ) : allListings?.data && allListings.data.length > 0 ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Total: {allListings.total} listings | Showing: {allListings.data.length}
                </p>
                <div className="space-y-3">
                  {allListings.data.map((listing) => {
                    const listingId = listing.id || listing._id;
                    const statusColors = {
                      pending: 'bg-orange-100 text-orange-800',
                      active: 'bg-green-100 text-green-800',
                      rejected: 'bg-red-100 text-red-800',
                      expired: 'bg-gray-100 text-gray-800',
                      sold: 'bg-blue-100 text-blue-800'
                    };
                    return (
                      <div
                        key={listingId}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {listing.title}
                              </h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[listing.status] || 'bg-gray-100 text-gray-800'}`}>
                                {listing.status?.toUpperCase() || 'UNKNOWN'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>
                                <span className="font-medium">Category:</span> {listing.category} | 
                                <span className="font-medium"> Region:</span> {listing.region}
                              </div>
                              <div>
                                <span className="font-medium">Seller:</span> {listing.seller?.name || 'Unknown'} | 
                                <span className="font-medium"> Views:</span> {listing.views || 0}
                              </div>
                              <div>
                                <span className="font-medium">Created:</span> {new Date(listing.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {listing.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(listingId, listing.title)}
                                  disabled={approveMutation.isPending || rejectMutation.isPending || deleteMutation.isPending}
                                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                                  title="Approve"
                                >
                                  ✅
                                </button>
                                <button
                                  onClick={() => handleReject(listingId, listing.title)}
                                  disabled={approveMutation.isPending || rejectMutation.isPending || deleteMutation.isPending}
                                  className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors disabled:opacity-50"
                                  title="Reject"
                                >
                                  ❌
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteListing(listingId, listing.title, listing.status)}
                              disabled={approveMutation.isPending || rejectMutation.isPending || deleteMutation.isPending}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                              title="Delete Permanently"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No listings found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

