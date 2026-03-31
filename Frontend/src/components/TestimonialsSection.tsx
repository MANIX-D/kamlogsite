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
    image: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    id: 2,
    companyKey: 'testimonials.client2.company',
    textKey: 'testimonials.client2.text',
    rating: 5,
    image: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    id: 3,
    companyKey: 'testimonials.client3.company',
    textKey: 'testimonials.client3.text',
    rating: 5,
    image: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=1200'
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
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-2">
            {t('testimonials.title')}
          </h2>
          <div className="flex justify-center">
            <div className="h-1 w-32 bg-red-600"></div>
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
            <div
              className="relative h-[500px] sm:h-[450px] bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(31, 56, 120, 0.85), rgba(31, 56, 120, 0.85)), url('${currentTestimonial.image}')`,
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-20 text-center">
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                  {t(currentTestimonial.companyKey)}
                </h3>

                <p className="text-base sm:text-lg text-gray-100 leading-relaxed mb-8 max-w-4xl">
                  {t(currentTestimonial.textKey)}
                </p>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={28}
                      className={`${
                        star <= currentTestimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-transparent text-yellow-400'
                      } transition-all duration-300`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={prevTestimonial}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-4 shadow-xl hover:bg-gray-100 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
            aria-label="Témoignage précédent"
          >
            <ChevronLeft size={32} className="text-blue-900" />
          </button>

          <button
            onClick={nextTestimonial}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-4 shadow-xl hover:bg-gray-100 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
            aria-label="Témoignage suivant"
          >
            <ChevronRight size={32} className="text-blue-900" />
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
