import { X } from 'lucide-react';
import { FormEvent } from 'react';
import { useOverlay } from '../../hooks/useOverlay';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  title: string;
  children: React.ReactNode;
  loading?: boolean;
}

export default function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  loading = false,
}: FormModalProps) {
  useOverlay(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* max-h en dvh : sur iOS, 90vh dépasse la zone visible et coupe le bas
          du formulaire. Sur mobile la modale s'ancre en bas de l'écran. */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-xl shadow-2xl max-w-2xl w-full max-h-[92dvh] sm:max-h-[90dvh] overflow-y-auto scroll-contain">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 min-w-0">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 sm:p-6">
          {children}

          {/* Boutons empilés et pleine largeur sur mobile, alignés à droite ensuite.
              L'action principale passe en premier au doigt. */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              )}
              <span>{loading ? 'Enregistrement...' : 'Enregistrer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
