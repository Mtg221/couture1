import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const wa = import.meta.env.VITE_WHATSAPP_NUMBER;

  const load = () => api.get('/messages').then(r => setMessages(r.data));
  useEffect(() => { load(); }, []);

  const markLu = async (id) => {
    await api.put(`/messages/${id}/lu`);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-rose-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
        </div>
        <div className="space-y-4">
          {messages.map(m => (
            <div key={m._id} className={`bg-white rounded-2xl border shadow-sm p-5 ${!m.lu ? 'border-rose-200' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{m.nom}</p>
                  <p className="text-sm text-gray-500">{m.telephone}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!m.lu && <span className="w-2 h-2 bg-rose-500 rounded-full" />}
                  <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-3">{m.message}</p>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${m.telephone.replace(/\s/g, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-lg font-medium hover:bg-green-100"
                >
                  Répondre sur WhatsApp
                </a>
                {!m.lu && (
                  <button onClick={() => markLu(m._id)}
                    className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-200">
                    Marquer comme lu
                  </button>
                )}
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="text-center py-10 text-gray-400">Aucun message</p>}
        </div>
      </div>
    </div>
  );
}