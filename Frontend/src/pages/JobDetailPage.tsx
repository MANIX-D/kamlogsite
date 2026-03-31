import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Briefcase,
  Clock,
  CheckCircle,
  ArrowLeft,
  Send,
  DollarSign,
  FileText,
} from 'lucide-react';
import { apiService, JobOffer } from '../services/api';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [job, setJob] = useState<JobOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchJobDetails(parseInt(id));
    }
  }, [id]);

  const fetchJobDetails = async (jobId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getJobOffer(jobId);
      setJob(response.data);
    } catch (err) {
      setError(t('jobs.error.fetch'));
      console.error('Error fetching job details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f3878]"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || t('jobs.error.notFound')}</p>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-[#1f3878] font-semibold hover:underline"
          >
            <ArrowLeft size={20} />
            {t('jobs.backToNews')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-[#1f3878] font-semibold hover:underline mb-8"
        >
          <ArrowLeft size={20} />
          {t('jobs.backToNews')}
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {job.image_url && (
            <div className="h-64 overflow-hidden">
              <img
                src={job.image_url}
                alt={job.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
                <Briefcase size={16} />
                {t('jobs.badge')}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {job.title}
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="text-[#1f3878]" size={20} />
                <span className="font-medium">{job.location}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="text-[#1f3878]" size={20} />
                <span>{t('jobs.published')}: {formatDate(job.published_at)}</span>
              </div>

              {job.contract_type && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="text-[#1f3878]" size={20} />
                  <span>{job.contract_type}</span>
                </div>
              )}

              {job.salary_range && (
                <div className="flex items-center gap-3 text-gray-700">
                  <DollarSign className="text-[#1f3878]" size={20} />
                  <span>{job.salary_range}</span>
                </div>
              )}

              {job.application_deadline && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FileText className="text-[#1f3878]" size={20} />
                  <span>{t('jobs.deadline')}: {formatDate(job.application_deadline)}</span>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('jobs.description.title')}
              </h2>
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job.content }}
              />
            </div>

            {job.requirements && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('jobs.requirements.title')}
                </h2>
                <div
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('jobs.skills.title')}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium"
                    >
                      <CheckCircle size={16} />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('jobs.apply.title')}
              </h3>
              <p className="text-gray-700 mb-6">
                {t('jobs.apply.description')}
              </p>
              <button
                onClick={() => setShowApplicationModal(true)}
                className="inline-flex items-center gap-2 bg-[#1f3878] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#152b5e] transition-colors shadow-lg hover:shadow-xl"
              >
                <Send size={20} />
                {t('jobs.apply.button')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showApplicationModal && (
        <ApplicationModal
          jobId={job.id}
          jobTitle={job.title}
          onClose={() => setShowApplicationModal(false)}
        />
      )}
    </div>
  );
}

function ApplicationModal({
  jobId,
  jobTitle,
  onClose,
}: {
  jobId: number;
  jobTitle: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await apiService.submitJobApplication(jobId, formData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(t('jobs.apply.error'));
      console.error('Error submitting application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {t('jobs.apply.success.title')}
          </h3>
          <p className="text-gray-600">{t('jobs.apply.success.message')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {t('jobs.apply.modal.title')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <p className="text-gray-700 mb-6">
          {t('jobs.apply.modal.subtitle')}: <strong>{jobTitle}</strong>
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('jobs.apply.form.firstName')} *
              </label>
              <input
                type="text"
                name="first_name"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1f3878] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('jobs.apply.form.lastName')} *
              </label>
              <input
                type="text"
                name="last_name"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1f3878] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('jobs.apply.form.email')} *
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1f3878] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('jobs.apply.form.phone')} *
            </label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1f3878] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('jobs.apply.form.cv')} * (PDF)
            </label>
            <input
              type="file"
              name="cv"
              accept=".pdf"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1f3878] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('jobs.apply.form.coverLetter')}
            </label>
            <textarea
              name="cover_letter"
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1f3878] focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {t('jobs.apply.form.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-[#1f3878] text-white rounded-lg font-semibold hover:bg-[#152b5e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? t('jobs.apply.form.submitting') : t('jobs.apply.form.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
