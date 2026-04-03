import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Megaphone } from 'lucide-react';
import { apiService, NewsItem } from '../services/api';

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchDetail(parseInt(id));
    }
  }, [id]);

  const fetchDetail = async (newsId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getNewsItem(newsId);
      setItem(data);
    } catch (err) {
      setError(t('news.error.notFound', 'Article non trouvé'));
      console.error('Error fetching news detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'article':
        return { label: t('news.types.article', 'Article'), color: 'bg-blue-100 text-blue-800', icon: FileText };
      case 'announcement':
        return { label: t('news.types.announcement', 'Annonce'), color: 'bg-orange-100 text-orange-800', icon: Megaphone };
      default:
        return { label: type, color: 'bg-gray-100 text-gray-800', icon: FileText };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f3878]"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || t('news.error.notFound', 'Article non trouvé')}</p>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-[#1f3878] font-semibold hover:underline"
          >
            <ArrowLeft size={20} />
            {t('news.backToList', 'Retour aux actualités')}
          </Link>
        </div>
      </div>
    );
  }

  const badge = getTypeBadge(item.type);
  const BadgeIcon = badge.icon;

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-[#1f3878] font-semibold hover:underline mb-8"
        >
          <ArrowLeft size={20} />
          {t('news.backToList', 'Retour aux actualités')}
        </Link>

        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {item.image_url && (
            <div className="h-72 md:h-96 overflow-hidden">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${badge.color}`}>
                <BadgeIcon size={16} />
                {badge.label}
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                {formatDate(item.published_at || item.date_publication)}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
              {item.title}
            </h1>

            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 text-[#1f3878] font-semibold hover:underline"
              >
                <ArrowLeft size={20} />
                {t('news.backToList', 'Retour aux actualités')}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
