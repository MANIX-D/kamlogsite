import { useEffect, useState, FormEvent } from 'react';
import { Plus, Filter, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { adminApiService, Actualite } from '../../services/adminApi';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';

const htmlToPlainText = (html: string) => {
  if (!html) return '';

  return html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\s*\/p\s*>/gi, '\n\n')
    .replace(/<\s*p[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const plainTextToHtml = (text: string) => {
  if (!text.trim()) return '';

  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');
};

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
    slug_fr: '',
    slug_en: '',
    type: 'article' as 'article' | 'annonce' | 'offre',
    location: '',
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
        contenu_fr: htmlToPlainText(item.contenu_fr),
        contenu_en: htmlToPlainText(item.contenu_en),
        slug_fr: (item as any).slug_fr || '',
        slug_en: (item as any).slug_en || '',
        type: item.type as 'article' | 'annonce' | 'offre',
        location: (item as any).location || '',
        date_publication: item.date_publication.split('T')[0],
        is_published: (item as any).is_published ?? true,
        image: null,
      });
      if ((item as any).image_url) {
        setImagePreview((item as any).image_url);
      } else if (item.image) {
        setImagePreview(item.image);
      }
    } else {
      setEditingItem(null);
      setFormData({
        titre_fr: '',
        titre_en: '',
        contenu_fr: '',
        contenu_en: '',
        slug_fr: '',
        slug_en: '',
        type: 'article',
        location: '',
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
      // Validate file size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('L\'image ne doit pas dépasser 2 MB. Veuillez choisir une image plus petite.');
        e.target.value = ''; // Reset input
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('L\'image doit être au format JPEG, JPG, PNG, GIF ou WEBP.');
        e.target.value = ''; // Reset input
        return;
      }

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
      const contenuFr = plainTextToHtml(formData.contenu_fr);
      const contenuEn = plainTextToHtml(formData.contenu_en);

      if (formData.image) {
        // Use FormData when an image file is selected
        const submitData = new FormData();
        submitData.append('titre_fr', formData.titre_fr);
        submitData.append('titre_en', formData.titre_en);
        submitData.append('contenu_fr', contenuFr);
        submitData.append('contenu_en', contenuEn);
        if (formData.slug_fr) submitData.append('slug_fr', formData.slug_fr);
        if (formData.slug_en) submitData.append('slug_en', formData.slug_en);
        submitData.append('type', formData.type);
        if (formData.location) submitData.append('location', formData.location);
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
          contenu_fr: contenuFr,
          contenu_en: contenuEn,
          type: formData.type,
          date_publication: formData.date_publication,
          is_published: formData.is_published,
        };
        if (formData.slug_fr) submitData.slug_fr = formData.slug_fr;
        if (formData.slug_en) submitData.slug_en = formData.slug_en;
        if (formData.location) submitData.location = formData.location;
        // Don't send image field when updating without a new image file

        if (editingItem) {
          await adminApiService.updateActualite(editingItem.id, submitData);
        } else {
          await adminApiService.createActualite(submitData);
        }
      }

      fetchActualites();
      handleCloseModal();
    } catch (err: any) {
      console.error('Error submitting actualite:', err);
      console.error('Error response:', err?.response);
      console.error('Error response data:', err?.response?.data);
      console.error('Validation errors:', err?.response?.data?.errors);
      
      let errorMessage = 'Erreur lors de l\'enregistrement';
      
      if (err?.response?.data?.errors) {
        // Format validation errors nicely
        const errors = err.response.data.errors;
        const errorList = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        errorMessage = `Erreur de validation:\n\n${errorList}`;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      console.error('Detailed error:', errorMessage);
      alert(errorMessage);
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

  const handleTogglePublished = async (item: Actualite) => {
    // Mise à jour optimiste de l'UI
    setActualites(prev => 
      prev.map(a => 
        a.id === item.id 
          ? { ...a, is_published: !a.is_published }
          : a
      )
    );

    try {
      const updateData = {
        titre_fr: item.titre_fr,
        titre_en: item.titre_en,
        contenu_fr: item.contenu_fr,
        contenu_en: item.contenu_en,
        type: item.type,
        date_publication: item.date_publication.split('T')[0],
        is_published: !item.is_published,
      };

      await adminApiService.updateActualite(item.id, updateData);
    } catch (err) {
      console.error('Error toggling published status:', err);
      // Annuler la mise à jour optimiste en cas d'erreur
      setActualites(prev => 
        prev.map(a => 
          a.id === item.id 
            ? { ...a, is_published: item.is_published }
            : a
        )
      );
      alert('Erreur lors de la modification de la visibilité');
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
    {
      key: 'is_published',
      label: 'Visibilité',
      render: (item: Actualite) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTogglePublished(item);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            item.is_published
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {item.is_published ? (
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
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-fluid-3xl font-bold text-slate-900">Actualités</h1>
          <p className="text-slate-600 mt-2 text-fluid-base">
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
          <option value="offre">Offres d'emploi</option>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as 'article' | 'annonce' | 'offre',
                  })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="article">Article</option>
                <option value="annonce">Annonce</option>
                <option value="offre">Offre d'emploi</option>
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

          {/* Location field - only for job offers */}
          {formData.type === 'offre' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lieu
              </label>
              <select
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un lieu</option>
                <option value="Douala, Cameroun">Douala, Cameroun</option>
                <option value="Kribi, Cameroun">Kribi, Cameroun</option>
              </select>
            </div>
          )}

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <p className="text-xs text-slate-500 mb-2">
              Formats acceptés : JPEG, JPG, PNG, GIF, WEBP • Taille maximale : 2 MB
            </p>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors">
                <ImageIcon size={20} />
                <span>Choisir une image</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
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
