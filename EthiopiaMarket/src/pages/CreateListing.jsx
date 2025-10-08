import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCreateListing } from '../hooks/useListings';
import { validateEthiopianPhone } from '../utils/phoneFormat';
import ImageUpload from '../components/ImageUpload';

function CreateListing() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const createListingMutation = useCreateListing();

  const categories = [
    'electronics', 'vehicles', 'realestate', 'fashion', 
    'home', 'services', 'jobs', 'other'
  ];

  const regions = [
    'addisababa', 'oromia', 'amhara', 'tigray', 
    'somali', 'afar', 'sidama', 'snnpr', 'other'
  ];

  const onSubmit = async (data) => {
    // Only submit if we're on the final step
    if (step !== 4) {
      return; // Prevent any submission on non-final steps
    }

    try {
      const listingData = {
        ...data,
        images,
        contactMethods: {
          phone: data.phone || undefined,
          whatsapp: data.whatsapp || undefined,
          telegram: data.telegram || undefined,
          email: data.email || undefined,
        }
      };

      await createListingMutation.mutateAsync(listingData);
      alert('Listing submitted successfully! Your listing is pending admin approval and will be visible once approved.');
      navigate('/dashboard');
    } catch (error) {
      alert(t('create.error'));
    }
  };

  const nextStep = (e) => {
    if (e) {
      e.preventDefault(); // Prevent form submission
    }
    setStep(s => Math.min(s + 1, 4));
  };
  
  const prevStep = (e) => {
    if (e) {
      e.preventDefault(); // Prevent form submission
    }
    setStep(s => Math.max(s - 1, 1));
  };

  // Prevent form submission on Enter key press except on final step
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && step !== 4) {
      e.preventDefault();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('create.title')}
        </h1>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= num ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>{t('create.step1')}</span>
            <span>{t('create.step2')}</span>
            <span>{t('create.step3')}</span>
            <span>{t('create.step4')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="bg-white rounded-lg shadow-md p-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('create.step1')}
              </h2>

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
                  placeholder="iPhone 13 Pro - Like New"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.category')} *
                </label>
                <select
                  {...register('category', { required: t('validation.required') })}
                  className="input-field"
                >
                  <option value="">Select category...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {t(`categories.${cat}`)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.region')} *
                </label>
                <select
                  {...register('region', { required: t('validation.required') })}
                  className="input-field"
                >
                  <option value="">Select region...</option>
                  {regions.map(reg => (
                    <option key={reg} value={reg}>
                      {t(`regions.${reg}`)}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-red-600 text-sm mt-1">{errors.region.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Description */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('create.step2')}
              </h2>

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
                  placeholder="Brief summary (max 100 characters)"
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
                  placeholder="Detailed description of your item..."
                />
                {errors.longDescription && (
                  <p className="text-red-600 text-sm mt-1">{errors.longDescription.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('create.step3')}
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('listing.uploadImages')}
                </label>
                <ImageUpload images={images} onChange={setImages} />
                <p className="text-sm text-gray-500 mt-2">
                  Images are automatically compressed to save bandwidth
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Contact Information */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('create.step4')}
              </h2>

              <p className="text-sm text-gray-600 mb-4">
                Provide at least one contact method
              </p>

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
                  placeholder="+251911234567 or 0911234567"
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
                  placeholder="+251911234567 or 0911234567"
                />
                {errors.whatsapp && (
                  <p className="text-red-600 text-sm mt-1">{errors.whatsapp.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('listing.telegram')}
                </label>
                <input
                  type="text"
                  {...register('telegram')}
                  className="input-field"
                  placeholder="@username"
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
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={(e) => prevStep(e)}
              disabled={step === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← {t('common.back')}
            </button>

            {step === 4 ? (
              <button
                type="submit"
                disabled={createListingMutation.isPending}
                className="btn-primary disabled:opacity-50"
              >
                {createListingMutation.isPending ? t('common.loading') : t('common.submit')}
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => nextStep(e)}
                className="btn-primary"
              >
                Next →
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateListing;

