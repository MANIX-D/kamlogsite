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
} from 'lucide-react';
import { authService } from '../../services/auth';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Map sidebar items to their permission section keys
const SECTION_MAP: Record<string, string> = {
  '/admin/partners': 'partners',
  '/admin/infrastructures': 'infrastructures',
  '/admin/actualites': 'actualites',
  '/admin/quotes': 'quotes',
  '/admin/messages': 'messages',
  '/admin/newsletter': 'newsletter',
  '/admin/visit-requests': 'visit_requests',
};

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const user = authService.getUser();
  const isEditorOrHigher = user?.role === 'super_admin' || user?.role === 'admin';

  const navItems = [
    {
      to: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      to: '/admin/partners',
      icon: Handshake,
      label: 'Partenaires',
    },
    {
      to: '/admin/infrastructures',
      icon: Building2,
      label: 'Infrastructures',
    },
    {
      to: '/admin/actualites',
      icon: Newspaper,
      label: 'Actualités',
    },
    {
      to: '/admin/quotes',
      icon: FileText,
      label: 'Demandes de devis',
    },
    {
      to: '/admin/messages',
      icon: Mail,
      label: 'Messages',
    },
    {
      to: '/admin/newsletter',
      icon: MailOpen,
      label: 'Newsletter',
    },
    {
      to: '/admin/visit-requests',
      icon: Calendar,
      label: 'Demandes de visite',
    },
  ];

  // Filter nav items based on editor permissions
  const filteredNavItems = navItems.filter(item => {
    const section = SECTION_MAP[item.to];
    // Dashboard is always visible
    if (!section) return true;
    // super_admin and admin see everything
    if (isEditorOrHigher) return true;
    // editor: check permissions
    return authService.hasPermission(section, 'read');
  });

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}

          {/* Utilisateurs & Rôles — visible uniquement pour super_admin et admin */}
          {isEditorOrHigher && (
            <>
              <div className="pt-4 pb-2 px-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Administration
                </p>
              </div>
              <NavLink
                to="/admin/users"
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Users size={20} />
                <span className="font-medium">Utilisateurs & Rôles</span>
              </NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
