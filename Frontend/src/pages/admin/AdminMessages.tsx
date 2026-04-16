import { useEffect, useState } from 'react';
import { Mail, CheckCircle, Trash2 } from 'lucide-react';
import { adminApiService, Message } from '../../services/adminApi';

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await adminApiService.getMessages();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (message: Message) => {
    try {
      await adminApiService.markMessageAsRead(message.id);
      fetchMessages();
    } catch (err) {
      console.error('Error marking message as read:', err);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (message: Message) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
    try {
      await adminApiService.deleteMessage(message.id);
      fetchMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-600 mt-2">
          Messages reçus via le formulaire de contact
        </p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
            <Mail size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">Aucun message</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-lg shadow-sm border p-6 transition-all ${
                message.lu
                  ? 'border-slate-200'
                  : 'border-blue-300 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {message.nom}
                    </h3>
                    {!message.lu && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>{message.email}</span>
                    {message.telephone && <span>{message.telephone}</span>}
                    <span>
                      {new Date(message.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!message.lu && (
                    <button
                      onClick={() => handleMarkAsRead(message)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      <CheckCircle size={16} />
                      <span>Marquer comme lu</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(message)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-sm font-medium text-slate-700">
                  Sujet:
                </span>{' '}
                <span className="text-slate-900">{message.sujet}</span>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700 whitespace-pre-wrap">
                  {message.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
