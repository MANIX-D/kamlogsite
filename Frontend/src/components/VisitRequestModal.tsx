import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Calendar, User, Mail, Phone, Building2, MessageSquare } from 'lucide-react';
import { apiService, Infrastructure } from '../services/api';

interface VisitRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisitRequestModal({ isOpen, onClose }: VisitRequestModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    preferredDate: '',
    preferredTime: '',
    type_visite: 'guidee' as 'guidee' | 'autonome' | 'virtuelle' | 'rencontre',
    infrastructure_id: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [infrastructures, setInfrastructures] = useState<Infrastructure[]>([]);

  useEffect(() => {
    if (isOpen) {
      apiService.getInfrastructures()
        .then(data => setInfrastructures(data))
        .catch(err => console.error('Error loading infrastructures:', err));
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await apiService.submitVisitRequest({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || undefined,
        date: formData.preferredDate,
        heure: formData.preferredTime,
        type_visite: formData.type_visite,
        message: formData.message || undefined,
        infrastructure_id: formData.infrastructure_id ? Number(formData.infrastructure_id) : undefined,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          preferredDate: '',
          preferredTime: '',
          type_visite: 'guidee',
          infrastructure_id: '',
          message: ''
        });
      }, 2000);
    } catch (error) {
      setSubmitError(t('visitRequest.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="relative inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl">
          <div className="absolute top-0 right-0 pt-6 pr-6">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-[#1F3878] to-[#2a4a9f] px-8 py-8">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-3 mr-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">
                  {t('visitRequest.title')}
                </h3>
                <p className="text-blue-100 mt-1">
                  {t('visitRequest.subtitle')}
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{t('visitRequest.success.title')}</h4>
                <p className="text-gray-600">{t('visitRequest.success.message')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      {t('visitRequest.form.name')} {t('visitRequest.form.required')}
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F3878] focus:outline-none transition-colors"
                      placeholder={t('visitRequest.form.namePlaceholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      {t('visitRequest.form.email')} {t('visitRequest.form.required')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F3878] focus:outline-none transition-colors"
                      placeholder={t('visitRequest.form.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      {t('visitRequest.form.phone')} {t('visitRequest.form.required')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F3878] focus:outline-none transition-colors"
                      placeholder={t('visitRequest.form.phonePlaceholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Building2 className="w-4 h-4 inline mr-2" />
                      {t('visitRequest.form.company')}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F3878] focus:outline-none transition-colors"
                      placeholder={t('visitRequest.form.companyPlaceholder')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="preferredDate" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      {t('visitRequest.form.date')} {t('visitRequest.form.required')}
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      required
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F3878] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('visitRequest.form.time')} {t('visitRequest.form.required')}
                    </label>
                    <input
                      type="time"
                      id="preferredTime"
                      name="preferredTime"
                      required
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F3878] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="type_visite" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('visitRequest.form.visitType') || 'Type de visite'} {t('visitRequest.form.required')}
                    </label>
                    <select
                      id="type_visite"
                      name="type_visite"
                      required
                      value={formData.type_visite}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F3878] focus:outline-none transition-colors"
                    >
                      <option value="guidee">{t('visitRequest.form.visitTypeOptions.guided') || 'Visite guidée'}</option>
                      <option value="autonome">{t('visitRequest.form.visitTypeOptions.autonomous') || 'Visite autonome'}</option>
                      <option value="virtuelle">{t('visitRequest.form.visitTypeOptions.virtual') || 'Visite virtuelle'}</option>
                      <option value="rencontre">{t('visitRequest.form.visitTypeOptions.meeting') || 'Rencontre'}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="infrastructure" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('visitRequest.form.infrastructure')}
                    </label>
                    <select
                      id="infrastructure_id"
                      name="infrastructure_id"
                      value={formData.infrastructure_id}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F3878] focus:outline-none transition-colors"
                    >
                      <option value="">{t('visitRequest.form.infrastructureOptions.select')}</option>
                      {infrastructures.map(infra => (
                        <option key={infra.id} value={infra.id}>
                          {t('lang') === 'en' ? infra.nom_en : infra.nom_fr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    {t('visitRequest.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F3878] focus:outline-none transition-colors resize-none"
                    placeholder={t('visitRequest.form.messagePlaceholder')}
                  ></textarea>
                </div>

                {submitError && (
                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                    <p className="text-red-800">{submitError}</p>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    {t('visitRequest.form.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                  >
                    {isSubmitting ? t('visitRequest.form.submitting') : t('visitRequest.form.submit')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
