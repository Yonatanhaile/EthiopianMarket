import { useTranslation } from 'react-i18next';
import { useListings } from '../hooks/useListings';

function AdminDashboard() {
  const { t } = useTranslation();
  const { data, isLoading } = useListings();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t('admin.title')}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-2">📦</div>
          <div className="text-2xl font-bold text-gray-900">{data?.total || 0}</div>
          <div className="text-sm text-gray-600">Total Listings</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-2">⏳</div>
          <div className="text-2xl font-bold text-orange-600">2</div>
          <div className="text-sm text-gray-600">{t('admin.pendingReview')}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-2">🚨</div>
          <div className="text-2xl font-bold text-red-600">0</div>
          <div className="text-sm text-gray-600">{t('admin.reportedListings')}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-2xl font-bold text-gray-900">156</div>
          <div className="text-sm text-gray-600">{t('admin.users')}</div>
        </div>
      </div>

      {/* Pending Review Listings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t('admin.pendingReview')}
        </h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton h-24 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {data?.data.slice(0, 2).map((listing) => (
              <div key={listing.id || listing._id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                  <p className="text-sm text-gray-600">{listing.sellerName}</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                    {t('admin.approve')}
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                    {t('admin.reject')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-3 text-gray-600">
            <span>✅</span>
            <span>Listing "iPhone 13 Pro" approved - 2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <span>👤</span>
            <span>New user registered: Abebe Kebede - 3 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <span>📦</span>
            <span>New listing submitted - 5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

