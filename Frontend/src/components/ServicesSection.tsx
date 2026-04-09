import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    image: '/images/service-transport.jpeg',
  },
  {
    id: 2,
    titleKey: 'services.containers.title',
    subtitleKey: 'services.containers.subtitle',
    descriptionKey: 'services.containers.description',
    detailsKey: 'services.containers.details',
    image: '/images/service-conteneurs.PNG',
  },
  {
    id: 3,
    titleKey: 'services.customs.title',
    subtitleKey: 'services.customs.subtitle',
    descriptionKey: 'services.customs.description',
    detailsKey: 'services.customs.details',
    image: '/images/service-transit.jpg',
  },
];

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 20, y: y * 20 });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
            {t('services.title')}
          </h2>
          <div className="flex justify-center">
            <div className="h-1 w-24 bg-red-600"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            const delay = index * 0.1;
            const xOffset = index % 2 === 0 ? mousePosition.x : -mousePosition.x;
            const yOffset = mousePosition.y;

            return (
              <div
                key={service.id}
                onClick={() => setSelectedService({
                  id: service.id,
                  title: t(service.titleKey),
                  subtitle: t(service.subtitleKey),
                  description: t(service.descriptionKey),
                  details: t(service.detailsKey),
                  image: service.image
                })}
                className="group cursor-pointer scroll-translate"
                style={{
                  transform: `translate(${xOffset}px, ${yOffset}px)`,
                  transitionDelay: `${delay}s`,
                }}
              >
                <div className="relative overflow-hidden rounded-2xl mb-6 h-64 shadow-lg transition-all duration-500 hover:shadow-2xl">
                  <img
                    src={service.image}
                    alt={t(service.titleKey)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                <div className="absolute inset-0 bg-blue-900 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-500 flex items-center justify-center">
                  <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-lg font-semibold">{t('services.click')}</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <h3 className="text-2xl font-bold text-blue-900 mb-2 transition-colors duration-300 group-hover:text-red-600">
                  {t(service.titleKey)}
                </h3>
                <p className="text-lg font-semibold text-blue-700 mb-4 transition-colors duration-300 group-hover:text-blue-900">
                  {t(service.subtitleKey)}
                </p>
                <p className="text-gray-600 leading-relaxed line-clamp-3">
                  {t(service.descriptionKey)}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="relative h-96 overflow-hidden">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg z-10"
              >
                <X size={24} className="text-gray-900" />
              </button>
            </div>

            <div className="p-8">
              <h2 className="text-4xl font-bold text-blue-900 mb-2">
                {selectedService.title}
              </h2>
              <p className="text-lg text-red-600 font-semibold mb-6">
                {selectedService.subtitle}
              </p>

              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">{t('services.description.title')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedService.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">{t('services.details.title')}</h3>
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
