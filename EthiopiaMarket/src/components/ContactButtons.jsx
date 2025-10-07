import { useTranslation } from 'react-i18next';
import { formatPhoneNumber, getWhatsAppLink, getTelegramLink } from '../utils/phoneFormat';

function ContactButtons({ contactMethods }) {
  const { t } = useTranslation();

  if (!contactMethods) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">{t('listing.contactSeller')}</h3>
      
      {contactMethods.phone && (
        <a
          href={`tel:${contactMethods.phone}`}
          className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <span className="text-xl">📞</span>
          <div>
            <div className="text-sm font-medium">{t('listing.phone')}</div>
            <div className="text-sm">{formatPhoneNumber(contactMethods.phone)}</div>
          </div>
        </a>
      )}

      {contactMethods.whatsapp && (
        <a
          href={getWhatsAppLink(contactMethods.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
        >
          <span className="text-xl">💬</span>
          <div>
            <div className="text-sm font-medium">{t('listing.whatsapp')}</div>
            <div className="text-sm">{formatPhoneNumber(contactMethods.whatsapp)}</div>
          </div>
        </a>
      )}

      {contactMethods.telegram && (
        <a
          href={getTelegramLink(contactMethods.telegram)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 p-3 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition-colors"
        >
          <span className="text-xl">✈️</span>
          <div>
            <div className="text-sm font-medium">{t('listing.telegram')}</div>
            <div className="text-sm">{contactMethods.telegram}</div>
          </div>
        </a>
      )}

      {contactMethods.email && (
        <a
          href={`mailto:${contactMethods.email}`}
          className="flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-xl">📧</span>
          <div>
            <div className="text-sm font-medium">{t('listing.email')}</div>
            <div className="text-sm">{contactMethods.email}</div>
          </div>
        </a>
      )}
    </div>
  );
}

export default ContactButtons;

