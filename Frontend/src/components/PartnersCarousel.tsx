import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [isTransitioning, setIsTransitioning] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();

  const itemWidthPercent = 20; // 5 items per view = 100/5
  const totalItems = partners.length;

  // On duplique les partenaires pour créer un effet de boucle infinie
  const extendedPartners = totalItems > 0
    ? [...partners, ...partners, ...partners]
    : [];
  const startOffset = totalItems; // commence au milieu (2e copie)

  useEffect(() => {
    fetchPartners();
  }, [i18n.language]);

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

  // Initialiser la position au milieu sans transition
  useEffect(() => {
    if (totalItems > 0) {
      setIsTransitioning(false);
      setCurrentIndex(startOffset);
    }
  }, [totalItems, startOffset]);

  // Rétablir la transition après le repositionnement sans animation
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Boucle infinie : quand on dépasse les bornes, on repositionne sans animation
  useEffect(() => {
    if (!isTransitioning) return;
    const handleTransitionEnd = () => {
      if (currentIndex >= startOffset + totalItems) {
        setIsTransitioning(false);
        setCurrentIndex(startOffset + (currentIndex % totalItems));
      } else if (currentIndex < startOffset) {
        setIsTransitioning(false);
        setCurrentIndex(startOffset + (((currentIndex - startOffset) % totalItems) + totalItems) % totalItems);
      }
    };
    const track = trackRef.current;
    if (track) {
      track.addEventListener('transitionend', handleTransitionEnd);
      return () => track.removeEventListener('transitionend', handleTransitionEnd);
    }
  }, [currentIndex, isTransitioning, startOffset, totalItems]);

  const goToPrevious = useCallback(() => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  const goToNext = useCallback(() => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Autoplay
  useEffect(() => {
    if (!isAutoPlay || totalItems === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 1500);

    return () => clearInterval(interval);
  }, [isAutoPlay, totalItems]);

  const translateX = -(currentIndex * itemWidthPercent);
  // Index réel pour les dots
  const realIndex = totalItems > 0
    ? ((currentIndex - startOffset) % totalItems + totalItems) % totalItems
    : 0;

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

        <div className="relative overflow-hidden">
          <div
            ref={trackRef}
            className="flex"
            style={{
              transform: `translateX(${translateX}%)`,
              transition: isTransitioning ? 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            }}
          >
            {extendedPartners.map((partner, idx) => (
              <div
                key={`${partner.id}-${idx}`}
                className="flex-shrink-0 px-3 sm:px-4"
                style={{ width: `${itemWidthPercent}%` }}
              >
                <div className="p-4 h-40 flex items-center justify-center group">
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
                setCurrentIndex(startOffset + index);
                setIsAutoPlay(false);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === realIndex
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
