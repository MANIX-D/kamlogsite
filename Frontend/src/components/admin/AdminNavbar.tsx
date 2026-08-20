import { Menu, LogOut, User } from 'lucide-react';
import { authService } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

interface AdminNavbarProps {
  onMenuClick: () => void;
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between gap-2 px-3 sm:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden flex-shrink-0 text-slate-600 hover:text-slate-900 p-2"
        aria-label="Ouvrir le menu"
      >
        <Menu size={24} />
      </button>

      <div className="flex-1 min-w-0" />

      <div className="flex items-center gap-1 sm:gap-4 min-w-0">
        {/* Le nom est tronqué plutôt que de repousser le bouton hors de l'écran */}
        <div className="hidden xs:flex items-center gap-2 text-sm min-w-0">
          <User size={18} className="text-slate-500 flex-shrink-0" />
          <span className="text-slate-700 font-medium truncate">{user?.name}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex flex-shrink-0 items-center gap-2 px-2 sm:px-4 py-2 text-sm font-medium text-slate-700 hover:text-red-600 transition-colors"
          aria-label="Déconnexion"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}
