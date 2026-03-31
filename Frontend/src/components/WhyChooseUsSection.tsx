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
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const windowCenter = window.innerHeight / 2;
        const offset = (elementCenter - windowCenter) * 0.15;
        setScrollOffset(offset);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-16 space-y-8">
          <Link
            to="/services"
            className="inline-flex items-center space-x-3 bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-full font-semibold transition-colors group"
          >
            <span>{t('nav.services')}</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
              {t('why.title')}
            </h2>
            <div className="flex justify-center">
              <div className="h-1 w-80 bg-red-600"></div>
            </div>
          </div>
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
          {reasons.map((reason, index) => {
            const isEven = index % 2 === 0;
            const translateValue = isEven ? scrollOffset : -scrollOffset;

            return (
              <div
                key={index}
                className="animate-fade-in-up scroll-translate flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                style={{
                  animationDelay: isVisible ? `${index * 0.1}s` : '0s',
                  transform: `translateY(${translateValue}px)`,
                }}
              >
                <CheckCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                <p className="text-gray-700 font-medium">{reason}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
