import { ArrowRight } from 'lucide-react';
import { ASSETS } from '../constants/assets';
import { useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const stat1Ref = useRef<HTMLDivElement>(null);
  const stat2Ref = useRef<HTMLDivElement>(null);
  const stat3Ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const updateParallax = useCallback(() => {
    const y = window.scrollY;
    if (sectionRef.current) {
      sectionRef.current.style.backgroundPositionY = `${y * 0.5}px`;
    }
    if (stat1Ref.current) stat1Ref.current.style.transform = `translateY(${y * 0.1}px)`;
    if (stat2Ref.current) stat2Ref.current.style.transform = `translateY(${y * 0.15}px)`;
    if (stat3Ref.current) stat3Ref.current.style.transform = `translateY(${y * 0.2}px)`;
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Le parallax est réservé aux grands écrans avec pointeur fin :
    // sur mobile il provoque des saccades et décale les cartes hors de la
    // section. On respecte aussi le réglage « animations réduites ».
    const query = window.matchMedia(
      '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    );

    const resetParallax = () => {
      if (sectionRef.current) sectionRef.current.style.backgroundPositionY = '';
      [stat1Ref, stat2Ref, stat3Ref].forEach((ref) => {
        if (ref.current) ref.current.style.transform = '';
      });
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateParallax);
    };

    const bind = () => {
      if (query.matches) {
        window.addEventListener('scroll', handleScroll, { passive: true });
      } else {
        window.removeEventListener('scroll', handleScroll);
        cancelAnimationFrame(rafRef.current);
        resetParallax();
      }
    };

    bind();
    query.addEventListener('change', bind);

    return () => {
      query.removeEventListener('change', bind);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateParallax]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-dvh bg-cover bg-center pt-16 sm:pt-20 pb-12 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(31, 56, 120, 0.7), rgba(31, 56, 120, 0.7)), url('${ASSETS.heroBg}')`,
        willChange: 'background-position',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />

      <div className="container-page min-h-dvh flex flex-col justify-center relative z-10 py-10">
        {/* Badge */}
        <div className="mb-5 sm:mb-8 inline-block">
          <div className="bg-red-600/90 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold w-fit animate-pulse-glow tracking-wide uppercase">
            {t('hero.badge')}
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-fluid-5xl font-extrabold text-white mb-4 sm:mb-6 leading-[1.1] max-w-4xl tracking-tight">
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-fluid-lg text-gray-200 mb-8 sm:mb-12 max-w-2xl leading-relaxed font-light">
          {t('hero.subtitle')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4">
          <Link
            to="/about"
            className="inline-flex items-center justify-center gap-2 bg-white text-brand px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold hover:bg-gray-50 hover:shadow-xl hover:shadow-white/20 transition-all duration-300 group"
          >
            <span>{t('hero.cta.primary')}</span>
            <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 glass text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
          >
            <span>{t('nav.contact')}</span>
          </Link>
        </div>

        {/* Stats — 1 colonne sur mobile, 3 dès 640px */}
        <div className="mt-10 sm:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div
            ref={stat1Ref}
            className="scroll-translate glass rounded-2xl p-5 sm:p-6 hover:bg-white/15 transition-colors duration-500"
          >
            <div className="text-fluid-4xl font-extrabold text-white mb-2 tracking-tight">5+</div>
            <div className="text-gray-200">
              <p className="font-semibold text-fluid-base">{t('hero.stats.years')}</p>
              <p className="text-fluid-sm text-gray-300">{t('hero.stats.years_sub')}</p>
            </div>
          </div>
          <div
            ref={stat2Ref}
            className="scroll-translate glass rounded-2xl p-5 sm:p-6 hover:bg-white/15 transition-colors duration-500"
          >
            <div className="text-fluid-4xl font-extrabold text-white mb-2 tracking-tight">90 000+</div>
            <div className="text-gray-200">
              <p className="font-semibold text-fluid-base">{t('hero.stats.tons')}</p>
              <p className="text-fluid-sm text-gray-300">{t('hero.stats.tons_sub')}</p>
            </div>
          </div>
          <div
            ref={stat3Ref}
            className="scroll-translate glass rounded-2xl p-5 sm:p-6 hover:bg-white/15 transition-colors duration-500"
          >
            <div className="text-fluid-4xl font-extrabold text-white mb-2 tracking-tight">16 000 m²</div>
            <div className="text-gray-200">
              <p className="font-semibold text-fluid-base">{t('hero.stats.warehouse')}</p>
              <p className="text-fluid-sm text-gray-300">{t('hero.stats.warehouse_sub')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
