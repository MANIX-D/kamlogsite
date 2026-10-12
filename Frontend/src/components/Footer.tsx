import { Facebook, Linkedin, Phone, Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await apiService.subscribeNewsletter({ email });
      setMessage({ type: 'success', text: t('footer.newsletter.success') });
      setEmail('');
    } catch (error) {
      setMessage({ type: 'error', text: t('footer.newsletter.error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="w-full">
      <div className="bg-gradient-to-b from-gray-50 via-white to-gray-50 py-10 sm:py-16">
        <div className="container-page flex justify-center">
          <img
            src="/images/New_Logo_KAMLOG_sans_bg_(1).png"
            alt="KAMLOG - Logistique Intégrée"
            className="h-16 xs:h-20 sm:h-28 w-auto object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      <div
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(20, 40, 90, 0.92), rgba(15, 30, 70, 0.95)), url('/images/hero-kamlog-port.webp')`,
        }}
      >
        <div className="container-page py-10 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-16">
            <div>
              <h3 className="text-fluid-lg font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider border-b-2 border-red-500 pb-2 inline-block">
                {t('footer.quick.links')}
              </h3>
              <nav className="space-y-3 mt-6">
                <Link
                  to="/"
                  className="flex items-center text-gray-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-base group"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 group-hover:w-3 transition-all duration-300"></span>
                  {t('nav.home')}
                </Link>
                <Link
                  to="/about"
                  className="flex items-center text-gray-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-base group"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 group-hover:w-3 transition-all duration-300"></span>
                  {t('nav.about')}
                </Link>
                <Link
                  to="/services"
                  className="flex items-center text-gray-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-base group"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 group-hover:w-3 transition-all duration-300"></span>
                  {t('nav.services')}
                </Link>
                <Link
                  to="/infrastructures"
                  className="flex items-center text-gray-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-base group"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 group-hover:w-3 transition-all duration-300"></span>
                  {t('nav.infrastructures')}
                </Link>
                <Link
                  to="/partners"
                  className="flex items-center text-gray-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-base group"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 group-hover:w-3 transition-all duration-300"></span>
                  {t('nav.partners')}
                </Link>
                <Link
                  to="/news"
                  className="flex items-center text-gray-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-base group"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 group-hover:w-3 transition-all duration-300"></span>
                  {t('nav.news')}
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center text-gray-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-base group"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 group-hover:w-3 transition-all duration-300"></span>
                  {t('nav.contact')}
                </Link>
              </nav>
            </div>

            <div>
              <h3 className="text-fluid-lg font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider border-b-2 border-red-500 pb-2 inline-block">
                {t('footer.follow')}
              </h3>
              <div className="space-y-4 mt-6">
                <a
                  href="https://www.facebook.com/share/1DeEaTNJQn/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-gray-200 hover:text-white transition-all duration-300 group"
                  aria-label="Facebook KAMLOG"
                >
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                    <Facebook size={22} className="text-white" />
                  </div>
                  <span className="text-base font-medium">Facebook</span>
                </a>
                <a
                  href="http://linkedin.com/company/kamlog-sarl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-gray-200 hover:text-white transition-all duration-300 group"
                  aria-label="LinkedIn KAMLOG"
                >
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                    <Linkedin size={22} className="text-white" />
                  </div>
                  <span className="text-base font-medium">LinkedIn</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-fluid-lg font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider border-b-2 border-red-500 pb-2 inline-block">
                Contact
              </h3>
              <div className="space-y-4 mt-6">
                <a
                  href="tel:+237694841728"
                  className="flex items-start gap-3 text-gray-200 hover:text-white transition-colors duration-300 group"
                >
                  <Phone size={18} className="mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm">+237 694 84 17 28</span>
                </a>
                <a
                  href="mailto:direction@kamlog.co"
                  className="flex items-start gap-3 text-gray-200 hover:text-white transition-colors duration-300 group break-all"
                >
                  <Mail size={18} className="mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm">direction@kamlog.co</span>
                </a>
                <div className="flex items-start gap-3 text-gray-200">
                  <MapPin size={18} className="mt-1 flex-shrink-0" />
                  <span className="text-sm">{t('footer.address.value')}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-fluid-lg font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider border-b-2 border-red-500 pb-2 inline-block">
                {t('footer.newsletter.title')}
              </h3>
              <p className="text-gray-200 mb-5 text-sm leading-relaxed mt-6">
                {t('footer.newsletter.text')}
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer.newsletter.placeholder')}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 text-sm disabled:opacity-60"
                  />
                  <Send size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                </div>
                {message && (
                  <p className={`text-xs font-medium ${message.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                    {message.text}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('footer.newsletter.submitting') : t('footer.newsletter.submit')}
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 sm:pt-8">
            <div className="text-center space-y-2">
              <p className="text-gray-400 text-sm font-medium tracking-wide">
                © {new Date().getFullYear()} KAMLOG. {t('footer.rights')}
              </p>
              <p className="text-gray-500 text-xs">
                Powered By <a href="mailto:Toyotamnx@gmail.com" className="text-gray-400 hover:text-white underline underline-offset-2 transition-colors duration-300">Toyotamnx@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
