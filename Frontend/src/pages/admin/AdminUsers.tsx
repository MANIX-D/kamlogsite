import { useState, useEffect, FormEvent } from 'react';
import {
  Users, UserPlus, Shield, Power,
  Trash2, Mail, Clock, X, AlertCircle,
} from 'lucide-react';
import {
  adminApiService,
  AdminUser,
  UserInvitation,
} from '../../services/adminApi';
import { authService } from '../../services/auth';

// ─── Role Badge ──────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    super_admin: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Super Admin' },
    admin:       { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Admin' },
  };
  const c = config[role] ?? config.admin;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${c.bg} ${c.text}`}>
      <Shield size={12} />
      {c.label}
    </span>
  );
}

// ─── Status Badge ────────────────────────────────────────────

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
      active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-500'}`} />
      {active ? 'Actif' : 'Inactif'}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────

export default function AdminUsers() {
  const currentUser = authService.getUser();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Invite modal (super_admin uniquement)
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, invitationsData] = await Promise.all([
        adminApiService.getUsers(),
        isSuperAdmin ? adminApiService.getInvitations() : Promise.resolve([]),
      ]);
      setUsers(usersData);
      setInvitations(invitationsData as UserInvitation[]);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur de chargement des données.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Invite ──────────────────────────────────────────────

  const handleInviteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);
    setInviteLoading(true);

    try {
      await adminApiService.createInvitation({
        email: inviteEmail,
        role: 'admin',
      });
      setInviteSuccess(`Invitation envoyée à ${inviteEmail}`);
      setInviteEmail('');
      fetchData();
    } catch (err: any) {
      setInviteError(err?.response?.data?.message || 'Erreur lors de l\'envoi de l\'invitation.');
    } finally {
      setInviteLoading(false);
    }
  };

  // ─── Toggle Active ───────────────────────────────────────

  const handleToggleActive = async (userId: number) => {
    try {
      await adminApiService.toggleUserActive(userId);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur');
    }
  };

  // ─── Delete User ─────────────────────────────────────────

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      await adminApiService.deleteUser(userId);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur');
    }
  };

  // ─── Revoke Invitation ───────────────────────────────────

  const handleRevokeInvitation = async (id: number) => {
    try {
      await adminApiService.revokeInvitation(id);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur');
    }
  };

  // ─── Loading / Error ─────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 flex items-center gap-2">
        <AlertCircle size={18} />
        {error}
      </div>
    );
  }

  const pendingInvitations = invitations.filter(i => i.status === 'pending');

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="text-blue-600" size={32} />
            Utilisateurs &amp; Rôles
          </h1>
          <p className="text-slate-600 mt-1">
            {isSuperAdmin
              ? 'Gérez tous les administrateurs et leurs accès'
              : 'Consultez la liste des administrateurs'}
          </p>
        </div>

        {/* Bouton invitation — super_admin uniquement */}
        {isSuperAdmin && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            <UserPlus size={20} />
            Inviter un admin
          </button>
        )}
      </div>

      {/* Invitations en attente — super_admin uniquement */}
      {isSuperAdmin && pendingInvitations.length > 0 && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2 mb-4">
            <Mail className="text-amber-600" size={20} />
            Invitations en attente ({pendingInvitations.length})
          </h2>
          <div className="space-y-3">
            {pendingInvitations.map(inv => (
              <div key={inv.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-amber-100">
                <div className="flex items-center gap-4">
                  <Mail className="text-amber-500" size={18} />
                  <div>
                    <p className="font-medium text-slate-900">{inv.email}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={12} />
                      Expire le {new Date(inv.expires_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      {inv.invited_by && <span> • Par {inv.invited_by.name}</span>}
                    </p>
                  </div>
                  <RoleBadge role={inv.role} />
                </div>
                <button
                  onClick={() => handleRevokeInvitation(inv.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="Révoquer l'invitation"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Utilisateur</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Rôle</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Statut</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Dernière connexion</th>
                {isSuperAdmin && (
                  <th className="py-3 px-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(user => {
                const isSelf = user.id === currentUser?.id;

                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 flex items-center gap-2">
                            {user.name}
                            {isSelf && (
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">VOUS</span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge active={user.is_active} />
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })
                        : 'Jamais'}
                    </td>
                    {isSuperAdmin && (
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          {isSelf ? (
                            <span className="text-xs text-slate-400 italic px-2">—</span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleToggleActive(user.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  user.is_active
                                    ? 'text-amber-600 hover:bg-amber-50'
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={user.is_active ? 'Désactiver' : 'Activer'}
                              >
                                <Power size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Users className="mx-auto mb-3 text-slate-300" size={48} />
            <p>Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      {/* ─── Invite Modal ─────────────────────────────────── */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="text-blue-600" size={24} />
                Inviter un administrateur
              </h2>
              <button
                onClick={() => { setShowInviteModal(false); setInviteError(null); setInviteSuccess(null); }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-6 space-y-5">
              {inviteError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-red-800">{inviteError}</p>
                </div>
              )}
              {inviteSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                  ✓ {inviteSuccess}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="nouvel.admin@kamlog.cm"
                />
              </div>

              <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-800">
                <p className="font-medium mb-1">Rôle attribué : Administrateur</p>
                <p className="text-blue-600 text-xs">
                  L'administrateur aura accès à tout le contenu mais ne pourra pas inviter d'autres utilisateurs.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowInviteModal(false); setInviteError(null); setInviteSuccess(null); }}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {inviteLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Mail size={18} />
                      Envoyer l'invitation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
