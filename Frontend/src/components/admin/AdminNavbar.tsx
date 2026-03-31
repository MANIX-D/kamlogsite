import { Menu, LogOut, User } from 'lucide-react';
import { authService } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

interface AdminNavbarProps {
  onMenuClick: () => void;
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-600 hover:text-slate-900"
      >
        <Menu size={24} />
      </button>

      <div className="flex-1 lg:ml-0" />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <User size={18} className="text-slate-500" />
          <span className="text-slate-700 font-medium">{user?.name}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </header>
  );
}
