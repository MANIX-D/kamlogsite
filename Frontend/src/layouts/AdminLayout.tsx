import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import HelpButton from '../components/admin/HelpButton';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* min-w-0 + overflow-x-hidden : sans cela, un tableau large pousse
          cette colonne et provoque un scroll horizontal sur toute la page.
          Le scroll doit rester interne au conteneur du tableau. */}
      <div className="lg:pl-64 min-w-0 overflow-x-hidden">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 sm:p-6 min-w-0">
          <Outlet />
        </main>
      </div>

      <HelpButton />
    </div>
  );
}
