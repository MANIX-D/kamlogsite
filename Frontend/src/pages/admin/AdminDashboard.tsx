import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Users, Clock, FileText, Megaphone, Briefcase, Eye, TrendingUp, Globe, BarChart3 } from 'lucide-react';
import { adminApiService, Message, Actualite, DashboardStats, PageVisitStats } from '../../services/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [visitStats, setVisitStats] = useState<PageVisitStats | null>(null);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [recentNews, setRecentNews] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchDashboardData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [statsData, visitStatsData, messagesData, newsData] = await Promise.all([
        adminApiService.getDashboardStats(),
        adminApiService.getPageVisitStats().catch(() => null),
        adminApiService.getMessages().catch(() => []),
        adminApiService.getActualites().then(r => r.data).catch(() => []),
      ]);
      setStats(statsData);
      setVisitStats(visitStatsData);
      setRecentMessages((messagesData || []).slice(0, 5));
      setRecentNews((newsData || []).slice(0, 5));
    } catch (err) {
      if (!silent) setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    intervalRef.current = setInterval(() => fetchDashboardData(true), 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchDashboardData]);

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
      <div className="mb-6 sm:mb-8">
        <h1 className="text-fluid-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2 text-fluid-base">
          Vue d'ensemble de votre administration
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`${card.bgColor} p-2.5 sm:p-3 rounded-lg`}>
                  <Icon className={`${card.color.replace('bg-', 'text-')}`} size={24} />
                </div>
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">
                {card.title}
              </h3>
              <p className="text-fluid-3xl font-bold text-slate-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* ── Visit Stats Section ── */}
      {visitStats && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 size={22} className="text-indigo-600" />
            Statistiques des visites
          </h2>

          {/* Visit counters — les libellés passent sous l'icône sur mobile
              pour éviter la troncature dans une colonne de ~140px */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 mb-2">
                <div className="bg-indigo-50 p-2 rounded-lg w-fit">
                  <Eye className="text-indigo-600" size={20} />
                </div>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">Aujourd'hui</span>
              </div>
              <p className="text-fluid-2xl font-bold text-slate-900">{visitStats.today}</p>
              <p className="text-xs text-slate-400 mt-1">{visitStats.today_unique} visiteurs uniques</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 mb-2">
                <div className="bg-blue-50 p-2 rounded-lg w-fit">
                  <TrendingUp className="text-blue-600" size={20} />
                </div>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">Cette semaine</span>
              </div>
              <p className="text-fluid-2xl font-bold text-slate-900">{visitStats.this_week}</p>
              <p className="text-xs text-slate-400 mt-1">{visitStats.week_unique} visiteurs uniques</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 mb-2">
                <div className="bg-emerald-50 p-2 rounded-lg w-fit">
                  <Globe className="text-emerald-600" size={20} />
                </div>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">Ce mois</span>
              </div>
              <p className="text-fluid-2xl font-bold text-slate-900">{visitStats.this_month}</p>
              <p className="text-xs text-slate-400 mt-1">{visitStats.month_unique} visiteurs uniques</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 mb-2">
                <div className="bg-purple-50 p-2 rounded-lg w-fit">
                  <BarChart3 className="text-purple-600" size={20} />
                </div>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">Total</span>
              </div>
              <p className="text-fluid-2xl font-bold text-slate-900">{visitStats.total.toLocaleString('fr-FR')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Bar chart - 30 derniers jours */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 min-w-0">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Visites des 30 derniers jours</h3>
              {visitStats.daily_chart.length === 0 ? (
                <p className="text-slate-400 text-sm py-8 text-center">Aucune donnée disponible</p>
              ) : (
                <div className="flex items-end gap-px sm:gap-[3px] h-32 sm:h-40">
                  {(() => {
                    const maxVisits = Math.max(...visitStats.daily_chart.map(d => d.visits), 1);
                    return visitStats.daily_chart.map((day, i) => {
                      const height = Math.max((day.visits / maxVisits) * 100, 2);
                      const date = new Date(day.date);
                      const label = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
                      return (
                        <div
                          key={i}
                          className="flex-1 group relative"
                          title={`${label}: ${day.visits} visites, ${day.unique_visitors} uniques`}
                        >
                          <div
                            className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t transition-colors cursor-pointer"
                            style={{ height: `${height}%` }}
                          />
                          {/* Infobulle au survol : inutile sur écran tactile,
                              où l'attribut title porte déjà l'information */}
                          <div className="hidden md:group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                            {label} — {day.visits} visites
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>

            {/* Top pages */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 min-w-0">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Pages les plus visitées</h3>
              {visitStats.top_pages.length === 0 ? (
                <p className="text-slate-400 text-sm py-4 text-center">Aucune donnée</p>
              ) : (
                <div className="space-y-3">
                  {visitStats.top_pages.map((page, i) => {
                    const maxPageVisits = visitStats.top_pages[0]?.visits || 1;
                    const width = Math.max((page.visits / maxPageVisits) * 100, 8);
                    const pageName = page.page === '/' ? 'Accueil' : page.page.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-700 font-medium truncate mr-2">{pageName}</span>
                          <span className="text-slate-500 flex-shrink-0">{page.visits}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-indigo-500 h-2 rounded-full transition-all"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-8">
        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-fluid-xl font-bold text-slate-900 min-w-0">
              Messages récents
            </h2>
            <Link to="/admin/messages" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex-shrink-0">
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
        <div className="space-y-4 sm:space-y-6 min-w-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-fluid-xl font-bold text-slate-900 min-w-0">
                Dernières actualités
              </h2>
              <Link to="/admin/actualites" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex-shrink-0">
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
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${
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

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <h2 className="text-fluid-xl font-bold text-slate-900 mb-4">
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
