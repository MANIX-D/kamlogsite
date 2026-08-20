import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import { useOverlay } from '../hooks/useOverlay';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteRequestModal({ isOpen, onClose }: QuoteRequestModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    contact_person: '',
    email: '',
    phone: '',
    company_name: '',
    address: '',
    service_type: '',
    project_description: '',
    budget_range: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useOverlay(isOpen, onClose);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await apiService.submitQuoteRequest(formData);

      setSubmitStatus('success');
      setFormData({
        contact_person: '',
        email: '',
        phone: '',
        company_name: '',
        address: '',
        service_type: '',
        project_description: '',
        budget_range: '',
      });

      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error submitting quote:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-label={t('quote.title')}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92dvh] sm:max-h-[90dvh] overflow-y-auto scroll-contain">
        <div className="sticky top-0 z-10 bg-brand p-4 sm:p-6 flex items-center justify-between gap-3">
          <h2 className="text-fluid-2xl font-bold text-white min-w-0">{t('quote.title')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            aria-label={t('quote.form.cancel')}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* 2 colonnes seulement à partir de 640px : sur un téléphone
              deux champs côte à côte sont inconfortables à remplir */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="contact_person" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('quote.form.name')} *
              </label>
              <input
                type="text"
                id="contact_person"
                required
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1F3878] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="company_name" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('quote.form.company')} *
              </label>
              <input
                type="text"
                id="company_name"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1F3878] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('quote.form.email')} *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1F3878] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('quote.form.phone')} *
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1F3878] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
              Adresse
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1F3878] focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="service_type" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('quote.form.serviceType')} *
              </label>
              <select
                id="service_type"
                required
                value={formData.service_type}
                onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1F3878] focus:outline-none transition-colors"
              >
                <option value="">{t('quote.form.selectService')}</option>
                <option value="logistique">Logistique</option>
                <option value="stockage">Stockage</option>
                <option value="transport">Transport</option>
                <option value="personnalise">Personnalisé</option>
              </select>
            </div>

            <div>
              <label htmlFor="budget_range" className="block text-sm font-semibold text-gray-700 mb-2">
                Budget estimé
              </label>
              <input
                type="text"
                id="budget_range"
                value={formData.budget_range}
                onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                placeholder="Ex: 500 000 - 1 000 000 FCFA"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1F3878] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="project_description" className="block text-sm font-semibold text-gray-700 mb-2">
              {t('quote.form.description')} *
            </label>
            <textarea
              id="project_description"
              required
              rows={5}
              value={formData.project_description}
              onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1F3878] focus:outline-none transition-colors resize-none"
              placeholder={t('quote.form.descriptionPlaceholder')}
            />
          </div>

          {submitStatus === 'success' && (
            <div className="bg-green-50 border-2 border-green-500 text-green-700 px-4 py-3 rounded-lg">
              {t('quote.form.successMessage')}
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg">
              {t('quote.form.errorMessage')}
            </div>
          )}

          {/* Empilés sur mobile (action principale en bas, sous le pouce),
              côte à côte dès 640px */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {t('quote.form.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('quote.form.submitting') : t('quote.form.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
