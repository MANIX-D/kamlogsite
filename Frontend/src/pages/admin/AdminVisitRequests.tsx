import { useState, useEffect } from 'react';
import { adminApiService, VisitRequest } from '../../services/adminApi';
import DataTable from '../../components/admin/DataTable';
import { Calendar, Mail, Phone, Building2, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function AdminVisitRequests() {
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<VisitRequest | null>(null);

  useEffect(() => {
    loadVisitRequests();
  }, []);

  const loadVisitRequests = async () => {
    try {
      setLoading(true);
      const data = await adminApiService.getVisitRequests();
      setVisitRequests(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des demandes de visite');
      console.error('Error loading visit requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      await adminApiService.updateVisitRequestStatus(id, status);
      await loadVisitRequests();
      setSelectedRequest(null);
      alert('Statut mis à jour avec succès');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande de visite ?')) {
      return;
    }

    try {
      await adminApiService.deleteVisitRequest(id);
      await loadVisitRequests();
      setSelectedRequest(null);
      alert('Demande supprimée avec succès');
    } catch (err) {
      console.error('Error deleting visit request:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const icons = {
      pending: <AlertCircle className="w-4 h-4" />,
      confirmed: <CheckCircle2 className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
    };

    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      cancelled: 'Annulée',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Téléphone' },
    {
      key: 'date',
      label: 'Date souhaitée',
      render: (item: VisitRequest) => new Date(item.date).toLocaleDateString('fr-FR')
    },
    {
      key: 'heure',
      label: 'Heure',
      render: (item: VisitRequest) => item.heure || '—'
    },
    {
      key: 'type_visite',
      label: 'Type de visite',
      render: (item: VisitRequest) => {
        const labels: Record<string, string> = {
          guidee: 'Visite guidée',
          autonome: 'Visite autonome',
          virtuelle: 'Visite virtuelle',
          rencontre: 'Rencontre',
        };
        return item.type_visite ? labels[item.type_visite] || item.type_visite : '—';
      }
    },
    {
      key: 'infrastructure',
      label: 'Infrastructure',
      render: (item: VisitRequest) => item.infrastructure?.nom_fr || '—'
    },
    {
      key: 'status',
      label: 'Statut',
      render: (item: VisitRequest) => getStatusBadge(item.status)
    },
    {
      key: 'created_at',
      label: 'Reçue le',
      render: (item: VisitRequest) => new Date(item.created_at).toLocaleDateString('fr-FR')
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-fluid-2xl font-bold text-gray-900">Demandes de visite</h1>
        <p className="mt-2 text-gray-600 text-fluid-base">
          Gérez les demandes de visite des clients
        </p>
      </div>

      {/* 2 colonnes dès le mobile : 4 cartes empilées obligeraient à
          faire défiler toute la page avant d'atteindre la liste */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
              <p className="text-fluid-2xl font-bold">{visitRequests.length}</p>
            </div>
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">En attente</p>
              <p className="text-fluid-2xl font-bold">
                {visitRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Confirmées</p>
              <p className="text-fluid-2xl font-bold">
                {visitRequests.filter(r => r.status === 'confirmed').length}
              </p>
            </div>
            <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Annulées</p>
              <p className="text-fluid-2xl font-bold">
                {visitRequests.filter(r => r.status === 'cancelled').length}
              </p>
            </div>
            <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 flex-shrink-0" />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={visitRequests}
        onEdit={(request) => setSelectedRequest(request)}
        onDelete={(request) => handleDelete(request.id)}
      />

      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Détails de la demande"
        >
          <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-xl max-w-2xl w-full max-h-[92dvh] sm:max-h-[90dvh] overflow-y-auto scroll-contain">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3 mb-6">
                <h2 className="text-fluid-2xl font-bold min-w-0">Détails de la demande</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Fermer"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedRequest.name}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="flex items-center gap-2 text-gray-900 min-w-0">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 hover:underline break-all">
                        {selectedRequest.email}
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${selectedRequest.phone}`} className="text-blue-600 hover:underline">
                        {selectedRequest.phone}
                      </a>
                    </div>
                  </div>

                  {selectedRequest.company && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Entreprise
                      </label>
                      <div className="flex items-center gap-2 text-gray-900">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        {selectedRequest.company}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date souhaitée
                    </label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(selectedRequest.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heure souhaitée
                    </label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {selectedRequest.heure || '—'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de visite
                    </label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {selectedRequest.type_visite ? {
                        guidee: 'Visite guidée',
                        autonome: 'Visite autonome',
                        virtuelle: 'Visite virtuelle',
                        rencontre: 'Rencontre',
                      }[selectedRequest.type_visite] || selectedRequest.type_visite : '—'}
                    </div>
                  </div>

                  {selectedRequest.infrastructure && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Infrastructure
                      </label>
                      <div className="flex items-center gap-2 text-gray-900">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        {selectedRequest.infrastructure.nom_fr}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reçue le
                    </label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {new Date(selectedRequest.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>

                {selectedRequest.message && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg text-gray-900">
                      {selectedRequest.message}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut actuel
                  </label>
                  {getStatusBadge(selectedRequest.status)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Changer le statut
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, 'pending')}
                      disabled={selectedRequest.status === 'pending'}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <AlertCircle className="w-4 h-4" />
                      En attente
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, 'confirmed')}
                      disabled={selectedRequest.status === 'confirmed'}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Confirmer
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, 'cancelled')}
                      disabled={selectedRequest.status === 'cancelled'}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-4 h-4" />
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
