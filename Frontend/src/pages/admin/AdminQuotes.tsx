import { useEffect, useState } from 'react';
import { adminApiService, Quote } from '../../services/adminApi';
import { X, FileText, Trash2, Eye, Building2, User, Mail, Phone, MapPin } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  'envoyé': 'Devis envoyé',
  accepte: 'Accepté',
  refuse: 'Refusé',
};

const STATUS_COLORS: Record<string, string> = {
  nouveau: 'bg-yellow-100 text-yellow-800',
  en_cours: 'bg-blue-100 text-blue-800',
  'envoyé': 'bg-purple-100 text-purple-800',
  accepte: 'bg-green-100 text-green-800',
  refuse: 'bg-red-100 text-red-800',
};

const PRIORITY_LABELS: Record<string, string> = {
  basse: 'Basse',
  normale: 'Normale',
  haute: 'Haute',
  urgente: 'Urgente',
};

const PRIORITY_COLORS: Record<string, string> = {
  basse: 'bg-gray-100 text-gray-700',
  normale: 'bg-blue-50 text-blue-700',
  haute: 'bg-orange-100 text-orange-700',
  urgente: 'bg-red-100 text-red-700',
};

const SERVICE_LABELS: Record<string, string> = {
  logistique: 'Logistique',
  stockage: 'Stockage',
  transport: 'Transport',
  personnalise: 'Personnalisé',
};

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const data = await adminApiService.getQuotes();
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: Quote['status']) => {
    try {
      await adminApiService.updateQuoteStatus(id, newStatus);
      fetchQuotes();
    } catch (error) {
      console.error('Error updating quote status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande de devis ?')) return;

    try {
      await adminApiService.deleteQuote(id);
      fetchQuotes();
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Demandes de devis</h1>
        <p className="text-gray-600 mt-1">Gérer les demandes de devis des clients ({quotes.length})</p>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
          <FileText size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-500">Aucune demande de devis</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Priorité</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{quote.contact_person}</div>
                      <div className="text-sm text-gray-500">{quote.company_name}</div>
                      <div className="text-xs text-gray-400">{quote.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {SERVICE_LABELS[quote.service_type] || quote.service_type}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[quote.priority] || 'bg-gray-100 text-gray-700'}`}>
                        {PRIORITY_LABELS[quote.priority] || quote.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[quote.status] || 'bg-gray-100 text-gray-800'}`}>
                        {STATUS_LABELS[quote.status] || quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(quote.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Détails de la demande de devis</h2>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Informations de contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Contact</p>
                      <p className="font-medium text-gray-900">{selectedQuote.contact_person}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Entreprise</p>
                      <p className="font-medium text-gray-900">{selectedQuote.company_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium text-gray-900">{selectedQuote.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Téléphone</p>
                      <p className="font-medium text-gray-900">{selectedQuote.phone}</p>
                    </div>
                  </div>
                  {selectedQuote.address && (
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin size={16} className="text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Adresse</p>
                        <p className="font-medium text-gray-900">{selectedQuote.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Détails du projet</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Type de service</p>
                    <p className="font-medium text-gray-900">{SERVICE_LABELS[selectedQuote.service_type] || selectedQuote.service_type}</p>
                  </div>
                  {selectedQuote.budget_range && (
                    <div>
                      <p className="text-sm text-slate-500">Budget estimé</p>
                      <p className="font-medium text-gray-900">{selectedQuote.budget_range}</p>
                    </div>
                  )}
                  {selectedQuote.desired_start_date && (
                    <div>
                      <p className="text-sm text-slate-500">Date de début souhaitée</p>
                      <p className="font-medium text-gray-900">{new Date(selectedQuote.desired_start_date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
                  {selectedQuote.desired_end_date && (
                    <div>
                      <p className="text-sm text-slate-500">Date de fin souhaitée</p>
                      <p className="font-medium text-gray-900">{new Date(selectedQuote.desired_end_date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Description du projet</p>
                  <p className="text-gray-900 whitespace-pre-wrap bg-slate-50 rounded-lg p-3">{selectedQuote.project_description}</p>
                </div>
              </div>

              {/* Admin Controls */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Gestion administrative</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
                    <select
                      value={selectedQuote.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as Quote['status'];
                        handleUpdateStatus(selectedQuote.id, newStatus);
                        setSelectedQuote({ ...selectedQuote, status: newStatus });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="nouveau">Nouveau</option>
                      <option value="en_cours">En cours</option>
                      <option value="envoyé">Devis envoyé</option>
                      <option value="accepte">Accepté</option>
                      <option value="refuse">Refusé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Priorité</label>
                    <span className={`inline-block px-3 py-2 rounded-full text-sm font-medium ${PRIORITY_COLORS[selectedQuote.priority] || 'bg-gray-100'}`}>
                      {PRIORITY_LABELS[selectedQuote.priority] || selectedQuote.priority}
                    </span>
                  </div>
                </div>
                {selectedQuote.estimated_amount && (
                  <div>
                    <p className="text-sm text-slate-500">Montant estimé</p>
                    <p className="font-medium text-gray-900">{selectedQuote.estimated_amount} FCFA</p>
                  </div>
                )}
                {selectedQuote.notes_admin && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Notes administrateur</p>
                    <p className="text-gray-900 whitespace-pre-wrap bg-yellow-50 rounded-lg p-3 border border-yellow-200">{selectedQuote.notes_admin}</p>
                  </div>
                )}
                <div className="text-sm text-slate-400">
                  Créé le {new Date(selectedQuote.created_at).toLocaleString('fr-FR')} · Mis à jour le {new Date(selectedQuote.updated_at).toLocaleString('fr-FR')}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
