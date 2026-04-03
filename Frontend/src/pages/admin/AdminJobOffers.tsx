import { useState, useEffect, FormEvent } from 'react';
import { Plus, Eye, EyeOff, MapPin, Briefcase } from 'lucide-react';
import { adminApiService } from '../../services/adminApi';
import { JobOffer } from '../../types';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';

export default function AdminJobOffers() {
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobOffer, setEditingJobOffer] = useState<JobOffer | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title_fr: '',
    title_en: '',
    description_fr: '',
    description_en: '',
    requirements_fr: '',
    requirements_en: '',
    location: '',
    contract_type: 'CDI',
    experience_level: 'junior',
    salary_range: '',
    application_deadline: '',
    is_active: true,
  });

  useEffect(() => {
    loadJobOffers();
  }, []);

  const loadJobOffers = async () => {
    try {
      const data = await adminApiService.getJobOffers();
      setJobOffers(data);
    } catch (error) {
      console.error('Error loading job offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingJobOffer(null);
    setFormData({
      title_fr: '',
      title_en: '',
      description_fr: '',
      description_en: '',
      requirements_fr: '',
      requirements_en: '',
      location: '',
      contract_type: 'CDI',
      experience_level: 'junior',
      salary_range: '',
      application_deadline: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (jobOffer: JobOffer) => {
    setEditingJobOffer(jobOffer);
    setFormData({
      title_fr: jobOffer.title_fr,
      title_en: jobOffer.title_en,
      description_fr: jobOffer.description_fr,
      description_en: jobOffer.description_en,
      requirements_fr: jobOffer.requirements_fr,
      requirements_en: jobOffer.requirements_en,
      location: jobOffer.location,
      contract_type: jobOffer.contract_type,
      experience_level: jobOffer.experience_level,
      salary_range: jobOffer.salary_range || '',
      application_deadline: jobOffer.application_deadline?.split('T')[0] || '',
      is_active: jobOffer.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre d\'emploi ?')) return;

    try {
      await adminApiService.deleteJobOffer(id);
      await loadJobOffers();
    } catch (error) {
      console.error('Error deleting job offer:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingJobOffer) {
        await adminApiService.updateJobOffer(editingJobOffer.id, formData as any);
      } else {
        await adminApiService.createJobOffer(formData as any);
      }
      setIsModalOpen(false);
      await loadJobOffers();
    } catch (error) {
      console.error('Error saving job offer:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'title_fr', label: 'Poste (FR)' },
    {
      key: 'location',
      label: 'Localisation',
      render: (item: JobOffer) => (
        <span className="flex items-center gap-1 text-sm">
          <MapPin className="w-4 h-4 text-gray-400" />
          {item.location}
        </span>
      ),
    },
    {
      key: 'contract_type',
      label: 'Type',
      render: (item: JobOffer) => (
        <span className="flex items-center gap-1 text-sm">
          <Briefcase className="w-4 h-4 text-gray-400" />
          {item.contract_type}
        </span>
      ),
    },
    {
      key: 'experience_level',
      label: 'Expérience',
      render: (item: JobOffer) => (
        <span className="text-sm">{item.experience_level}</span>
      ),
    },
    {
      key: 'is_active',
      label: 'Statut',
      render: (item: JobOffer) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {item.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {item.is_active ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date de création',
      render: (item: JobOffer) => new Date(item.created_at).toLocaleDateString('fr-FR'),
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
          <h1 className="text-2xl font-bold text-gray-900">Offres d'emploi</h1>
          <p className="text-gray-600 mt-1">Gérer les offres d'emploi du site</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle offre
        </button>
      </div>

      <DataTable
        data={jobOffers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(item: JobOffer) => handleDelete(item.id)}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingJobOffer ? 'Modifier l\'offre' : 'Nouvelle offre d\'emploi'}
        loading={submitting}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Titre du poste (Français)</label>
              <input
                type="text"
                value={formData.title_fr}
                onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Job Title (English)</label>
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Description (Français)</label>
              <textarea
                value={formData.description_fr}
                onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description (English)</label>
              <textarea
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Exigences (Français)</label>
              <textarea
                value={formData.requirements_fr}
                onChange={(e) => setFormData({ ...formData, requirements_fr: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Requirements (English)</label>
              <textarea
                value={formData.requirements_en}
                onChange={(e) => setFormData({ ...formData, requirements_en: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Localisation</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type de contrat</label>
              <select
                value={formData.contract_type}
                onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Alternance">Alternance</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Niveau d'expérience</label>
              <select
                value={formData.experience_level}
                onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="junior">Débutant</option>
                <option value="confirme">Confirmé</option>
                <option value="senior">Senior</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fourchette salariale</label>
              <input
                type="text"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date limite de candidature</label>
              <input
                type="date"
                value={formData.application_deadline}
                onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
