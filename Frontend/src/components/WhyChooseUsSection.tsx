import { ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function WhyChooseUsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const reasons = [
    t('why.reason1'),
    t('why.reason2'),
    t('why.reason3'),
    t('why.reason4'),
    t('why.reason5'),
    t('why.reason6')
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Décalage au scroll réservé aux grands écrans avec pointeur fin :
    // sur mobile il désaligne les cartes et provoque des saccades.
    const query = window.matchMedia(
      '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    );

    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const windowCenter = window.innerHeight / 2;
        const offset = (elementCenter - windowCenter) * 0.15;
        setScrollOffset(offset);
      }
    };

    const bind = () => {
      if (query.matches) {
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
      } else {
        window.removeEventListener('scroll', handleScroll);
        setScrollOffset(0);
      }
    };

    bind();
    query.addEventListener('change', bind);

    return () => {
      query.removeEventListener('change', bind);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="w-full py-12 sm:py-20 bg-white">
      <div className="container-page">
        <div className="flex flex-col items-center justify-center mb-10 sm:mb-16 space-y-6 sm:space-y-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-3 bg-brand hover:bg-brand-dark text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold transition-all duration-300 group shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30"
          >
            <span>{t('nav.services')}</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="text-center">
            <h2 className="text-fluid-4xl font-extrabold text-brand mb-4 tracking-tight">
              {t('why.title')}
            </h2>
            <div className="flex justify-center">
              <div className="h-1 w-48 sm:w-80 shimmer-line rounded-full"></div>
            </div>
          </div>
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto"
        >
          {reasons.map((reason, index) => {
            const isEven = index % 2 === 0;
            const translateValue = isEven ? scrollOffset : -scrollOffset;

            return (
              <div
                key={index}
                className="animate-fade-in-up scroll-translate flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-white shadow-sm hover:shadow-md ring-1 ring-gray-100 hover:ring-gray-200 transition-all duration-300"
                style={{
                  animationDelay: isVisible ? `${index * 0.1}s` : '0s',
                  transform: `translateY(${translateValue}px)`,
                }}
              >
                <CheckCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                <p className="text-gray-700 font-medium text-fluid-base">{reason}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
