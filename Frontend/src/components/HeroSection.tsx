import { ArrowRight } from 'lucide-react';
import { ASSETS } from '../constants/assets';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setScrollY(0);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      className="relative w-full h-screen bg-cover bg-center pt-20 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(31, 56, 120, 0.7), rgba(31, 56, 120, 0.7)), url('${ASSETS.heroBg}')`,
        backgroundPositionY: `${scrollY * 0.5}px`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        {/* Badge */}
        <div className="mb-8 inline-block">
          <div className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold w-fit">
            {t('hero.badge')}
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight max-w-4xl">
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-100 mb-12 max-w-2xl">
          {t('hero.subtitle')}
        </p>

        {/* CTA Button */}
        <div>
          <Link
            to="/about"
            className="inline-flex items-center space-x-2 bg-white text-blue-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors group"
          >
            <span>{t('hero.cta.primary')}</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-10 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div
            className="scroll-translate"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          >
            <div className="text-3xl sm:text-5xl font-bold text-white mb-2">5+</div>
            <div className="text-gray-200">
              <p className="font-semibold">{t('hero.stats.years')}</p>
              <p className="text-sm">{t('hero.stats.years_sub')}</p>
            </div>
          </div>
          <div
            className="scroll-translate"
            style={{
              transform: `translateY(${scrollY * 0.15}px)`,
            }}
          >
            <div className="text-3xl sm:text-5xl font-bold text-white mb-2">180 000+</div>
            <div className="text-gray-200">
              <p className="font-semibold">{t('hero.stats.tons')}</p>
              <p className="text-sm">{t('hero.stats.tons_sub')}</p>
            </div>
          </div>
          <div
            className="scroll-translate"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          >
            <div className="text-3xl sm:text-5xl font-bold text-white mb-2">16 000 m²</div>
            <div className="text-gray-200">
              <p className="font-semibold">{t('hero.stats.warehouse')}</p>
              <p className="text-sm">{t('hero.stats.warehouse_sub')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
