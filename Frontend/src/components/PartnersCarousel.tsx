import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PARTNERS } from '../constants/assets';
import { useTranslation } from 'react-i18next';

export default function PartnersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const itemsPerView = 5;
  const totalItems = PARTNERS.length;

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, totalItems]);

  const goToPrevious = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const goToNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % totalItems;
      items.push(PARTNERS[index]);
    }
    return items;
  };

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {t('partners.title')}
            </h2>
          </div>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-6 sm:gap-8 overflow-hidden"
          >
            {getVisibleItems().map((partner) => (
              <div
                key={partner.id}
                className="flex-shrink-0 w-1/5 min-w-max"
              >
                <div className="bg-gray-50 rounded-lg p-8 h-40 flex items-center justify-center border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 group">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-20 max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    title={partner.name}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 sm:-translate-x-20 bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Previous partners"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 sm:translate-x-20 bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Next partners"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalItems }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlay(false);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-blue-900 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to partner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
