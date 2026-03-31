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
    nom: '',
    description: '',
    secteur: '',
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
        nom: item.nom,
        description: item.description || '',
        secteur: item.secteur || '',
        logo: null,
      });
      if (item.logo) {
        setImagePreview(item.logo);
      }
    } else {
      setEditingItem(null);
      setFormData({
        nom: '',
        description: '',
        secteur: '',
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
      submitData.append('nom', formData.nom);
      submitData.append('description', formData.description);
      submitData.append('secteur', formData.secteur);
      if (formData.logo) {
        submitData.append('logo', formData.logo);
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
      key: 'logo',
      label: 'Logo',
      render: (item: Partenaire) =>
        item.logo ? (
          <img
            src={item.logo}
            alt={item.nom}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center text-slate-500 text-xs">
            N/A
          </div>
        ),
    },
    {
      key: 'nom',
      label: 'Nom',
    },
    {
      key: 'secteur',
      label: 'Secteur',
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Secteur
            </label>
            <input
              type="text"
              value={formData.secteur}
              onChange={(e) =>
                setFormData({ ...formData, secteur: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
