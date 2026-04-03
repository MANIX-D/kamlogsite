import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Settings } from 'lucide-react';
import { apiService, Service } from '../services/api';

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr';

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchService(parseInt(id));
    }
  }, [id]);

  const fetchService = async (serviceId: number) => {
    setLoading(true);
    setError(null);
    try {
      const services = await apiService.getServices();
      const servicesList = Array.isArray(services) ? services : (services as any)?.data || [];
      const found = servicesList.find((s: Service) => s.id === serviceId);
      if (found) {
        setService(found);
      } else {
        setError(lang === 'fr' ? 'Service non trouvé' : 'Service not found');
      }
    } catch (err) {
      setError(lang === 'fr' ? 'Erreur lors du chargement' : 'Error loading service');
      console.error('Error fetching service:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f3878]"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || (lang === 'fr' ? 'Service non trouvé' : 'Service not found')}</p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-[#1f3878] font-semibold hover:underline"
          >
            <ArrowLeft size={20} />
            {lang === 'fr' ? 'Retour aux services' : 'Back to services'}
          </Link>
        </div>
      </div>
    );
  }

  const name = lang === 'fr' ? service.nom_fr : service.nom_en;
  const description = lang === 'fr' ? service.description_fr : service.description_en;

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero */}
      <div
        className="relative w-full h-72 bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(31, 56, 120, 0.85), rgba(31, 56, 120, 0.85)), url('https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-4">
            <Settings size={16} />
            {lang === 'fr' ? 'Service' : 'Service'}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{name}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-[#1f3878] font-semibold hover:underline mb-8"
        >
          <ArrowLeft size={20} />
          {lang === 'fr' ? 'Retour aux services' : 'Back to services'}
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{name}</h2>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {description}
            </div>

            {/* CTA */}
            <div className="mt-12 bg-gradient-to-r from-[#1f3878] to-[#2a4a9a] rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                {lang === 'fr' ? 'Intéressé par ce service ?' : 'Interested in this service?'}
              </h3>
              <p className="text-blue-100 mb-6">
                {lang === 'fr'
                  ? 'Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé.'
                  : 'Contact us to discuss your needs and get a personalized quote.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#1f3878] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <CheckCircle size={20} />
                  {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
