import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Building2,
  MessageSquare
} from 'lucide-react';
import { apiService } from '../services/api';

export default function ContactPage() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    sujet: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (): boolean => {
    if (!formData.nom.trim()) {
      setError(t('contact.form.validation.name'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('contact.form.validation.email'));
      return false;
    }

    if (!formData.telephone.trim()) {
      setError(t('contact.form.validation.phone'));
      return false;
    }

    if (!formData.sujet) {
      setError(t('contact.form.validation.subject'));
      return false;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setError(t('contact.form.validation.message'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await apiService.submitContactForm(formData);

      setSuccess(true);
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        entreprise: '',
        sujet: '',
        message: ''
      });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('contact.form.error');
      setError(errorMessage);
      console.error('Error sending message:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t('contact.info.phone.title'),
      details: ['+237 694 84 17 28', '+237 686 76 52 06'],
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Mail,
      title: t('contact.info.email.title'),
      details: ['direction@kamlog.co'],
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: MapPin,
      title: t('contact.info.address.title'),
      details: [t('contact.info.address.line1'), t('contact.info.address.line2')],
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Clock,
      title: t('contact.info.hours.title'),
      details: [t('contact.info.hours.weekdays'), t('contact.info.hours.weekend')],
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      <div
        className="relative bg-[#1f3878] text-white h-screen overflow-hidden flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(31, 56, 120, 0.9), rgba(31, 56, 120, 0.9)), url('/images/contact-hero.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className={`text-3xl sm:text-5xl lg:text-7xl font-bold mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'
            }`}
          >
            {t('contact.hero.title')}
          </h1>
          <p
            className={`text-lg sm:text-xl lg:text-3xl text-gray-100 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('contact.form.title')}
              </h2>
              <p className="text-gray-600 text-lg">
                {t('contact.form.subtitle')}
              </p>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 mb-1">
                    {t('contact.form.success.title')}
                  </h4>
                  <p className="text-green-700 text-sm">
                    {t('contact.form.success.message')}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <p className="text-red-800 font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.form.fields.name')} *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1f3878] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={t('contact.form.placeholders.name')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.form.fields.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1f3878] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={t('contact.form.placeholders.email')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.form.fields.phone')} *
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    required
                    value={formData.telephone}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1f3878] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={t('contact.form.placeholders.phone')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.form.fields.company')}
                  </label>
                  <input
                    type="text"
                    name="entreprise"
                    value={formData.entreprise}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1f3878] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={t('contact.form.placeholders.company')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('contact.form.fields.subject')} *
                </label>
                <select
                  name="sujet"
                  required
                  value={formData.sujet}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1f3878] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">{t('contact.form.placeholders.subject')}</option>
                  <option value="transport">{t('contact.form.subjects.transport')}</option>
                  <option value="transit">{t('contact.form.subjects.transit')}</option>
                  <option value="warehouse">{t('contact.form.subjects.warehouse')}</option>
                  <option value="customs">{t('contact.form.subjects.customs')}</option>
                  <option value="quote">{t('contact.form.subjects.quote')}</option>
                  <option value="other">{t('contact.form.subjects.other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('contact.form.fields.message')} *
                </label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  disabled={submitting}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1f3878] focus:outline-none transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder={t('contact.form.placeholders.message')}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-[#1f3878] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#152b5e] transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
                {submitting ? t('contact.form.buttons.sending') : t('contact.form.buttons.send')}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#1f3878] to-[#152b5e] rounded-2xl shadow-xl p-8 text-white">
              <Building2 className="w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-4">
                {t('contact.info.about.title')}
              </h3>
              <p className="text-gray-100 leading-relaxed mb-6">
                {t('contact.info.about.description')}
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle size={18} />
                  </div>
                  <p className="text-gray-100">{t('contact.info.about.point1')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle size={18} />
                  </div>
                  <p className="text-gray-100">{t('contact.info.about.point2')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle size={18} />
                  </div>
                  <p className="text-gray-100">{t('contact.info.about.point3')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <MessageSquare className="w-12 h-12 text-[#1f3878] mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('contact.info.help.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('contact.info.help.description')}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-[#1f3878] rounded-full"></div>
                  <span>{t('contact.info.help.option1')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-[#1f3878] rounded-full"></div>
                  <span>{t('contact.info.help.option2')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-[#1f3878] rounded-full"></div>
                  <span>{t('contact.info.help.option3')}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('contact.info.visit.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('contact.info.visit.description')}
              </p>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">{t('contact.info.visit.note')}</p>
                <p className="font-semibold text-gray-900">+237 694 84 17 28</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('contact.map.title')}
          </h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1990.0!2d9.6905807!3d4.0287418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1061137a591f3fe9%3A0xbc2d798b322cde2f!2sKAMLOG!5e0!3m2!1sfr!2scm"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('contact.map.title')}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
