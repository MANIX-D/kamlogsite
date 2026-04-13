import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Users, Clock, FileText, Megaphone, Briefcase } from 'lucide-react';
import { adminApiService, Message, Actualite, DashboardStats } from '../../services/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [recentNews, setRecentNews] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, messagesData, newsData] = await Promise.all([
        adminApiService.getDashboardStats(),
        adminApiService.getMessages().catch(() => []),
        adminApiService.getActualites().then(r => r.data).catch(() => []),
      ]);
      setStats(statsData);
      setRecentMessages((messagesData || []).slice(0, 5));
      setRecentNews((newsData || []).slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats
    ? [
        {
          title: 'Articles',
          value: `${stats.published_articles} / ${stats.total_articles}`,
          icon: FileText,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-50',
        },
        {
          title: 'Annonces',
          value: `${stats.published_annonces} / ${stats.total_annonces}`,
          icon: Megaphone,
          color: 'bg-orange-500',
          bgColor: 'bg-orange-50',
        },
        {
          title: 'Offres d\'emploi',
          value: `${stats.published_offres} / ${stats.total_offres}`,
          icon: Briefcase,
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
        },
        {
          title: 'Messages reçus',
          value: `${stats.total_messages} (${stats.unread_messages} non lus)`,
          icon: Mail,
          color: 'bg-purple-500',
          bgColor: 'bg-purple-50',
        },
        {
          title: 'Utilisateurs',
          value: `${stats.active_users} / ${stats.total_users}`,
          icon: Users,
          color: 'bg-emerald-500',
          bgColor: 'bg-emerald-50',
        },
      ]
    : [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'annonce': return <Megaphone className="w-4 h-4 text-orange-500" />;
      case 'offre': return <Briefcase className="w-4 h-4 text-green-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Vue d'ensemble de votre administration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={`${card.color.replace('bg-', 'text-')}`} size={24} />
                </div>
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">
                {card.title}
              </h3>
              <p className="text-3xl font-bold text-slate-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Messages récents
            </h2>
            <Link to="/admin/messages" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Voir tout →
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-slate-500 text-sm py-4">Aucun message récent</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    msg.lu ? 'bg-slate-50' : 'bg-blue-50 border border-blue-100'
                  }`}
                >
                  <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${msg.lu ? 'bg-slate-300' : 'bg-blue-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 text-sm truncate">{msg.nom}</span>
                      {!msg.lu && (
                        <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded">NEW</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{msg.sujet}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock size={10} />
                      {formatDate(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent News + Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Dernières actualités
              </h2>
              <Link to="/admin/actualites" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Voir tout →
              </Link>
            </div>
            {recentNews.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">Aucune actualité récente</p>
            ) : (
              <div className="space-y-3">
                {recentNews.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    {getTypeIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.titre_fr}</p>
                      <p className="text-xs text-slate-400">{formatDate(item.date_publication || item.created_at)}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      item.type === 'article' ? 'bg-blue-100 text-blue-700'
                      : item.type === 'annonce' ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Actions rapides
            </h2>
            <div className="space-y-3">
              <Link
                to="/admin/actualites"
                className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
              >
                Ajouter une actualité
              </Link>
              <Link
                to="/admin/messages"
                className="block w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors"
              >
                Voir les messages
              </Link>
              <Link
                to="/admin/newsletter"
                className="block w-full text-left px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
              >
                Voir les abonnés
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
