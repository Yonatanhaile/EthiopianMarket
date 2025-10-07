import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDataMode } from '../contexts/DataModeContext';
import LazyImage from './LazyImage';

function ListingCard({ listing }) {
  const { t } = useTranslation();
  const { isLowDataMode } = useDataMode();

  return (
    <Link to={`/listing/${listing.id}`} className="card hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        {!isLowDataMode && listing.images?.[0] ? (
          <LazyImage 
            src={listing.images[0]} 
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="image-placeholder w-full h-full">
            <span className="text-sm">{t('listing.images')}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
          {listing.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {listing.shortDescription}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <span>📍</span>
            <span>{t(`regions.${listing.region}`)}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>👁️</span>
            <span>{listing.views} {t('listing.views')}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ListingCard;

