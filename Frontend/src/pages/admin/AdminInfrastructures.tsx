import { useEffect, useState, FormEvent } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { adminApiService, Infrastructure } from '../../services/adminApi';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';

export default function AdminInfrastructures() {
  const [infrastructures, setInfrastructures] = useState<Infrastructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Infrastructure | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nom_fr: '',
    nom_en: '',
    description_fr: '',
    description_en: '',
    surface: '',
    capacite: '',
    image: null as File | null,
  });

  useEffect(() => {
    fetchInfrastructures();
  }, []);

  const fetchInfrastructures = async () => {
    try {
      setLoading(true);
      const data = await adminApiService.getInfrastructures();
      setInfrastructures(data);
    } catch (err) {
      console.error('Error fetching infrastructures:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: Infrastructure) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        nom_fr: item.nom_fr,
        nom_en: item.nom_en,
        description_fr: item.description_fr,
        description_en: item.description_en,
        surface: item.surface || '',
        capacite: item.capacite || '',
        image: null,
      });
      if (item.image) {
        setImagePreview(item.image);
      }
    } else {
      setEditingItem(null);
      setFormData({
        nom_fr: '',
        nom_en: '',
        description_fr: '',
        description_en: '',
        surface: '',
        capacite: '',
        image: null,
      });
      setImagePreview(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('nom_fr', formData.nom_fr);
      submitData.append('nom_en', formData.nom_en);
      submitData.append('description_fr', formData.description_fr);
      submitData.append('description_en', formData.description_en);
      submitData.append('surface', formData.surface);
      submitData.append('capacite', formData.capacite);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingItem) {
        submitData.append('_method', 'PUT');
        await adminApiService.updateInfrastructure(editingItem.id, submitData);
      } else {
        await adminApiService.createInfrastructure(submitData);
      }

      fetchInfrastructures();
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting infrastructure:', err);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: Infrastructure) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette infrastructure ?'))
      return;

    try {
      await adminApiService.deleteInfrastructure(item.id);
      fetchInfrastructures();
    } catch (err) {
      console.error('Error deleting infrastructure:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      key: 'nom_fr',
      label: 'Nom (FR)',
    },
    {
      key: 'surface',
      label: 'Surface',
    },
    {
      key: 'capacite',
      label: 'Capacité',
    },
    {
      key: 'created_at',
      label: 'Créé le',
      render: (item: Infrastructure) =>
        new Date(item.created_at).toLocaleDateString('fr-FR'),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Infrastructures</h1>
          <p className="text-slate-600 mt-2">Gérer les infrastructures</p>
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
        data={infrastructures}
        columns={columns}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        loading={loading}
      />

      <FormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={
          editingItem ? 'Modifier l\'infrastructure' : 'Nouvelle infrastructure'
        }
        loading={submitting}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Surface
              </label>
              <input
                type="text"
                value={formData.surface}
                onChange={(e) =>
                  setFormData({ ...formData, surface: e.target.value })
                }
                placeholder="Ex: 5000 m²"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Capacité
              </label>
              <input
                type="text"
                value={formData.capacite}
                onChange={(e) =>
                  setFormData({ ...formData, capacite: e.target.value })
                }
                placeholder="Ex: 1000 conteneurs"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                rows={6}
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
                rows={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Image
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors">
                <ImageIcon size={20} />
                <span>Choisir une image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
