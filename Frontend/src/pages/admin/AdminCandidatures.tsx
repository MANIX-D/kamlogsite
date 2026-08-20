import { useEffect, useState } from 'react';
import { Eye, Trash2, Filter } from 'lucide-react';
import { adminApiService, JobApplication } from '../../services/adminApi';
import DataTable from '../../components/admin/DataTable';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';

export default function AdminCandidatures() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : undefined;
      const data = await adminApiService.getJobApplications(params);
      setApplications(data.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await adminApiService.updateJobApplicationStatus(id, { status });
      fetchApplications();
      alert('Statut mis à jour avec succès');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (item: JobApplication) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) return;

    try {
      await adminApiService.deleteJobApplication(item.id);
      fetchApplications();
    } catch (err) {
      console.error('Error deleting application:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handlePreviewCv = async (cvPath?: string) => {
    if (!cvPath) return;

    try {
      setPreviewLoading(true);
      const token = localStorage.getItem('auth_token');
      const previewRequestUrl = `${API_BASE_URL}${API_ENDPOINTS.admin.files}/cvs/download?path=${encodeURIComponent(cvPath)}`;
      const response = await fetch(previewRequestUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('Preview failed');
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl(objectUrl);
      setShowPreviewModal(true);
    } catch (err) {
      console.error('Error previewing CV:', err);
      alert('Erreur lors de la prévisualisation du CV');
    } finally {
      setPreviewLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      en_cours: { label: 'En cours', color: 'bg-blue-100 text-blue-800' },
      acceptee: { label: 'Acceptée', color: 'bg-green-100 text-green-800' },
      refusee: { label: 'Refusée', color: 'bg-red-100 text-red-800' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.en_attente;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columns = [
    {
      key: 'full_name',
      label: 'Candidat',
      render: (item: JobApplication) => (
        <div>
          <div className="font-medium text-gray-900">
            {item.first_name} {item.last_name}
          </div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      ),
    },
    {
      key: 'job_offer',
      label: 'Offre',
      render: (item: JobApplication) => (
        <div className="text-sm">
          {item.job_offer?.titre_fr || `Offre #${item.job_offer_id}`}
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Téléphone',
    },
    {
      key: 'status',
      label: 'Statut',
      render: (item: JobApplication) => getStatusBadge(item.status),
    },
    {
      key: 'cv_url',
      label: 'CV',
      render: (item: JobApplication) =>
        item.cv_path ? (
          <button
            type="button"
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
            onClick={(e) => {
              e.stopPropagation();
              handlePreviewCv(item.cv_path);
            }}
          >
            <Eye size={16} />
            <span className="text-sm">Prévisualiser</span>
          </button>
        ) : (
          <span className="text-gray-400 text-sm">Aucun CV</span>
        ),
    },
    {
      key: 'application_date',
      label: 'Date',
      render: (item: JobApplication) =>
        new Date(item.application_date).toLocaleDateString('fr-FR'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: JobApplication) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(item);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors"
        >
          <Eye size={14} />
          <span>Détails</span>
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <div>
          <h1 className="text-fluid-3xl font-bold text-slate-900">Candidatures</h1>
          <p className="text-slate-600 mt-2 text-fluid-base">
            Gérer les candidatures aux offres d'emploi
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Filter size={20} className="text-gray-500 flex-shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filtrer par statut"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="acceptee">Acceptée</option>
            <option value="refusee">Refusée</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          {applications.length} candidature{applications.length > 1 ? 's' : ''}
        </div>
      </div>

      <DataTable
        data={applications}
        columns={columns}
        onDelete={handleDelete}
        loading={loading}
      />

      {showDetailsModal && selectedApplication && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Détails de la candidature"
        >
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92dvh] sm:max-h-[90dvh] overflow-y-auto scroll-contain">
            <div className="sticky top-0 z-10 bg-white p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-fluid-2xl font-bold text-gray-900 min-w-0">
                  Détails de la candidature
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Fermer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <p className="text-gray-900">{selectedApplication.first_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <p className="text-gray-900">{selectedApplication.last_name}</p>
                </div>
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 break-all">{selectedApplication.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <p className="text-gray-900">{selectedApplication.phone}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offre d'emploi
                </label>
                <p className="text-gray-900">
                  {selectedApplication.job_offer?.titre_fr || `Offre #${selectedApplication.job_offer_id}`}
                </p>
              </div>

              {selectedApplication.cover_letter && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lettre de motivation
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap break-words bg-gray-50 p-3 sm:p-4 rounded-lg leading-7 max-h-72 overflow-y-auto scroll-contain">
                    {selectedApplication.cover_letter}
                  </p>
                </div>
              )}

              {selectedApplication.cv_path && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CV
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePreviewCv(selectedApplication.cv_path)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
                  >
                    <Eye size={20} />
                    <span>Prévisualiser le CV</span>
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedApplication.status)}
                  <select
                    value={selectedApplication.status}
                    onChange={(e) => handleUpdateStatus(selectedApplication.id, e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en_attente">En attente</option>
                    <option value="en_cours">En cours</option>
                    <option value="acceptee">Acceptée</option>
                    <option value="refusee">Refusée</option>
                  </select>
                </div>
              </div>

              {selectedApplication.notes_admin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes admin
                  </label>
                  <p className="text-gray-900 bg-yellow-50 p-4 rounded-lg">
                    {selectedApplication.notes_admin}
                  </p>
                </div>
              )}

              <div className="text-sm text-gray-500">
                Candidature envoyée le{' '}
                {new Date(selectedApplication.application_date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
                    handleDelete(selectedApplication);
                    setShowDetailsModal(false);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Prévisualisation du CV"
        >
          {/* Presque plein écran sur mobile : un CV a besoin de place, et
              90vh est faussé par la barre d'URL sur iOS */}
          <div className="bg-white sm:rounded-2xl shadow-2xl w-full max-w-5xl h-dvh sm:h-[90dvh] flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-200 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-fluid-xl font-bold text-gray-900">Prévisualisation du CV</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Consultez le CV directement dans le tableau de bord.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={closePreviewModal}
                  className="text-gray-400 hover:text-gray-600 text-xl p-1"
                  aria-label="Fermer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100">
              {previewLoading ? (
                <div className="h-full flex items-center justify-center text-slate-600">
                  Chargement du CV...
                </div>
              ) : previewUrl ? (
                <iframe
                  src={previewUrl}
                  title="Prévisualisation du CV"
                  className="w-full h-full"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600">
                  Impossible d’afficher le CV.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
