import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import QuoteRequestModal from '../components/QuoteRequestModal';

export default function ServicesPage() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);



  return (
    <div className="min-h-screen bg-white">
      <section
        className="relative w-full min-h-dvh bg-cover bg-center pt-16 sm:pt-20 pb-12 overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(31, 56, 120, 0.75), rgba(31, 56, 120, 0.75)), url('/images/services-hero.webp')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none"></div>
        <div className="container-page text-center relative z-10">
          <h1
            className={`text-fluid-5xl font-extrabold text-white mb-6 sm:mb-8 tracking-tight leading-[1.1] transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'
            }`}
          >
            {t('services.page.title')}
          </h1>
          <p
            className={`text-fluid-xl text-gray-100 font-light max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            {t('services.page.subtitle')}
          </p>
        </div>
      </section>

      <div className="container-page py-12 sm:py-24">
        <div className="mt-12 sm:mt-24 bg-white rounded-2xl sm:rounded-3xl shadow-xl ring-1 ring-black/5 p-6 sm:p-8 lg:p-12 transform hover:scale-[1.01] transition-all duration-500">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-[#1F3878] rounded-full shadow-lg shadow-[#1F3878]/20">
              <span className="text-white font-semibold text-sm tracking-wider">{t('servicesDetailed.handling.tag')}</span>
            </div>
            <h2 className="text-fluid-4xl font-extrabold text-[#1F3878] mb-6 tracking-tight">
              {t('servicesDetailed.handling.title')}
            </h2>
            <div className="w-32 h-1.5 shimmer-line rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-10 sm:mb-16">
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 transform hover:scale-105 transition-all duration-500">
                <img
                  src="/images/services-manutention1.webp"
                  alt="Manutention portuaire"
                  loading="lazy"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 transform hover:scale-105 transition-all duration-500">
                <img
                  src="/images/services-port.webp"
                  alt="Port et navire"
                  loading="lazy"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="text-fluid-3xl font-bold text-[#1F3878] mb-6 leading-tight">
                {t('servicesDetailed.handling.heading')}
              </h3>
              <div className="w-24 h-1 bg-red-600 mb-6"></div>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {t('servicesDetailed.handling.description')}
              </p>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 sm:p-8 border-l-4 border-brand">
                <h4 className="text-fluid-2xl font-bold text-[#1F3878] mb-4 flex items-center">
                  <svg className="w-8 h-8 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg>
                  {t('servicesDetailed.handling.services.title')}
                </h4>
                <ul className="space-y-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <li key={i} className="flex items-start text-gray-800 text-lg">
                      <svg className="w-6 h-6 text-[#1F3878] mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>{t(`servicesDetailed.handling.services.item${i}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-5 sm:p-8 border-l-4 border-red-600">
              <h4 className="text-fluid-2xl font-bold text-[#1F3878] mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                {t('servicesDetailed.handling.benefits.title')}
              </h4>
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="flex items-start text-gray-800 text-lg">
                    <svg className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>{t(`servicesDetailed.handling.benefits.item${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src="/images/services-chariot.webp"
                alt="Entrepôt stockage"
                loading="lazy"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-20 rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-white/10 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1F3878, #152555)' }}>
          <div className="p-6 sm:p-8 lg:p-12 text-white">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-fluid-4xl font-extrabold mb-4 tracking-tight">
                {t('servicesDetailed.warehouse.title')}
              </h2>
              <div className="w-48 sm:w-72 lg:w-96 h-1 shimmer-line rounded-full mx-auto"></div>
            </div>

            <h3 className="text-fluid-2xl font-bold mb-6 text-center">
              {t('servicesDetailed.warehouse.heading')}
            </h3>

            <p className="text-base leading-relaxed mb-8 text-blue-50">
              {t('servicesDetailed.warehouse.description')}
            </p>

            <ul className="space-y-4 mb-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <li key={i} className="flex items-start text-base">
                  <span className="mr-3 mt-1">•</span>
                  <span dangerouslySetInnerHTML={{ __html: t(`servicesDetailed.warehouse.features.item${i}`) }} />
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10">
                <img
                  src="/images/services-entrepot1.webp"
                  alt="Entrepôt vue aérienne"
                  loading="lazy"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10">
                <img
                  src="/images/services-entrepot2.webp"
                  alt="Intérieur entrepôt"
                  loading="lazy"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10">
                <img
                  src="/images/services-entrepot3.webp"
                  alt="Entrepôt stockage"
                  loading="lazy"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-24 bg-white rounded-2xl sm:rounded-3xl shadow-xl ring-1 ring-black/5 p-6 sm:p-8 lg:p-12 transform hover:scale-[1.01] transition-all duration-500">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-red-600 rounded-full shadow-lg shadow-red-600/20">
              <span className="text-white font-semibold text-sm tracking-wider">{t('servicesDetailed.customs.tag')}</span>
            </div>
            <h2 className="text-fluid-4xl font-extrabold text-[#1F3878] mb-6 tracking-tight">
              {t('servicesDetailed.customs.title')}
            </h2>
            <div className="w-32 h-1.5 shimmer-line rounded-full mx-auto"></div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 sm:p-8 lg:p-10 mb-10 sm:mb-16">
            <h3 className="text-fluid-3xl font-bold text-[#1F3878] mb-6 text-center">
              {t('servicesDetailed.customs.heading')}
            </h3>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
            <p className="text-gray-700 text-lg leading-relaxed text-center max-w-4xl mx-auto">
              {t('servicesDetailed.customs.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-10 sm:mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-colors duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-[#1F3878] rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                  </svg>
                </div>
                <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1F3878]">
                  {t('servicesDetailed.customs.import.title')}
                </h4>
              </div>
              <div className="w-16 h-1 bg-red-600 mb-6"></div>
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <li key={i} className="flex items-start text-gray-800 text-lg">
                    <svg className="w-6 h-6 text-[#1F3878] mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>{t(`servicesDetailed.customs.import.item${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src="/images/services-import.webp"
                alt="Transit et import"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src="/images/services-export.webp"
                alt="Export maritime"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 border-2 border-red-200 hover:border-red-400 transition-colors duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-red-600 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                  </svg>
                </div>
                <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1F3878]">
                  {t('servicesDetailed.customs.export.title')}
                </h4>
              </div>
              <div className="w-16 h-1 bg-red-600 mb-6"></div>
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <li key={i} className="flex items-start text-gray-800 text-lg">
                    <svg className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>{t(`servicesDetailed.customs.export.item${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-20 relative rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-white/10 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1F3878, #152555)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0 lg:min-h-[700px]">
            <div className="p-6 sm:p-10 lg:p-16 text-white relative z-10">
              <h2 className="text-fluid-4xl font-extrabold mb-2 tracking-tight">
                {t('servicesDetailed.containers.title')}
              </h2>
              <div className="w-32 h-1 shimmer-line rounded-full mb-12"></div>

              <h3 className="text-fluid-2xl font-bold mb-4">
                {t('servicesDetailed.containers.heading')}
              </h3>
              <p className="text-base leading-relaxed mb-6 text-blue-50">
                {t('servicesDetailed.containers.description')}
              </p>
              <div className="w-full sm:w-80 h-px bg-red-600 mb-10"></div>

              <div className="mb-12">
                <h4 className="text-fluid-2xl font-bold mb-3">
                  {t('servicesDetailed.containers.benefits.title')}
                </h4>
                <div className="w-16 h-1 bg-red-600 mb-4"></div>
                <ul className="space-y-3">
                  <li className="flex items-start text-base">
                    <span className="mr-3">•</span>
                    <span>{t('servicesDetailed.containers.benefits.item1')}</span>
                  </li>
                  <li className="flex items-start text-base">
                    <span className="mr-3">•</span>
                    <span>{t('servicesDetailed.containers.benefits.item2')}</span>
                  </li>
                  <li className="flex items-start text-base">
                    <span className="mr-3">•</span>
                    <span>{t('servicesDetailed.containers.benefits.item3')}</span>
                  </li>
                  <li className="flex items-start text-base">
                    <span className="mr-3">•</span>
                    <span>{t('servicesDetailed.containers.benefits.item4')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-fluid-2xl font-bold mb-3">
                  {t('servicesDetailed.containers.capacity.title')}
                </h4>
                <div className="w-16 h-1 bg-red-600 mb-4"></div>
                <ul className="space-y-3">
                  <li className="flex items-start text-base">
                    <span className="mr-3">•</span>
                    <span>{t('servicesDetailed.containers.capacity.item1')}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden lg:overflow-visible">
              {/* Cercle décoratif : dimensionné progressivement. À 1024px un
                  cercle de 950px était disproportionné face à la colonne. */}
              <div className="relative lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 w-full h-64 sm:h-80 lg:w-[680px] lg:h-[680px] xl:w-[950px] xl:h-[950px]">
                <div className="lg:absolute lg:-right-64 xl:-right-96 w-full h-full lg:rounded-full flex items-center justify-center overflow-hidden shadow-2xl">
                  <img
                    src="/images/service-conteneurs.webp"
                    alt="Parc à conteneurs"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-24 bg-white rounded-2xl sm:rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden mb-12 sm:mb-24 transform hover:scale-[1.01] transition-all duration-500">
          <div className="bg-gradient-to-r from-[#1F3878] to-[#152555] p-6 sm:p-8 text-center">
            <h2 className="text-fluid-4xl font-extrabold text-white mb-4 tracking-tight">
              {t('servicesDetailed.transport.title')}
            </h2>
            <div className="w-32 h-1.5 shimmer-line rounded-full mx-auto"></div>
          </div>

          <div className="p-6 sm:p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div>
                <div className="mb-8">
                  <h3 className="text-fluid-3xl font-bold text-[#1F3878] mb-6 leading-tight">
                    {t('servicesDetailed.transport.heading')}
                  </h3>
                  <div className="w-24 h-1 bg-red-600 mb-6"></div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {t('servicesDetailed.transport.description')}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 sm:p-8 mb-8 border-l-4 border-red-600">
                  <h4 className="text-fluid-2xl font-bold text-[#1F3878] mb-4 flex items-center">
                    <svg className="w-8 h-8 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                    </svg>
                    {t('servicesDetailed.transport.services.title')}
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start text-gray-800 text-lg">
                      <svg className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>{t('servicesDetailed.transport.services.item1')}</span>
                    </li>
                    <li className="flex items-start text-gray-800 text-lg">
                      <svg className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>{t('servicesDetailed.transport.services.item2')}</span>
                    </li>
                    <li className="flex items-start text-gray-800 text-lg">
                      <svg className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>{t('servicesDetailed.transport.services.item3')}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-5 sm:p-8 border-l-4 border-brand">
                  <h4 className="text-fluid-2xl font-bold text-[#1F3878] mb-4 flex items-center">
                    <svg className="w-8 h-8 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    {t('servicesDetailed.transport.benefits.title')}
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start text-gray-800 text-lg">
                      <svg className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>{t('servicesDetailed.transport.benefits.item1')}</span>
                    </li>
                    <li className="flex items-start text-gray-800 text-lg">
                      <svg className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>{t('servicesDetailed.transport.benefits.item2')}</span>
                    </li>
                    <li className="flex items-start text-gray-800 text-lg">
                      <svg className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>{t('servicesDetailed.transport.benefits.item3')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <img
                    src="/images/services-camions.webp"
                    alt="Workers in logistics"
                    loading="lazy"
                    className="w-full h-80 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <img
                    src="/images/services-equipe.webp"
                    alt="Logistics worker"
                    loading="lazy"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-24 rounded-3xl shadow-2xl overflow-hidden relative"
          style={{
            backgroundImage: 'url(/images/services-methodologie.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#1F3878] via-[#1a2f6a] to-[#152555] opacity-90"></div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-20 text-white">
            <div className="text-center mb-10 sm:mb-16">
              <div className="inline-block mb-4 px-6 py-2 bg-red-600 rounded-full shadow-lg shadow-red-600/20">
                <span className="text-white font-semibold text-sm tracking-wider">{t('servicesDetailed.methodology.tag')}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold mb-4 tracking-tight">
                {t('servicesDetailed.methodology.title')}
              </h2>
              <div className="w-32 h-1.5 shimmer-line rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-4 sm:gap-y-6 max-w-5xl mx-auto">
              {['step1', 'step4', 'step2', 'step5'].map((step) => (
                <div key={step} className="flex items-center space-x-4 glass rounded-xl p-4 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                  <div className="flex-shrink-0 bg-red-600 rounded-full p-3">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-semibold">{t(`servicesDetailed.methodology.${step}.title`)}</span>
                </div>
              ))}

              <div className="flex items-center space-x-4 glass rounded-xl p-4 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 md:col-span-2 md:max-w-md md:mx-auto">
                <div className="flex-shrink-0 bg-red-600 rounded-full p-3">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <span className="text-lg font-semibold">{t('servicesDetailed.methodology.step3.title')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-24 bg-gradient-to-br from-[#1F3878] via-[#1a2f6a] to-[#152555] rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-white/10 p-6 sm:p-10 lg:p-16 text-white text-center transform hover:scale-[1.01] transition-all duration-500">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-fluid-4xl font-extrabold mb-6 tracking-tight">
              {t('services.page.cta.title')}
            </h2>
            <div className="w-32 h-1.5 shimmer-line rounded-full mx-auto mb-8"></div>
            <p className="text-fluid-xl text-blue-100 mb-10 leading-relaxed">
              {t('services.page.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="inline-block bg-red-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-red-700 hover:shadow-2xl hover:shadow-red-600/30 transition-all duration-300 transform hover:scale-105"
              >
                {t('services.page.cta.quoteButton')}
              </button>
              <Link
                to="/contact"
                className="inline-block bg-white text-[#1F3878] px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-50 hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 transform hover:scale-105"
              >
                {t('services.page.cta.button')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}
