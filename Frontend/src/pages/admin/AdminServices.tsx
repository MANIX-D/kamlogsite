import { useEffect, useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { adminApiService, Service } from '../../services/adminApi';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nom_fr: '',
    nom_en: '',
    description_fr: '',
    description_en: '',
    icon: '',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await adminApiService.getServices();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: Service) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        nom_fr: item.nom_fr,
        nom_en: item.nom_en,
        description_fr: item.description_fr,
        description_en: item.description_en,
        icon: item.icon || '',
        display_order: item.display_order || 0,
        is_active: item.is_active !== undefined ? item.is_active : true,
      });
    } else {
      setEditingItem(null);
      setFormData({
        nom_fr: '',
        nom_en: '',
        description_fr: '',
        description_en: '',
        icon: '',
        display_order: 0,
        is_active: true,
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingItem) {
        await adminApiService.updateService(editingItem.id, formData);
      } else {
        await adminApiService.createService(formData);
      }

      fetchServices();
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting service:', err);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: Service) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;

    try {
      await adminApiService.deleteService(item.id);
      fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      key: 'nom_fr',
      label: 'Nom (FR)',
    },
    {
      key: 'nom_en',
      label: 'Nom (EN)',
    },
    {
      key: 'is_active',
      label: 'Statut',
      render: (item: Service) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {item.is_active ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-fluid-3xl font-bold text-slate-900">Services</h1>
          <p className="text-slate-600 mt-2 text-fluid-base">Gérer les services proposés</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Ajouter</span>
        </button>
      </div>

      <DataTable
        data={services}
        columns={columns}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        loading={loading}
      />

      <FormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={editingItem ? 'Modifier le service' : 'Nouveau service'}
        loading={submitting}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom (Français)
              </label>
              <input
                type="text"
                value={formData.nom_fr}
                onChange={(e) =>
                  setFormData({ ...formData, nom_fr: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom (English)
              </label>
              <input
                type="text"
                value={formData.nom_en}
                onChange={(e) =>
                  setFormData({ ...formData, nom_en: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description (Français)
              </label>
              <textarea
                value={formData.description_fr}
                onChange={(e) =>
                  setFormData({ ...formData, description_fr: e.target.value })
                }
                required
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description (English)
              </label>
              <textarea
                value={formData.description_en}
                onChange={(e) =>
                  setFormData({ ...formData, description_en: e.target.value })
                }
                required
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Icône (lucide-react)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                placeholder="ex: Building2"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ordre d'affichage
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Statut
              </label>
              <select
                value={formData.is_active ? 'true' : 'false'}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.value === 'true' })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="true">Actif</option>
                <option value="false">Inactif</option>
              </select>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
