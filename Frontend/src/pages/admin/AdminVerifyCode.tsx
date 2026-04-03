import { useState, useEffect, useRef, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminApiService } from '../../services/adminApi';

export default function AdminVerifyCode() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [validating, setValidating] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenError('Lien invalide.');
      setValidating(false);
      return;
    }

    const validate = async () => {
      try {
        const data = await adminApiService.validateResetToken(token);
        setMaskedEmail(data.email);
        setExpiresAt(data.expires_at);

        // If already verified, go straight to reset page
        if (data.verified) {
          navigate(`/admin/reset-password/${token}`, { replace: true });
          return;
        }
      } catch (err: any) {
        setTokenError(err?.response?.data?.message || 'Ce lien est invalide ou a expiré.');
      } finally {
        setValidating(false);
      }
    };

    validate();
  }, [token, navigate]);

  // Handle individual digit input
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only last digit
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Veuillez entrer les 6 chiffres du code.');
      return;
    }

    setLoading(true);

    try {
      await adminApiService.verifyResetCode(token!, fullCode);
      // Redirect to reset password page
      navigate(`/admin/reset-password/${token}`, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Code incorrect.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading ───────────────────────────────────────────
  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-300 font-medium">Vérification du lien...</p>
        </div>
      </div>
    );
  }

  // ─── Token Error ────────────────────────────────────────
  if (tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Lien expiré</h1>
          <p className="text-slate-600 mb-6">{tokenError}</p>
          <Link
            to="/admin/forgot-password"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  // ─── Verification Form ──────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <ShieldCheck className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Vérification
            </h1>
            <p className="text-slate-600">
              Entrez le code à 6 chiffres envoyé à <strong className="text-blue-600">{maskedEmail}</strong>
            </p>
          </div>

          {/* Countdown */}
          {expiresAt && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-center gap-2">
              <Clock className="text-amber-600" size={16} />
              <span className="text-sm text-amber-800 font-medium">
                Expire à {new Date(expiresAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 6-digit code input */}
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-300 rounded-xl
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                    text-slate-900 bg-slate-50"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || code.some(d => !d)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>Vérifier le code</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            <Link to="/admin/forgot-password" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
              <ArrowLeft size={14} />
              Renvoyer un code
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
