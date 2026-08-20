import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TestimonialKey {
  id: number;
  companyKey: string;
  textKey: string;
  rating: number;
  image: string;
}

const TESTIMONIALS: TestimonialKey[] = [
  {
    id: 1,
    companyKey: 'testimonials.client1.company',
    textKey: 'testimonials.client1.text',
    rating: 5,
    image: '/images/temoignages-bg.webp'
  },
  {
    id: 2,
    companyKey: 'testimonials.client2.company',
    textKey: 'testimonials.client2.text',
    rating: 5,
    image: '/images/temoignages-bg.webp'
  },
  {
    id: 3,
    companyKey: 'testimonials.client3.company',
    textKey: 'testimonials.client3.text',
    rating: 5,
    image: '/images/temoignages-bg.webp'
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useTranslation();

  const nextTestimonial = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }
  };

  const prevTestimonial = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    }
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const currentTestimonial = TESTIMONIALS[currentIndex];

  return (
    <section className="w-full py-12 sm:py-20 bg-white">
      <div className="container-page">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-fluid-4xl font-extrabold text-brand mb-2 tracking-tight">
            {t('testimonials.title')}
          </h2>
          <div className="flex justify-center">
            <div className="h-1 w-32 shimmer-line rounded-full"></div>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500"
            style={{
              opacity: isTransitioning ? 0.5 : 1,
              transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            {/* Hauteur minimale plutôt que fixe : un témoignage long fait
                grandir la carte au lieu d'être tronqué. Le contenu reste
                dans le flux pour que la hauteur s'y adapte. */}
            <div
              className="relative min-h-[360px] sm:min-h-[450px] bg-cover bg-center flex flex-col items-center justify-center px-10 sm:px-16 lg:px-20 py-12 sm:py-14 text-center"
              style={{
                backgroundImage: `linear-gradient(rgba(31, 56, 120, 0.85), rgba(31, 56, 120, 0.85)), url('${currentTestimonial.image}')`,
              }}
            >
              <h3 className="text-fluid-3xl font-bold text-white mb-5 sm:mb-8">
                {t(currentTestimonial.companyKey)}
              </h3>

              <p className="text-fluid-lg text-gray-100 leading-relaxed mb-8 max-w-4xl">
                {t(currentTestimonial.textKey)}
              </p>

              <div className="flex gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 sm:w-7 sm:h-7 ${
                      star <= currentTestimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-transparent text-yellow-400'
                    } transition-all duration-300`}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={prevTestimonial}
            disabled={isTransitioning}
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 sm:p-4 shadow-xl hover:bg-gray-100 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
            aria-label="Témoignage précédent"
          >
            <ChevronLeft className="w-5 h-5 sm:w-8 sm:h-8 text-blue-900" />
          </button>

          <button
            onClick={nextTestimonial}
            disabled={isTransitioning}
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 sm:p-4 shadow-xl hover:bg-gray-100 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
            aria-label="Témoignage suivant"
          >
            <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8 text-blue-900" />
          </button>

          <div className="flex justify-center gap-3 mt-8">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setCurrentIndex(index);
                  }
                }}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-12 bg-blue-900'
                    : 'w-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Aller au témoignage ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
