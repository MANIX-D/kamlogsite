import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Mail,
  MailOpen,
  Calendar,
  FileText,
  X,
  Handshake,
  Building2,
  Users,
  Settings,
  Briefcase,
} from 'lucide-react';
import { authService } from '../../services/auth';
import { useOverlay } from '../../hooks/useOverlay';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const user = authService.getUser();
  const isSuperAdmin = user?.role === 'super_admin';

  // Verrou du scroll + Échap uniquement quand la sidebar est en mode tiroir.
  // Au-delà de 1024px elle est permanente et ne doit rien verrouiller.
  // Suivi réactif : sans écouteur, une rotation ou un redimensionnement
  // laisserait le scroll verrouillé alors que la sidebar devient permanente.
  const [isDrawer, setIsDrawer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1023px)');
    const sync = () => setIsDrawer(query.matches);

    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useOverlay(isOpen && isDrawer, onClose);

  // Referme le tiroir quand on repasse en affichage permanent
  useEffect(() => {
    if (!isDrawer && isOpen) onClose();
  }, [isDrawer, isOpen, onClose]);

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/partners', icon: Handshake, label: 'Partenaires' },
    { to: '/admin/infrastructures', icon: Building2, label: 'Infrastructures' },
    { to: '/admin/actualites', icon: Newspaper, label: 'Actualités' },
    { to: '/admin/candidatures', icon: Briefcase, label: 'Candidatures' },
    { to: '/admin/quotes', icon: FileText, label: 'Demandes de devis' },
    { to: '/admin/messages', icon: Mail, label: 'Messages' },
    { to: '/admin/newsletter', icon: MailOpen, label: 'Newsletter' },
    { to: '/admin/visit-requests', icon: Calendar, label: 'Demandes de visite' },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* h-dvh plutôt que h-full : sur iOS, l'ouverture du clavier virtuel
          fausse la hauteur d'un élément fixe en 100% */}
      <aside
        className={`fixed top-0 left-0 h-dvh w-64 max-w-[85vw] bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        aria-label="Navigation administration"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold">Admin Panel</h2>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1"
            aria-label="Fermer le menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation principale */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={linkClass}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}

          {/* Section Administration — visible pour les deux rôles */}
          <div className="pt-4 pb-2 px-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Administration
            </p>
          </div>

          <NavLink to="/admin/users" onClick={onClose} className={linkClass}>
            <Users size={20} />
            <span className="font-medium">Utilisateurs</span>
          </NavLink>
        </nav>

        {/* Section Compte — toujours en bas */}
        <div className="p-4 border-t border-slate-800 space-y-1 flex-shrink-0">
          <div className="pb-2 px-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Compte
            </p>
          </div>
          <NavLink to="/admin/settings" onClick={onClose} className={linkClass}>
            <Settings size={20} />
            <span className="font-medium">Paramètres</span>
          </NavLink>

          {/* Badge rôle */}
          <div className="px-4 pt-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              isSuperAdmin
                ? 'bg-purple-900/50 text-purple-300'
                : 'bg-blue-900/50 text-blue-300'
            }`}>
              {isSuperAdmin ? 'Super Admin' : 'Administrateur'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
