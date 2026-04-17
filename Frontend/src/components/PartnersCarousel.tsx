import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

interface Partner {
  id: number;
  name_fr: string;
  name_en: string;
  logo_url?: string;
}

export default function PartnersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();

  const itemsPerView = 5;
  const totalItems = partners.length;

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPartners();
      setPartners(data);
    } catch (err) {
      console.error('Error fetching partners:', err);
    } finally {
      setLoading(false);
    }
  };

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
    if (totalItems === 0) return [];
    const items = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % totalItems;
      items.push(partners[index]);
    }
    return items;
  };

  if (loading) {
    return (
      <section className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            {t('common.loading', 'Chargement...')}
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null;
  }

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
                <div className="p-4 h-40 flex items-center justify-center transition-all duration-300 group">
                  <img
                    src={partner.logo_url || 'https://via.placeholder.com/200x80?text=Logo'}
                    alt={i18n.language === 'fr' ? partner.name_fr : partner.name_en}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    title={i18n.language === 'fr' ? partner.name_fr : partner.name_en}
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
