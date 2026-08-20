import { useEffect, useState } from 'react';
import { MailOpen, Trash2 } from 'lucide-react';
import { adminApiService, Newsletter } from '../../services/adminApi';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const data = await adminApiService.getNewsletterSubscribers();
      setSubscribers(data);
    } catch (err) {
      console.error('Error fetching newsletter subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subscriber: Newsletter) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet abonné ?')) return;

    try {
      await adminApiService.deleteNewsletterSubscriber(subscriber.id);
      fetchSubscribers();
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleExport = () => {
    const csvHeader = 'Email,Date d\'inscription\n';
    const csvRows = subscribers.map((s) => {
      const date = new Date(s.created_at).toLocaleDateString('fr-FR');
      return `${s.email},${date}`;
    }).join('\n');
    const csvContent = csvHeader + csvRows;
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-fluid-3xl font-bold text-slate-900">Newsletter</h1>
          <p className="text-slate-600 mt-2 text-fluid-base">
            Abonnés à la newsletter ({subscribers.length})
          </p>
        </div>
        {subscribers.length > 0 && (
          <button
            onClick={handleExport}
            className="w-full sm:w-auto flex-shrink-0 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Exporter les emails
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-8 text-center">
            <MailOpen size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">Aucun abonné</p>
          </div>
        ) : (
          <>
            {/* Vue cartes sur mobile : une adresse e-mail longue peut se
                replier au lieu d'imposer un scroll horizontal */}
            <ul className="divide-y divide-slate-200 md:hidden">
              {subscribers.map((subscriber) => (
                <li key={subscriber.id} className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 break-all">
                      {subscriber.email}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(subscriber.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(subscriber)}
                    className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                    aria-label={`Supprimer ${subscriber.email}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Date d'inscription
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {subscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 lg:px-6 py-4 text-sm text-slate-900 break-all">
                        {subscriber.email}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-slate-600">
                        {new Date(subscriber.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(subscriber)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                          aria-label={`Supprimer ${subscriber.email}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
