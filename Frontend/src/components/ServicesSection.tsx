import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useOverlay } from '../hooks/useOverlay';

interface Service {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  details: string;
}

interface ServiceKey {
  id: number;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  detailsKey: string;
  image: string;
}

const SERVICES: ServiceKey[] = [
  {
    id: 1,
    titleKey: 'services.transport.title',
    subtitleKey: 'services.transport.subtitle',
    descriptionKey: 'services.transport.description',
    detailsKey: 'services.transport.details',
    image: '/images/service-transport.webp',
  },
  {
    id: 2,
    titleKey: 'services.containers.title',
    subtitleKey: 'services.containers.subtitle',
    descriptionKey: 'services.containers.description',
    detailsKey: 'services.containers.details',
    image: '/images/service-conteneurs.webp',
  },
  {
    id: 3,
    titleKey: 'services.customs.title',
    subtitleKey: 'services.customs.subtitle',
    descriptionKey: 'services.customs.description',
    detailsKey: 'services.customs.details',
    image: '/images/service-transit.webp',
  },
];

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useOverlay(Boolean(selectedService), () => setSelectedService(null));

  useEffect(() => {
    // Effet de suivi de souris limité aux écrans avec pointeur fin :
    // il n'a aucun sens au toucher et décalait les cartes inutilement.
    const query = window.matchMedia(
      '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    );

    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 20, y: y * 20 });
      }
    };

    const section = sectionRef.current;

    const bind = () => {
      if (!section) return;
      if (query.matches) {
        section.addEventListener('mousemove', handleMouseMove);
      } else {
        section.removeEventListener('mousemove', handleMouseMove);
        setMousePosition({ x: 0, y: 0 });
      }
    };

    bind();
    query.addEventListener('change', bind);

    return () => {
      query.removeEventListener('change', bind);
      section?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-12 sm:py-20 bg-gray-50">
      <div className="container-page">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-fluid-4xl font-extrabold text-brand mb-4 tracking-tight">
            {t('services.title')}
          </h2>
          <div className="flex justify-center">
            <div className="h-1 w-24 shimmer-line rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service, index) => {
            const delay = index * 0.1;
            const xOffset = index % 2 === 0 ? mousePosition.x : -mousePosition.x;
            const yOffset = mousePosition.y;

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedService({
                  id: service.id,
                  title: t(service.titleKey),
                  subtitle: t(service.subtitleKey),
                  description: t(service.descriptionKey),
                  details: t(service.detailsKey),
                  image: service.image
                })}
                className="group cursor-pointer scroll-translate text-left w-full"
                style={{
                  transform: `translate(${xOffset}px, ${yOffset}px)`,
                  transitionDelay: `${delay}s`,
                }}
              >
                <div className="relative overflow-hidden rounded-2xl mb-5 sm:mb-6 h-52 sm:h-64 shadow-lg transition-all duration-500 hover:shadow-2xl ring-1 ring-black/5">
                  <img
                    src={service.image}
                    alt={t(service.titleKey)}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F3878]/80 via-[#1F3878]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                  <div className="text-white text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-lg font-bold tracking-wide">{t('services.click')}</p>
                  </div>
                </div>
              </div>

                <div className="relative">
                <h3 className="text-fluid-2xl font-bold text-brand mb-2 transition-colors duration-300 group-hover:text-red-600">
                  {t(service.titleKey)}
                </h3>
                <p className="text-fluid-lg font-semibold text-brand/70 mb-4 transition-colors duration-300 group-hover:text-brand">
                  {t(service.subtitleKey)}
                </p>
                <p className="text-gray-600 leading-relaxed line-clamp-3">
                  {t(service.descriptionKey)}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full"></div>
              </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedService && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
          aria-describedby="service-modal-description"
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92dvh] sm:max-h-[90dvh] overflow-y-auto scroll-contain animate-fade-in">
            <div className="relative h-44 sm:h-72 lg:h-96 overflow-hidden">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg z-10"
                aria-label={t('services.close')}
              >
                <X size={24} className="text-gray-900" />
              </button>
            </div>

            <div className="p-5 sm:p-8">
              <h2 id="service-modal-title" className="text-fluid-3xl font-bold text-blue-900 mb-2">
                {selectedService.title}
              </h2>
              <p className="text-fluid-lg text-red-600 font-semibold mb-6">
                {selectedService.subtitle}
              </p>

              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-fluid-xl font-bold text-blue-900 mb-3">{t('services.description.title')}</h3>
                  <p id="service-modal-description" className="text-gray-700 leading-relaxed">
                    {selectedService.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-fluid-xl font-bold text-blue-900 mb-3">{t('services.details.title')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedService.details}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {t('services.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
