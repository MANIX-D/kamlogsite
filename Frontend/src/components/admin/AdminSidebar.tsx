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
} from 'lucide-react';
import { authService } from '../../services/auth';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const user = authService.getUser();
  const isSuperAdmin = user?.role === 'super_admin';

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/partners', icon: Handshake, label: 'Partenaires' },
    { to: '/admin/infrastructures', icon: Building2, label: 'Infrastructures' },
    { to: '/admin/actualites', icon: Newspaper, label: 'Actualités' },
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
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 flex-shrink-0">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
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
