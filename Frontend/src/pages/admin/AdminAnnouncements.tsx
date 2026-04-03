import { useState, useEffect, FormEvent } from 'react';
import { Plus, Eye, EyeOff } from 'lucide-react';
import { adminApiService } from '../../services/adminApi';
import { Announcement } from '../../types';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title_fr: '',
    title_en: '',
    content_fr: '',
    content_en: '',
    type: 'info' as string,
    priority: 'normal' as string,
    is_active: true,
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await adminApiService.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAnnouncement(null);
    setFormData({
      title_fr: '',
      title_en: '',
      content_fr: '',
      content_en: '',
      type: 'info',
      priority: 'normal',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title_fr: announcement.title_fr,
      title_en: announcement.title_en,
      content_fr: announcement.content_fr,
      content_en: announcement.content_en,
      type: (announcement as any).type || 'info',
      priority: String(announcement.priority || 'normal'),
      is_active: announcement.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    try {
      await adminApiService.deleteAnnouncement(id);
      await loadAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingAnnouncement) {
        await adminApiService.updateAnnouncement(editingAnnouncement.id, formData as any);
      } else {
        await adminApiService.createAnnouncement(formData as any);
      }
      setIsModalOpen(false);
      await loadAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'title_fr', label: 'Titre (FR)' },
    { key: 'title_en', label: 'Title (EN)' },
    {
      key: 'is_active',
      label: 'Statut',
      render: (item: Announcement) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {item.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {item.is_active ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    {
      key: 'priority',
      label: 'Priorité',
      render: (item: Announcement) => (
        <span className="text-sm font-medium">{item.priority || '-'}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date de création',
      render: (item: Announcement) => new Date(item.created_at).toLocaleDateString('fr-FR'),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Annonces</h1>
          <p className="text-gray-600 mt-1">Gérer les annonces du site</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle annonce
        </button>
      </div>

      <DataTable
        data={announcements}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(item: Announcement) => handleDelete(item.id)}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingAnnouncement ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
        loading={submitting}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Titre (Français)</label>
              <input
                type="text"
                value={formData.title_fr}
                onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title (English)</label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contenu (Français)</label>
              <textarea
                value={formData.content_fr}
                onChange={(e) => setFormData({ ...formData, content_fr: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Content (English)</label>
              <textarea
                value={formData.content_en}
                onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="info">Information</option>
                <option value="alerte">Alerte</option>
                <option value="maintenance">Maintenance</option>
                <option value="promotion">Promotion</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Priorité</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Basse</option>
                <option value="normal">Normale</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
            <div className="flex items-center pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Actif</span>
              </label>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
