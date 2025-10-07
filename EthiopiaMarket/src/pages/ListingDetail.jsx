import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useListing } from '../hooks/useListings';
import { useDataMode } from '../contexts/DataModeContext';
import ContactButtons from '../components/ContactButtons';
import LazyImage from '../components/LazyImage';

function ListingDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data, isLoading, error } = useListing(id);
  const { isLowDataMode } = useDataMode();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-8 w-1/4 mb-4" />
          <div className="skeleton aspect-video mb-6" />
          <div className="space-y-3">
            <div className="skeleton h-6 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">❌</div>
        <p className="text-xl text-gray-600">Listing not found</p>
        <Link to="/" className="btn-primary mt-6 inline-block">
          {t('common.back')}
        </Link>
      </div>
    );
  }

  const listing = data.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← {t('common.back')}
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Images */}
          {!isLowDataMode && listing.images && listing.images.length > 0 && (
            <div className="aspect-video relative">
              <LazyImage
                src={listing.images[0].url || listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Title and Meta */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {listing.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>{t(`regions.${listing.region}`)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>📂</span>
                  <span>{t(`categories.${listing.category}`)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>👁️</span>
                  <span>{listing.views} {t('listing.views')}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>📅</span>
                  <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {t('listing.description')}
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {listing.longDescription}
              </p>
            </div>

            {/* Seller Info */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {t('listing.postedBy')}
              </h2>
              <Link
                to={`/seller/${listing.seller?._id || listing.seller?.id || listing.seller}`}
                className="flex items-center space-x-3 hover:bg-gray-50 p-3 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{listing.seller?.name || 'Unknown Seller'}</div>
                  <div className="text-sm text-gray-600">View profile →</div>
                </div>
              </Link>
            </div>

            {/* Contact Methods */}
            <ContactButtons contactMethods={listing.contactMethods} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;

