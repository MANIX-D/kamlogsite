import { useEffect, useState, FormEvent } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { adminApiService, Partenaire } from '../../services/adminApi';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';

export default function AdminPartenaires() {
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partenaire | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name_fr: '',
    name_en: '',
    description_fr: '',
    description_en: '',
    category: '',
    website: '',
    logo: null as File | null,
  });

  useEffect(() => {
    fetchPartenaires();
  }, []);

  const fetchPartenaires = async () => {
    try {
      setLoading(true);
      const data = await adminApiService.getPartenaires();
      setPartenaires(data);
    } catch (err) {
      console.error('Error fetching partenaires:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: Partenaire) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name_fr: item.name_fr,
        name_en: item.name_en,
        description_fr: item.description_fr || '',
        description_en: item.description_en || '',
        category: item.category || '',
        website: item.website || '',
        logo: null,
      });
      if (item.logo_url) {
        setImagePreview(item.logo_url);
      }
    } else {
      setEditingItem(null);
      setFormData({
        name_fr: '',
        name_en: '',
        description_fr: '',
        description_en: '',
        category: '',
        website: '',
        logo: null,
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
      setFormData({ ...formData, logo: file });
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
      submitData.append('name_fr', formData.name_fr);
      submitData.append('name_en', formData.name_en);
      submitData.append('description_fr', formData.description_fr);
      submitData.append('description_en', formData.description_en);
      submitData.append('category', formData.category);
      submitData.append('website', formData.website);
      if (formData.logo) {
        submitData.append('logo_url', formData.logo);
      }

      if (editingItem) {
        submitData.append('_method', 'PUT');
        await adminApiService.updatePartenaire(editingItem.id, submitData);
      } else {
        await adminApiService.createPartenaire(submitData);
      }

      fetchPartenaires();
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting partenaire:', err);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: Partenaire) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) return;

    try {
      await adminApiService.deletePartenaire(item.id);
      fetchPartenaires();
    } catch (err) {
      console.error('Error deleting partenaire:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      key: 'logo_url',
      label: 'Logo',
      render: (item: Partenaire) =>
        item.logo_url ? (
          <img
            src={item.logo_url}
            alt={item.name_fr}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center text-slate-500 text-xs">
            N/A
          </div>
        ),
    },
    {
      key: 'name_fr',
      label: 'Nom (FR)',
    },
    {
      key: 'name_en',
      label: 'Nom (EN)',
    },
    {
      key: 'category',
      label: 'Catégorie',
    },
    {
      key: 'created_at',
      label: 'Créé le',
      render: (item: Partenaire) =>
        new Date(item.created_at).toLocaleDateString('fr-FR'),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Partenaires</h1>
          <p className="text-slate-600 mt-2">Gérer les partenaires</p>
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
        data={partenaires}
        columns={columns}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        loading={loading}
      />

      <FormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={editingItem ? 'Modifier le partenaire' : 'Nouveau partenaire'}
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
                value={formData.name_fr}
                onChange={(e) =>
                  setFormData({ ...formData, name_fr: e.target.value })
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
                value={formData.name_en}
                onChange={(e) =>
                  setFormData({ ...formData, name_en: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Sélectionner --</option>
                <option value="logistique">Logistique</option>
                <option value="transport">Transport</option>
                <option value="technologie">Technologie</option>
                <option value="financier">Financier</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Site web
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://..."
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
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Logo
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors">
                <ImageIcon size={20} />
                <span>Choisir un logo</span>
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
