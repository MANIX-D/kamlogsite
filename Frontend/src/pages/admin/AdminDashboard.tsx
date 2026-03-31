import { useEffect, useState } from 'react';
import { Newspaper, Mail, MailOpen } from 'lucide-react';
import { adminApiService } from '../../services/adminApi';

interface Stats {
  totalActualites: number;
  totalOffres: number;
  totalMessages: number;
  totalNewsletter: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminApiService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats
    ? [
        {
          title: 'Total Actualités',
          value: stats.totalActualites,
          icon: Newspaper,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-50',
        },
        {
          title: 'Offres d\'emploi',
          value: stats.totalOffres,
          icon: Newspaper,
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
        },
        {
          title: 'Messages reçus',
          value: stats.totalMessages,
          icon: Mail,
          color: 'bg-orange-500',
          bgColor: 'bg-orange-50',
        },
        {
          title: 'Abonnés Newsletter',
          value: stats.totalNewsletter,
          icon: MailOpen,
          color: 'bg-emerald-500',
          bgColor: 'bg-emerald-50',
        },
      ]
    : [];

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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Activité récente
          </h2>
          <p className="text-slate-600">
            Les statistiques détaillées seront affichées ici.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Actions rapides
          </h2>
          <div className="space-y-3">
            <a
              href="/admin/actualites"
              className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
            >
              Ajouter une actualité
            </a>
            <a
              href="/admin/messages"
              className="block w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors"
            >
              Voir les messages
            </a>
            <a
              href="/admin/newsletter"
              className="block w-full text-left px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
            >
              Voir les abonnés
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
