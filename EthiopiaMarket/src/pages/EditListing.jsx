import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useListing, useUpdateListing } from '../hooks/useListings';
import { validateEthiopianPhone } from '../utils/phoneFormat';
import ImageUpload from '../components/ImageUpload';

function EditListing() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  
  const { data: listingData, isLoading } = useListing(id);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const updateListingMutation = useUpdateListing();

  const categories = [
    'electronics', 'vehicles', 'realestate', 'fashion', 
    'home', 'services', 'jobs', 'other'
  ];

  const regions = [
    'addisababa', 'oromia', 'amhara', 'tigray', 
    'somali', 'afar', 'sidama', 'snnpr', 'other'
  ];

  useEffect(() => {
    if (listingData?.data) {
      const listing = listingData.data;
      reset({
        title: listing.title,
        category: listing.category,
        region: listing.region,
        shortDescription: listing.shortDescription,
        longDescription: listing.longDescription,
        phone: listing.contactMethods?.phone || '',
        whatsapp: listing.contactMethods?.whatsapp || '',
        telegram: listing.contactMethods?.telegram || '',
        email: listing.contactMethods?.email || '',
      });
      setImages(listing.images || []);
    }
  }, [listingData, reset]);

  const onSubmit = async (data) => {
    try {
      const updatedData = {
        ...data,
        images,
        contactMethods: {
          phone: data.phone || undefined,
          whatsapp: data.whatsapp || undefined,
          telegram: data.telegram || undefined,
          email: data.email || undefined,
        }
      };

      await updateListingMutation.mutateAsync({ id, data: updatedData });
      alert('Listing updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to update listing');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="skeleton h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← {t('common.back')}
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('common.edit')} Listing
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('listing.title')} *
            </label>
            <input
              type="text"
              {...register('title', { 
                required: t('validation.required'),
                minLength: { value: 5, message: t('validation.minLength', { count: 5 }) }
              })}
              className="input-field"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.category')} *
              </label>
              <select
                {...register('category', { required: t('validation.required') })}
                className="input-field"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {t(`categories.${cat}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.region')} *
              </label>
              <select
                {...register('region', { required: t('validation.required') })}
                className="input-field"
              >
                {regions.map(reg => (
                  <option key={reg} value={reg}>
                    {t(`regions.${reg}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('listing.shortDescription')} *
            </label>
            <input
              type="text"
              {...register('shortDescription', { 
                required: t('validation.required'),
                maxLength: { value: 100, message: t('validation.maxLength', { count: 100 }) }
              })}
              className="input-field"
            />
            {errors.shortDescription && (
              <p className="text-red-600 text-sm mt-1">{errors.shortDescription.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('listing.longDescription')} *
            </label>
            <textarea
              {...register('longDescription', { 
                required: t('validation.required'),
                minLength: { value: 20, message: t('validation.minLength', { count: 20 }) }
              })}
              className="input-field min-h-[200px]"
            />
            {errors.longDescription && (
              <p className="text-red-600 text-sm mt-1">{errors.longDescription.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('listing.images')}
            </label>
            <ImageUpload images={images} onChange={setImages} />
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('listing.contactMethods')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('listing.phone')}
                </label>
                <input
                  type="tel"
                  {...register('phone', {
                    validate: (value) => {
                      if (value && !validateEthiopianPhone(value)) {
                        return t('validation.invalidPhone');
                      }
                      return true;
                    }
                  })}
                  className="input-field"
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('listing.whatsapp')}
                </label>
                <input
                  type="tel"
                  {...register('whatsapp', {
                    validate: (value) => {
                      if (value && !validateEthiopianPhone(value)) {
                        return t('validation.invalidPhone');
                      }
                      return true;
                    }
                  })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('listing.telegram')}
                </label>
                <input
                  type="text"
                  {...register('telegram')}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('listing.email')}
                </label>
                <input
                  type="email"
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('validation.invalidEmail')
                    }
                  })}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link to="/dashboard" className="btn-secondary">
              {t('common.cancel')}
            </Link>
            <button
              type="submit"
              disabled={updateListingMutation.isPending}
              className="btn-primary disabled:opacity-50"
            >
              {updateListingMutation.isPending ? t('common.loading') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditListing;

