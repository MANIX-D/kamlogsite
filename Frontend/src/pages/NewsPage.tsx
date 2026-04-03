import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Briefcase, FileText, Megaphone, Filter } from 'lucide-react';
import { apiService, NewsItem } from '../services/api';

type NewsType = 'all' | 'article' | 'announcement' | 'job';

export default function NewsPage() {
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<NewsType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchNews();
  }, [activeFilter, currentPage]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        type: activeFilter === 'all' ? undefined : activeFilter,
        page: currentPage,
        per_page: 9,
      };
      const response = await apiService.getNews(params);
      setNews(response.data);
      setTotalPages(response.last_page);
    } catch (err) {
      setError(t('news.error.fetch'));
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const filters: { value: NewsType; label: string; icon: any }[] = [
    { value: 'all', label: t('news.filters.all'), icon: Filter },
    { value: 'article', label: t('news.filters.article'), icon: FileText },
    { value: 'announcement', label: t('news.filters.announcement'), icon: Megaphone },
    { value: 'job', label: t('news.filters.job'), icon: Briefcase },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return FileText;
      case 'announcement':
        return Megaphone;
      case 'job':
        return Briefcase;
      default:
        return FileText;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-100 text-blue-800';
      case 'announcement':
        return 'bg-orange-100 text-orange-800';
      case 'job':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-50 to-white">
      <div
        className="relative bg-[#1f3878] text-white h-[60vh] overflow-hidden flex items-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(31, 56, 120, 0.95), rgba(15, 35, 80, 0.9)), url('https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'
            }`}
          >
            {t('news.hero.title')}
          </h1>
          <p
            className={`text-lg md:text-xl text-gray-100 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            {t('news.hero.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
        <div className="mb-12 flex flex-wrap gap-3 justify-center bg-white p-4 rounded-2xl shadow-md">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.value}
                onClick={() => {
                  setActiveFilter(filter.value);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  activeFilter === filter.value
                    ? 'bg-[#1f3878] text-white shadow-lg scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
                }`}
              >
                <Icon size={18} />
                {filter.label}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-32">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#1f3878]"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-[#1f3878] opacity-20"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center shadow-lg max-w-md mx-auto">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-red-600" />
            </div>
            <p className="text-red-800 font-semibold text-lg mb-4">{error}</p>
            <button
              onClick={fetchNews}
              className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              {t('news.error.retry')}
            </button>
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <div className="text-center py-32">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={48} className="text-gray-400" />
            </div>
            <p className="text-2xl text-gray-500 font-medium">{t('news.empty')}</p>
          </div>
        )}

        {!loading && !error && news.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {news.map((item, index) => {
                const TypeIcon = getTypeIcon(item.type);
                const isJob = item.type === 'job';
                const linkTo = isJob ? `/jobs/${item.id}` : `/news/${item.id}`;

                const cardContent = (
                  <>
                    {item.image_url ? (
                      <div className="h-56 overflow-hidden relative">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ) : (
                      <div className="h-56 bg-gradient-to-br from-[#1f3878] to-[#0f2350] flex items-center justify-center">
                        <TypeIcon size={64} className="text-white opacity-30" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${getTypeBadgeColor(
                            item.type
                          )}`}
                        >
                          <TypeIcon size={14} />
                          {t(`news.types.${item.type}`)}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <Calendar size={14} />
                          {formatDate(item.published_at || item.date_publication)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#1f3878] transition-colors leading-tight">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 line-clamp-3 mb-5 text-sm leading-relaxed">
                        {item.excerpt}
                      </p>

                      {isJob && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                          <MapPin size={16} className="text-[#1f3878]" />
                          <span className="font-medium">{item.location || 'Douala, Cameroun'}</span>
                        </div>
                      )}

                      <div className="flex items-center text-[#1f3878] font-bold text-sm group-hover:gap-2 transition-all duration-300">
                        {t('news.readMore')}
                        <span className="ml-1 group-hover:translate-x-2 transition-transform duration-300 inline-block">→</span>
                      </div>
                    </div>
                  </>
                );

                const cardClass = `bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group opacity-0 animate-fadeInUp`;

                return (
                  <Link
                    key={item.id}
                    to={linkTo}
                    className={cardClass}
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    {cardContent}
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 py-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-3 rounded-xl border-2 border-gray-200 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#1f3878] hover:bg-[#1f3878] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {t('news.pagination.previous')}
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-md ${
                        currentPage === page
                          ? 'bg-[#1f3878] text-white scale-110'
                          : 'border-2 border-gray-200 hover:border-[#1f3878] hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 rounded-xl border-2 border-gray-200 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#1f3878] hover:bg-[#1f3878] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {t('news.pagination.next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="relative bg-gradient-to-r from-[#1f3878] via-[#2a4a9a] to-[#1f3878] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Briefcase className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-extrabold mb-4">{t('news.jobsCta.title')}</h2>
          <p className="text-xl text-gray-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('news.jobsCta.subtitle')}
          </p>
          <button
            onClick={() => {
              setActiveFilter('job');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-block bg-white text-[#1f3878] px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            {t('news.jobsCta.button')}
          </button>
        </div>
      </div>
    </div>
  );
}
