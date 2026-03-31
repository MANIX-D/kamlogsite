import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Mail,
  MailOpen,
  Megaphone,
  Briefcase,
  Calendar,
  FileText,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const navItems = [
    {
      to: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      to: '/admin/actualites',
      icon: Newspaper,
      label: 'Actualités',
    },
    {
      to: '/admin/announcements',
      icon: Megaphone,
      label: 'Annonces',
    },
    {
      to: '/admin/job-offers',
      icon: Briefcase,
      label: 'Offres d\'emploi',
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
          {navItems.map((item) => {
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
        </nav>
      </aside>
    </>
  );
}
