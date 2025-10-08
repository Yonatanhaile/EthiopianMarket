import { useState } from 'react';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Image navigation functions
  const nextImage = () => {
    if (listing.images && listing.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const prevImage = () => {
    if (listing.images && listing.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← {t('common.back')}
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Images Carousel */}
          {!isLowDataMode && listing.images && listing.images.length > 0 && (
            <div className="space-y-3">
              {/* Main Image Display */}
              <div className="aspect-video relative bg-gray-100">
                <LazyImage
                  src={listing.images[currentImageIndex].url || listing.images[currentImageIndex]}
                  alt={`${listing.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                
                {/* Navigation Arrows - Only show if more than 1 image */}
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                      aria-label="Previous image"
                    >
                      <span className="text-2xl">←</span>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                      aria-label="Next image"
                    >
                      <span className="text-2xl">→</span>
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {currentImageIndex + 1} / {listing.images.length}
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnail Navigation - Only show if more than 1 image */}
              {listing.images.length > 1 && (
                <div className="px-4 pb-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-primary-600 ring-2 ring-primary-300' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={image.url || image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
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

