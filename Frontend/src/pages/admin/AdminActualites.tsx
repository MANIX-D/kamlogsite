import { useEffect, useState, FormEvent } from 'react';
import { Plus, Filter, Image as ImageIcon } from 'lucide-react';
import { adminApiService, Actualite } from '../../services/adminApi';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';

export default function AdminActualites() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Actualite | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titre_fr: '',
    titre_en: '',
    contenu_fr: '',
    contenu_en: '',
    type: 'article' as 'article' | 'annonce',
    date_publication: new Date().toISOString().split('T')[0],
    is_published: true,
    image: null as File | null,
  });

  useEffect(() => {
    fetchActualites();
  }, [filter]);

  const fetchActualites = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getActualites({
        type: filter || undefined,
      });
      setActualites(response.data);
    } catch (err) {
      console.error('Error fetching actualites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: Actualite) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        titre_fr: item.titre_fr,
        titre_en: item.titre_en,
        contenu_fr: item.contenu_fr,
        contenu_en: item.contenu_en,
        type: (item.type === 'offre' ? 'article' : item.type) as 'article' | 'annonce',
        date_publication: item.date_publication.split('T')[0],
        is_published: (item as any).is_published ?? true,
        image: null,
      });
      if (item.image) {
        setImagePreview(item.image);
      }
    } else {
      setEditingItem(null);
      setFormData({
        titre_fr: '',
        titre_en: '',
        contenu_fr: '',
        contenu_en: '',
        type: 'article',
        date_publication: new Date().toISOString().split('T')[0],
        is_published: true,
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
      if (formData.image) {
        // Use FormData when an image file is selected
        const submitData = new FormData();
        submitData.append('titre_fr', formData.titre_fr);
        submitData.append('titre_en', formData.titre_en);
        submitData.append('contenu_fr', formData.contenu_fr);
        submitData.append('contenu_en', formData.contenu_en);
        submitData.append('type', formData.type);
        submitData.append('date_publication', formData.date_publication);
        submitData.append('is_published', formData.is_published ? '1' : '0');
        submitData.append('image', formData.image);

        if (editingItem) {
          submitData.append('_method', 'PUT');
          await adminApiService.updateActualite(editingItem.id, submitData as any);
        } else {
          await adminApiService.createActualite(submitData as any);
        }
      } else {
        // No image file — send as JSON
        const submitData: Record<string, any> = {
          titre_fr: formData.titre_fr,
          titre_en: formData.titre_en,
          contenu_fr: formData.contenu_fr,
          contenu_en: formData.contenu_en,
          type: formData.type,
          date_publication: formData.date_publication,
          is_published: formData.is_published,
        };
        if (editingItem?.image) {
          submitData.image = editingItem.image;
        }

        if (editingItem) {
          await adminApiService.updateActualite(editingItem.id, submitData);
        } else {
          await adminApiService.createActualite(submitData);
        }
      }

      fetchActualites();
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting actualite:', err);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: Actualite) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?'))
      return;

    try {
      await adminApiService.deleteActualite(item.id);
      fetchActualites();
    } catch (err) {
      console.error('Error deleting actualite:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      key: 'titre_fr',
      label: 'Titre (FR)',
    },
    {
      key: 'titre_en',
      label: 'Titre (EN)',
    },
    {
      key: 'type',
      label: 'Type',
      render: (item: Actualite) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.type === 'article'
              ? 'bg-blue-100 text-blue-700'
              : item.type === 'annonce'
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-700'
          }`}
        >
          {item.type}
        </span>
      ),
    },
    {
      key: 'date_publication',
      label: 'Date',
      render: (item: Actualite) => {
        const d = new Date(item.date_publication);
        return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('fr-FR');
      },
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Actualités</h1>
          <p className="text-slate-600 mt-2">
            Gérer les articles, annonces et offres
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Ajouter</span>
        </button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Filter size={20} className="text-slate-500" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tous les types</option>
          <option value="article">Articles</option>
          <option value="annonce">Annonces</option>
        </select>
      </div>

      <DataTable
        data={actualites}
        columns={columns}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        loading={loading}
      />

      <FormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={editingItem ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
        loading={submitting}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Titre (Français)
              </label>
              <input
                type="text"
                value={formData.titre_fr}
                onChange={(e) =>
                  setFormData({ ...formData, titre_fr: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Titre (English)
              </label>
              <input
                type="text"
                value={formData.titre_en}
                onChange={(e) =>
                  setFormData({ ...formData, titre_en: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as 'article' | 'annonce',
                  })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="article">Article</option>
                <option value="annonce">Annonce</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date de publication
              </label>
              <input
                type="date"
                value={formData.date_publication}
                onChange={(e) =>
                  setFormData({ ...formData, date_publication: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) =>
                  setFormData({ ...formData, is_published: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">Publié (visible sur le site)</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contenu (Français)
              </label>
              <textarea
                value={formData.contenu_fr}
                onChange={(e) =>
                  setFormData({ ...formData, contenu_fr: e.target.value })
                }
                required
                rows={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contenu (English)
              </label>
              <textarea
                value={formData.contenu_en}
                onChange={(e) =>
                  setFormData({ ...formData, contenu_en: e.target.value })
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
