import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { adminApiService } from '../../services/adminApi';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await adminApiService.sendPasswordResetLink(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de l\'envoi. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          {sent ? (
            /* ─── Success State ─── */
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h1 className="text-fluid-2xl font-bold text-slate-900 mb-3">Email envoyé !</h1>
              <p className="text-slate-600 mb-2">
                Si un compte existe avec l'adresse <strong className="text-blue-600">{email}</strong>,
                vous recevrez un email avec :
              </p>
              <ul className="text-sm text-slate-500 text-left bg-slate-50 rounded-lg p-4 mb-6 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  Un <strong>lien sécurisé</strong> pour accéder à la page de vérification
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  Un <strong>code à 6 chiffres</strong> à saisir pour vérification
                </li>
              </ul>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-amber-800 font-medium">
                  ⏰ Le lien et le code expirent dans <strong>5 minutes</strong>
                </p>
              </div>
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft size={16} />
                Retour à la connexion
              </Link>
            </div>
          ) : (
            /* ─── Form State ─── */
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Shield className="text-blue-600" size={32} />
                </div>
                <h1 className="text-fluid-3xl font-bold text-slate-900 mb-2">
                  Mot de passe oublié ?
                </h1>
                <p className="text-slate-600">
                  Entrez votre adresse email pour recevoir un lien de réinitialisation.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                      placeholder="votre.email@kamlog.cm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Mail size={20} />
                      <span>Envoyer le lien</span>
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                <Link to="/admin/login" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                  <ArrowLeft size={14} />
                  Retour à la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
