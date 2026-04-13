import { useEffect, useState, FormEvent } from 'react';
import { Plus, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
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
    category: '',
    logo: null as File | null,
    is_featured: false,
    display_order: 0,
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
        category: item.category || '',
        logo: null,
        is_featured: item.is_featured || false,
        display_order: item.display_order || 0,
      });
      if (item.logo_url) {
        setImagePreview(item.logo_url);
      }
    } else {
      setEditingItem(null);
      setFormData({
        name_fr: '',
        name_en: '',
        category: '',
        logo: null,
        is_featured: false,
        display_order: 0,
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
      submitData.append('category', formData.category);
      submitData.append('is_featured', formData.is_featured ? '1' : '0');
      submitData.append('display_order', formData.display_order.toString());
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

  const handleToggleActive = async (item: Partenaire) => {
    try {
      const updateData = {
        name_fr: item.name_fr,
        name_en: item.name_en,
        category: item.category || '',
        is_active: !item.is_active,
        is_featured: item.is_featured || false,
        display_order: item.display_order || 0,
      };

      await adminApiService.updatePartenaire(item.id, updateData);
      fetchPartenaires();
    } catch (err) {
      console.error('Error toggling active status:', err);
      alert('Erreur lors de la modification du statut');
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
      key: 'category',
      label: 'Catégorie',
      render: (item: Partenaire) => {
        const categoryLabels: Record<string, string> = {
          maritime: 'Partenaires maritimes',
          logistics: 'Partenaires logistiques',
          industrial: 'Partenaires industriels',
          institutional: 'Partenaires institutionnels',
        };
        return categoryLabels[item.category || ''] || item.category || '—';
      },
    },
    {
      key: 'is_active',
      label: 'Statut',
      render: (item: Partenaire) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleActive(item);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            item.is_active
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {item.is_active ? (
            <>
              <Eye size={14} />
              <span>Actif</span>
            </>
          ) : (
            <>
              <EyeOff size={14} />
              <span>Inactif</span>
            </>
          )}
        </button>
      ),
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
          <p className="text-slate-600 mt-2">Gérer les partenaires affichés sur la page publique</p>
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
                Nom (Français) *
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
                Nom (English) *
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Catégorie *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Sélectionner une catégorie --</option>
              <option value="maritime">Partenaires maritimes</option>
              <option value="logistics">Partenaires logistiques</option>
              <option value="industrial">Partenaires industriels</option>
              <option value="institutional">Partenaires institutionnels</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Logo
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors w-fit">
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
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm">
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-900">{formData.name_fr || 'Nom du partenaire'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData({ ...formData, is_featured: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                Partenaire en vedette
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ordre d'affichage
              </label>
              <input
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
