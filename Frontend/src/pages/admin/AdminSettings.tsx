import { useState, useEffect, FormEvent } from 'react';
import { User, Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle, Shield, History } from 'lucide-react';
import { authService } from '../../services/auth';
import { put } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../config/api';
import { adminApiService, AdminActionLog, AdminUser } from '../../services/adminApi';

type Tab = 'profile' | 'password' | 'history';

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
}

interface PasswordForm {
  current_password: string;
  password: string;
  password_confirmation: string;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8 caractères minimum', ok: password.length >= 8 },
    { label: 'Une majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Un chiffre', ok: /[0-9]/.test(password) },
    { label: 'Un caractère spécial (@$!%*#?&)', ok: /[@$!%*#?&]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const labels = ['Très faible', 'Faible', 'Moyen', 'Fort'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i < score ? colors[score - 1] : 'bg-slate-200'}`}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Force : <span className="font-medium">{password ? labels[score - 1] || 'Très faible' : ''}</span>
      </p>
      <ul className="space-y-1">
        {checks.map(c => (
          <li key={c.label} className={`flex items-center gap-1.5 text-xs ${c.ok ? 'text-green-600' : 'text-slate-400'}`}>
            <span className={`w-3 h-3 rounded-full flex items-center justify-center text-white ${c.ok ? 'bg-green-500' : 'bg-slate-300'}`}>
              {c.ok ? '✓' : ''}
            </span>
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminSettings() {
  const user = authService.getUser();
  const isSuperAdmin = user?.role === 'super_admin';
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [toast, setToast] = useState<Toast | null>(null);
  const [actionLogs, setActionLogs] = useState<AdminActionLog[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [selectedHistoryUser, setSelectedHistoryUser] = useState<string>('');
  const [historyUsers, setHistoryUsers] = useState<AdminUser[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPagination, setHistoryPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
  });

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (activeTab === 'history' && isSuperAdmin) {
      fetchActionLogs();
      fetchHistoryUsers();
    }
  }, [activeTab, isSuperAdmin, historyPage]);

  const fetchActionLogs = async () => {
    try {
      setHistoryLoading(true);
      const res = await adminApiService.getActionLogs({
        per_page: 10,
        page: historyPage,
        search: historySearch || undefined,
        user_id: selectedHistoryUser ? Number(selectedHistoryUser) : undefined,
      });
      setActionLogs(res.data);
      setHistoryPagination({
        total: res.pagination.total,
        per_page: res.pagination.per_page,
        current_page: res.pagination.current_page,
        last_page: res.pagination.last_page,
        from: res.pagination.from || 0,
        to: res.pagination.to || 0,
      });
    } catch (err: any) {
      showToast('error', err?.response?.data?.message || 'Erreur lors du chargement de l’historique.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchHistoryUsers = async () => {
    try {
      const users = await adminApiService.getUsers();
      setHistoryUsers(users);
    } catch {
      setHistoryUsers([]);
    }
  };

  const handleHistorySearch = () => {
    setHistoryPage(1);
    fetchActionLogs();
  };

  const handleExportCsv = () => {
    if (!actionLogs.length) {
      showToast('error', 'Aucune donnée à exporter.');
      return;
    }

    const rows = [
      ['Action', 'Utilisateur', 'Email', 'Méthode', 'Route', 'Heure'],
      ...actionLogs.map((log) => [
        log.action,
        log.user?.name || 'Utilisateur inconnu',
        log.user?.email || '',
        log.method,
        log.route,
        new Date(log.created_at).toLocaleString('fr-FR'),
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historique-actions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    if (!actionLogs.length) {
      showToast('error', 'Aucune donnée à exporter.');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1000,height=700');
    if (!printWindow) {
      showToast('error', 'Impossible d’ouvrir la fenêtre d’export PDF.');
      return;
    }

    const rowsHtml = actionLogs.map((log) => `
      <tr>
        <td>${log.action}</td>
        <td>${log.user?.name || 'Utilisateur inconnu'}</td>
        <td>${log.user?.email || '—'}</td>
        <td>${new Date(log.created_at).toLocaleString('fr-FR')}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Historique des actions</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>Historique des actions</h1>
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Heure</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await put<{ success: boolean; data: any; message: string }>(
        API_ENDPOINTS.admin.profile,
        {
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone || undefined,
        }
      );
      if (res.success) {
        authService.updateUser({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
        });
        showToast('success', 'Profil mis à jour avec succès.');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors
        ? Object.values(err.response.data.errors ?? {}).flat().join(' ')
        : 'Erreur lors de la mise à jour du profil.';
      showToast('error', typeof msg === 'string' ? msg : 'Erreur lors de la mise à jour.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.password_confirmation) {
      showToast('error', 'Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await put<{ success: boolean; data: { token: string }; message: string }>(
        API_ENDPOINTS.admin.profilePassword,
        passwordForm
      );
      if (res.success) {
        // Mettre à jour le token (le backend génère un nouveau token après changement de mot de passe)
        if (res.data?.token) {
          authService.setToken(res.data.token);
          authService.setTokenExpiry();
          authService.scheduleTokenRefresh();
        }
        setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
        showToast('success', 'Mot de passe mis à jour. Votre session reste active.');
      }
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        const msg = Object.values(errors).flat().join(' ');
        showToast('error', msg as string);
      } else {
        showToast('error', err?.response?.data?.message || 'Erreur lors du changement de mot de passe.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const roleLabel = user?.role === 'super_admin' ? 'Super Administrateur' : 'Administrateur';
  const roleBadgeColor = user?.role === 'super_admin'
    ? 'bg-purple-100 text-purple-700 border-purple-200'
    : 'bg-blue-100 text-blue-700 border-blue-200';

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Paramètres du compte</h1>
          <p className="text-slate-500 mt-1">Gérez vos informations personnelles et votre sécurité</p>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {toast.type === 'success'
              ? <CheckCircle size={18} />
              : <AlertCircle size={18} />}
            {toast.message}
          </div>
        )}

        {/* User Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {(user?.name ?? 'A')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
            <p className="text-sm text-slate-500 truncate">{user?.email}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${roleBadgeColor}`}>
            <Shield size={12} />
            {roleLabel}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6">
          {[
            { id: 'profile' as Tab, icon: User, label: 'Informations' },
            { id: 'password' as Tab, icon: Lock, label: 'Mot de passe' },
            ...(isSuperAdmin ? [{ id: 'history' as Tab, icon: History, label: 'Historique' }] : []),
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Informations */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Informations du compte</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre nom complet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Adresse email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@kamlog.cm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Téléphone <span className="text-slate-400 font-normal">(optionnel)</span>
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+237 6XX XXX XXX"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  {profileLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {profileLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab: Mot de passe */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Changer le mot de passe</h2>
            <p className="text-sm text-slate-500 mb-6">
              Votre session restera active après le changement. Un nouveau token sera émis automatiquement.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">

              {/* Mot de passe actuel */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Mot de passe actuel <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPwd ? 'text' : 'password'}
                    value={passwordForm.current_password}
                    onChange={e => setPasswordForm(p => ({ ...p, current_password: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre mot de passe actuel"
                  />
                  <button type="button" onClick={() => setShowCurrentPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nouveau mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    value={passwordForm.password}
                    onChange={e => setPasswordForm(p => ({ ...p, password: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nouveau mot de passe"
                  />
                  <button type="button" onClick={() => setShowNewPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrength password={passwordForm.password} />
              </div>

              {/* Confirmer le mot de passe */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirmer le nouveau mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPwd ? 'text' : 'password'}
                    value={passwordForm.password_confirmation}
                    onChange={e => setPasswordForm(p => ({ ...p, password_confirmation: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirmez le nouveau mot de passe"
                  />
                  <button type="button" onClick={() => setShowConfirmPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordForm.password_confirmation && passwordForm.password !== passwordForm.password_confirmation && (
                  <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas.</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  {passwordLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Lock size={16} />
                  )}
                  {passwordLoading ? 'Mise à jour...' : 'Changer le mot de passe'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'history' && isSuperAdmin && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Historique des actions</h2>
                <p className="text-sm text-slate-500 mt-1">Actions effectuées sur le dashboard par les administrateurs.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={handleExportPdf}
                  className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Export PDF
                </button>
                <button
                  type="button"
                  onClick={fetchActionLogs}
                  className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Actualiser
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Rechercher une action, route ou utilisateur"
                className="px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={selectedHistoryUser}
                onChange={(e) => setSelectedHistoryUser(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les utilisateurs</option>
                {historyUsers.map((historyUser) => (
                  <option key={historyUser.id} value={historyUser.id}>
                    {historyUser.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleHistorySearch}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Filtrer
              </button>
            </div>

            {historyLoading ? (
              <div className="py-10 flex justify-center">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : actionLogs.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                Aucun historique disponible pour le moment.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="py-3 pr-4 font-medium">Action</th>
                      <th className="py-3 pr-4 font-medium">Utilisateur</th>
                      <th className="py-3 pr-4 font-medium">Heure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actionLogs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-100 align-top">
                        <td className="py-4 pr-4">
                          <div className="font-medium text-slate-900">{log.action}</div>
                          <div className="text-xs text-slate-500 mt-1">{log.description || log.route}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="font-medium text-slate-900">{log.user?.name || 'Utilisateur inconnu'}</div>
                          <div className="text-xs text-slate-500 mt-1">{log.user?.email || '—'}</div>
                        </td>
                        <td className="py-4 pr-4 whitespace-nowrap text-slate-700">
                          {new Date(log.created_at).toLocaleString('fr-FR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex items-center justify-between gap-4 mt-4 text-sm text-slate-600">
                  <div>
                    Affichage de {historyPagination.from || 0} à {historyPagination.to || actionLogs.length} sur {historyPagination.total} actions
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={historyPagination.current_page <= 1}
                      onClick={() => setHistoryPage((page) => Math.max(1, page - 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <span>
                      Page {historyPagination.current_page} / {historyPagination.last_page}
                    </span>
                    <button
                      type="button"
                      disabled={historyPagination.current_page >= historyPagination.last_page}
                      onClick={() => setHistoryPage((page) => Math.min(historyPagination.last_page, page + 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
