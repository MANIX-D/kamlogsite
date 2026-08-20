import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Warehouse, Ship, Container, Boxes, TrendingUp } from 'lucide-react';
import VisitRequestModal from '../components/VisitRequestModal';

export default function InfrastructuresPage() {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const facilities = useMemo(() => [
    {
      icon: Warehouse,
      titleKey: "visitRequest.form.infrastructureOptions.warehouse",
      location: t('infrastructuresPage.facilities.warehouse.location', "Quai 3, Port Autonome de Douala"),
      surface: "5 000 m²",
      height: "18 mètres",
      features: [
        t('infrastructuresPage.facilities.warehouse.feature1', "Mezzanine intégrée pour optimisation du stockage"),
        t('infrastructuresPage.facilities.warehouse.feature2', "Accès direct au quai d'embarquement"),
        t('infrastructuresPage.facilities.warehouse.feature3', "Équipements de manutention modernes"),
        t('infrastructuresPage.facilities.warehouse.feature4', "Système de surveillance 24/7")
      ],
      image: "/images/services-entrepot1.webp"
    },
    {
      icon: Container,
      titleKey: "visitRequest.form.infrastructureOptions.containers",
      location: t('infrastructuresPage.facilities.containers.location', "Zone Portuaire de Douala"),
      surface: "22 000 m²",
      capacity: t('infrastructuresPage.facilities.containers.capacity', "Entièrement pavé"),
      features: [
        t('infrastructuresPage.facilities.containers.feature1', "Surface entièrement pavée et sécurisée"),
        t('infrastructuresPage.facilities.containers.feature2', "Reach stackers de 45 tonnes"),
        t('infrastructuresPage.facilities.containers.feature3', "Gestion informatisée des stocks"),
        t('infrastructuresPage.facilities.containers.feature4', "Stockage et maintenance de conteneurs")
      ],
      image: "/images/service-conteneurs.webp"
    },
    {
      icon: Boxes,
      titleKey: "visitRequest.form.infrastructureOptions.silos",
      location: t('infrastructuresPage.facilities.silos.location', "Port Autonome de Douala"),
      capacity: "20 000 tonnes",
      type: t('infrastructuresPage.facilities.silos.type', "Silos sur pieux"),
      features: [
        t('infrastructuresPage.facilities.silos.feature1', "Entièrement automatisés"),
        t('infrastructuresPage.facilities.silos.feature2', "Déchargement rapide des marchandises en vrac"),
        t('infrastructuresPage.facilities.silos.feature3', "Système de pesage intégré"),
        t('infrastructuresPage.facilities.silos.feature4', "Contrôle qualité en continu")
      ],
      image: "/images/infra-silos.webp"
    },
    {
      icon: Building2,
      titleKey: "visitRequest.form.infrastructureOptions.udeac",
      location: t('infrastructuresPage.facilities.udeac.location', "Place UDEAC 01, Zone Portuaire"),
      surface: "16 000 m²",
      capacity: t('infrastructuresPage.facilities.udeac.capacity', "Sécurisé 24/7"),
      features: [
        t('infrastructuresPage.facilities.udeac.feature1', "Sécurité renforcée 24h/24"),
        t('infrastructuresPage.facilities.udeac.feature2', "Proximité immédiate du port"),
        t('infrastructuresPage.facilities.udeac.feature3', "Quais de chargement multiples"),
        t('infrastructuresPage.facilities.udeac.feature4', "Stockage multi-produits")
      ],
      image: "/images/about-difference.webp"
    }
  ], [i18n.language, t]);

  const stats = useMemo(() => [
    {
      icon: TrendingUp,
      value: "180 000",
      label: t('infrastructuresPage.statsLabels.storage.label', "Tonnes"),
      description: t('infrastructuresPage.statsLabels.storage.description', "Capacité de stockage cumulée")
    },
    {
      icon: Warehouse,
      value: "43 000",
      label: t('infrastructuresPage.statsLabels.surface.label', "m²"),
      description: t('infrastructuresPage.statsLabels.surface.description', "Surface d'entreposage totale")
    },
    {
      icon: Container,
      value: "22 000",
      label: t('infrastructuresPage.statsLabels.containers.label', "m²"),
      description: t('infrastructuresPage.statsLabels.containers.description', "Parc à conteneurs")
    },
    {
      icon: Ship,
      value: "2",
      label: t('infrastructuresPage.statsLabels.ports.label', "Ports"),
      description: t('infrastructuresPage.statsLabels.ports.description', "Douala et Kribi")
    }
  ], [i18n.language, t]);

  return (
    <div className="min-h-screen bg-white">
      <section
        className="relative w-full min-h-dvh bg-cover bg-center pt-16 sm:pt-20 pb-12 overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(31, 56, 120, 0.75), rgba(31, 56, 120, 0.75)), url('/images/infra-hero.webp')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none"></div>
        <div className="container-page text-center relative z-10">
          <h1
            className={`text-fluid-5xl font-extrabold text-white mb-6 sm:mb-8 tracking-tight leading-[1.1] transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'
            }`}
          >
            {t('infrastructuresPage.title')}
          </h1>
          <p
            className={`text-fluid-xl text-gray-100 font-light max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            {t('infrastructuresPage.subtitle')}
          </p>
        </div>
      </section>

      <div className="container-page py-12 sm:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 mb-12 sm:mb-24">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-4 sm:p-8 text-center transform hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-2xl ring-1 ring-gray-100 hover:ring-brand/20"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-[#1F3878] rounded-full p-3 sm:p-4">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <div className="text-fluid-3xl font-extrabold text-brand mb-2 tracking-tight">{stat.value}</div>
              <div className="text-fluid-lg font-semibold text-gray-700 mb-2">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-6 py-2 bg-red-600 rounded-full">
            <span className="text-white font-semibold text-sm tracking-wider">{t('infrastructuresPage.tag')}</span>
          </div>
          <h2 className="text-fluid-4xl font-extrabold text-brand mb-6 tracking-tight">
            {t('infrastructuresPage.heading')}
          </h2>
          <div className="w-32 h-1.5 shimmer-line rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('infrastructuresPage.intro')}
          </p>
        </div>

        <div className="space-y-16">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden transform hover:scale-[1.01] hover:shadow-2xl transition-all duration-500 ${
                index % 2 === 0 ? '' : ''
              }`}
            >
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                <div className={`p-6 sm:p-8 lg:p-12 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center mb-6">
                    <div className="bg-[#1F3878] rounded-full p-4 mr-4">
                      <facility.icon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-fluid-2xl font-bold text-brand">{t(facility.titleKey)}</h3>
                      <p className="text-gray-600 flex items-center mt-1">
                        <svg className="w-4 h-4 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                        </svg>
                        {facility.location}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-8">
                    {facility.surface && (
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-l-4 border-[#1F3878]">
                        <div className="text-sm text-gray-600 mb-1">{t('infrastructuresPage.labels.surface')}</div>
                        <div className="text-fluid-2xl font-bold text-brand">{facility.surface}</div>
                      </div>
                    )}
                    {facility.capacity && (
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border-l-4 border-red-600">
                        <div className="text-sm text-gray-600 mb-1">{t('infrastructuresPage.labels.capacity')}</div>
                        <div className="text-fluid-2xl font-bold text-brand">{facility.capacity}</div>
                      </div>
                    )}
                    {facility.height && (
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border-l-4 border-red-600">
                        <div className="text-sm text-gray-600 mb-1">{t('infrastructuresPage.labels.height')}</div>
                        <div className="text-fluid-2xl font-bold text-brand">{facility.height}</div>
                      </div>
                    )}
                    {facility.type && (
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border-l-4 border-red-600">
                        <div className="text-sm text-gray-600 mb-1">{t('infrastructuresPage.labels.type')}</div>
                        <div className="text-fluid-xl font-bold text-brand">{facility.type}</div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-l-4 border-red-600">
                    <h4 className="text-xl font-bold text-[#1F3878] mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                      </svg>
                      {t('infrastructuresPage.labels.features')}
                    </h4>
                    <ul className="space-y-3">
                      {facility.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-gray-800">
                          <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`relative h-56 xs:h-64 sm:h-80 lg:h-full lg:min-h-[clamp(24rem,32vw,31rem)] ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <img
                    src={facility.image}
                    alt={t(facility.titleKey)}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-24 bg-gradient-to-br from-[#1F3878] via-[#1a2f6a] to-[#152555] rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-white/10 p-6 sm:p-10 lg:p-16 text-white text-center transform hover:scale-[1.01] transition-all duration-500">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-fluid-4xl font-extrabold mb-6 tracking-tight">
              {t('infrastructuresPage.cta.title')}
            </h2>
            <div className="w-32 h-1.5 shimmer-line rounded-full mx-auto mb-8"></div>
            <p className="text-fluid-xl text-blue-100 mb-10 leading-relaxed">
              {t('infrastructuresPage.cta.description')}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-block bg-red-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-red-700 hover:shadow-2xl hover:shadow-red-600/30 transition-all duration-300 transform hover:scale-105"
            >
              {t('infrastructuresPage.cta.button')}
            </button>
          </div>
        </div>
      </div>

      <VisitRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
