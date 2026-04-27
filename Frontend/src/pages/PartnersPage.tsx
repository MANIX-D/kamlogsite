import { useTranslation } from 'react-i18next';
import { Building2, Handshake, Globe, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Partner } from '../services/api';

export default function PartnersPage() {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Load partners from API
    apiService.getPartners()
      .then(data => {
        setPartners(data.filter(p => p.is_active));
      })
      .catch(err => {
        console.error('Error loading partners:', err);
      });
    
    return () => clearTimeout(timer);
  }, [i18n.language]);

  // Group partners by category - map old categories to new ones
  const categoryMapping: Record<string, { id: string; icon: any; titleKey: string; descKey: string }> = {
    'transport': { id: 'maritime', icon: Globe, titleKey: 'partners.categories.maritime.title', descKey: 'partners.categories.maritime.description' },
    'logistique': { id: 'logistics', icon: Building2, titleKey: 'partners.categories.logistics.title', descKey: 'partners.categories.logistics.description' },
    'maritime': { id: 'maritime', icon: Globe, titleKey: 'partners.categories.maritime.title', descKey: 'partners.categories.maritime.description' },
    'logistics': { id: 'logistics', icon: Building2, titleKey: 'partners.categories.logistics.title', descKey: 'partners.categories.logistics.description' },
    'industrial': { id: 'industrial', icon: Award, titleKey: 'partners.categories.industrial.title', descKey: 'partners.categories.industrial.description' },
    'institutional': { id: 'institutional', icon: Handshake, titleKey: 'partners.categories.institutional.title', descKey: 'partners.categories.institutional.description' },
    'autre': { id: 'industrial', icon: Award, titleKey: 'partners.categories.industrial.title', descKey: 'partners.categories.industrial.description' },
  };

  // Get unique categories from partners
  const uniqueCategories = Array.from(new Set(partners.map(p => {
    const mapping = categoryMapping[p.category || ''];
    return mapping ? mapping.id : null;
  }).filter(Boolean)));

  const partnerCategories = uniqueCategories.map(catId => {
    const catConfig = Object.values(categoryMapping).find(c => c.id === catId);
    if (!catConfig) return null;
    
    return {
      id: catId,
      icon: catConfig.icon,
      title: t(catConfig.titleKey),
      description: t(catConfig.descKey),
      partners: partners
        .filter(p => {
          const mapping = categoryMapping[p.category || ''];
          return mapping && mapping.id === catId;
        })
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    };
  }).filter((cat): cat is NonNullable<typeof cat> => cat !== null && cat.partners.length > 0);

  const stats = [
    { value: `${partners.length}+`, label: t('partners.stats.partners') },
    { value: '15+', label: t('partners.stats.countries') },
    { value: '5', label: t('partners.stats.years') },
    { value: '100%', label: t('partners.stats.satisfaction') }
  ];

  return (
    <div className="min-h-screen pt-20">
      <div
        className="relative bg-[#1f3878] text-white h-screen overflow-hidden flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(31, 56, 120, 0.85), rgba(31, 56, 120, 0.85)), url('/images/about-equip.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'
            }`}
          >
            {t('partners.hero.title')}
          </h1>
          <p
            className={`text-xl md:text-2xl lg:text-3xl text-gray-100 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            {t('partners.hero.subtitle')}
          </p>
        </div>
      </div>

      <div className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#1f3878] mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('partners.intro.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('partners.intro.description')}
            </p>
          </div>

          <div className="space-y-20">
            {partnerCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-[#1f3878] rounded-xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {category.partners.map((partner) => (
                      <div
                        key={partner.id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                      >
                        <div className="h-48 overflow-hidden bg-gray-100">
                          {partner.logo_url ? (
                            <img
                              src={partner.logo_url}
                              alt={t('lang') === 'en' ? partner.name_en : partner.name_fr}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Building2 size={64} />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            {t('lang') === 'en' ? partner.name_en : partner.name_fr}
                          </h4>
                          <p className="text-sm text-[#1f3878] font-medium">
                            {t('lang') === 'en' ? (partner.sector_en || partner.sector_fr) : (partner.sector_fr || partner.sector_en)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-20 bg-[#1f3878] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Handshake className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            {t('partners.cta.title')}
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            {t('partners.cta.description')}
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-[#1f3878] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            {t('partners.cta.button')}
          </Link>
        </div>
      </div>
    </div>
  );
}
