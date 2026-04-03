import { useState, useEffect, FormEvent } from 'react';
import {
  Users, UserPlus, Shield, ShieldCheck, Edit3, Power,
  Trash2, Mail, Clock, Check, X, AlertCircle, ChevronDown, ChevronUp,
  Eye, Pencil, Ban
} from 'lucide-react';
import {
  adminApiService,
  AdminUser,
  UserInvitation,
  SectionPermission,
  SECTION_LABELS,
} from '../../services/adminApi';
import { authService } from '../../services/auth';

// ─── Permission Matrix Component ────────────────────────────

function PermissionMatrix({
  permissions,
  onChange,
  readOnly = false,
}: {
  permissions: Record<string, { read: boolean; write: boolean; delete: boolean }>;
  onChange?: (perms: Record<string, { read: boolean; write: boolean; delete: boolean }>) => void;
  readOnly?: boolean;
}) {
  const sections = Object.keys(SECTION_LABELS);

  const toggle = (section: string, action: 'read' | 'write' | 'delete') => {
    if (readOnly || !onChange) return;
    const current = permissions[section] || { read: false, write: false, delete: false };
    onChange({
      ...permissions,
      [section]: { ...current, [action]: !current[action] }
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="py-2 px-3 text-left font-medium text-slate-600">Section</th>
            <th className="py-2 px-3 text-center font-medium text-slate-600">
              <div className="flex items-center justify-center gap-1"><Eye size={14} /> Lire</div>
            </th>
            <th className="py-2 px-3 text-center font-medium text-slate-600">
              <div className="flex items-center justify-center gap-1"><Pencil size={14} /> Écrire</div>
            </th>
            <th className="py-2 px-3 text-center font-medium text-slate-600">
              <div className="flex items-center justify-center gap-1"><Ban size={14} /> Suppr.</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sections.map(section => {
            const perm = permissions[section] || { read: false, write: false, delete: false };
            return (
              <tr key={section} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-2 px-3 font-medium text-slate-700">{SECTION_LABELS[section]}</td>
                {(['read', 'write', 'delete'] as const).map(action => (
                  <td key={action} className="py-2 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggle(section, action)}
                      disabled={readOnly}
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
                        perm[action]
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-300'
                      } ${readOnly ? 'cursor-default' : 'cursor-pointer hover:opacity-80'}`}
                    >
                      {perm[action] ? <Check size={14} /> : <X size={14} />}
                    </button>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Role Badge Component ───────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    super_admin: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Super Admin' },
    admin: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Admin' },
    editor: { bg: 'bg-green-100', text: 'text-green-700', label: 'Éditeur' },
  };
  const c = config[role] || config.editor;
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

  // Invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'editor' as string,
  });
  const [invitePermissions, setInvitePermissions] = useState<
    Record<string, { read: boolean; write: boolean; delete: boolean }>
  >({});
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Edit permissions modal
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editPermissions, setEditPermissions] = useState<
    Record<string, { read: boolean; write: boolean; delete: boolean }>
  >({});
  const [editLoading, setEditLoading] = useState(false);

  // Expanded user row
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, invitationsData] = await Promise.all([
        adminApiService.getUsers(),
        adminApiService.getInvitations(),
      ]);
      setUsers(usersData);
      setInvitations(invitationsData);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  // ─── Invite ─────────────────────────────────────────────

  const handleInviteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviteLoading(true);

    try {
      const permissionsArray: SectionPermission[] = inviteForm.role === 'editor'
        ? Object.entries(invitePermissions)
            .filter(([, p]) => p.read || p.write || p.delete)
            .map(([section, p]) => ({
              section,
              can_read: p.read,
              can_write: p.write,
              can_delete: p.delete,
            }))
        : [];

      await adminApiService.createInvitation({
        email: inviteForm.email,
        role: inviteForm.role,
        permissions: permissionsArray.length > 0 ? permissionsArray : undefined,
      });

      setShowInviteModal(false);
      setInviteForm({ email: '', role: 'editor' });
      setInvitePermissions({});
      fetchData();
    } catch (err: any) {
      setInviteError(err?.response?.data?.message || 'Erreur lors de l\'envoi de l\'invitation.');
    } finally {
      setInviteLoading(false);
    }
  };

  // ─── Toggle Active ──────────────────────────────────────

  const handleToggleActive = async (userId: number) => {
    try {
      await adminApiService.toggleUserActive(userId);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur');
    }
  };

  // ─── Delete User ────────────────────────────────────────

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      await adminApiService.deleteUser(userId);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur');
    }
  };

  // ─── Revoke Invitation ──────────────────────────────────

  const handleRevokeInvitation = async (id: number) => {
    try {
      await adminApiService.revokeInvitation(id);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur');
    }
  };

  // ─── Save Permissions ───────────────────────────────────

  const handleSavePermissions = async () => {
    if (!editingUser) return;
    setEditLoading(true);

    try {
      const permissionsArray: SectionPermission[] = Object.entries(editPermissions)
        .filter(([, p]) => p.read || p.write || p.delete)
        .map(([section, p]) => ({
          section,
          can_read: p.read,
          can_write: p.write,
          can_delete: p.delete,
        }));

      await adminApiService.updateUserPermissions(editingUser.id, permissionsArray);
      setEditingUser(null);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur');
    } finally {
      setEditLoading(false);
    }
  };

  // ─── Loading / Error ────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
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
            Utilisateurs & Rôles
          </h1>
          <p className="text-slate-600 mt-1">
            {isSuperAdmin ? 'Gérez tous les utilisateurs' : 'Gérez les éditeurs'}
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
        >
          <UserPlus size={20} />
          Inviter un utilisateur
        </button>
      </div>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
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
                <th className="py-3 px-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(user => {
                const isSelf = user.id === currentUser?.id;
                const isEditor = user.role === 'editor';
                const canManage = !isSelf; // Can't manage yourself

                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
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
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })
                        : 'Jamais'
                      }
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        {isSelf ? (
                          <span className="text-xs text-slate-400 italic px-2">—</span>
                        ) : (
                          <>
                            {/* Expand permissions (editors only) */}
                            {isEditor && (
                              <button
                                onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Voir les permissions"
                              >
                                {expandedUser === user.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </button>
                            )}
                            {/* Edit permissions (editors only) */}
                            {isEditor && (
                              <button
                                onClick={() => {
                                  setEditingUser(user);
                                  setEditPermissions(user.permissions || {});
                                }}
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Modifier les permissions"
                              >
                                <Edit3 size={18} />
                              </button>
                            )}
                            {/* Toggle active */}
                            {canManage && (
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
                            )}
                            {/* Delete */}
                            {canManage && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="text-blue-600" size={24} />
                  Inviter un utilisateur
                </h2>
                <button
                  onClick={() => { setShowInviteModal(false); setInviteError(null); }}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-6 space-y-6">
              {inviteError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-red-800">{inviteError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="utilisateur@kamlog.cm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Rôle
                </label>
                <select
                  value={inviteForm.role}
                  onChange={e => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="editor">Éditeur</option>
                  {isSuperAdmin && <option value="admin">Administrateur</option>}
                  {isSuperAdmin && <option value="super_admin">Super Administrateur</option>}
                </select>
              </div>

              {inviteForm.role === 'editor' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Permissions par section
                  </label>
                  <PermissionMatrix
                    permissions={invitePermissions}
                    onChange={setInvitePermissions}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowInviteModal(false); setInviteError(null); }}
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

      {/* ─── Edit Permissions Modal ────────────────────────── */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" size={24} />
                  Permissions — {editingUser.name}
                </h2>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <PermissionMatrix
                permissions={editPermissions}
                onChange={setEditPermissions}
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  disabled={editLoading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {editLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Check size={18} />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
