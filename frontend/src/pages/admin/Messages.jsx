import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const wa = import.meta.env.VITE_WHATSAPP_NUMBER;

  const load = () => api.get('/messages').then(r => setMessages(r.data));
  useEffect(() => { load(); }, []);

  const markLu = async (id) => {
    await api.put(`/messages/${id}/lu`);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Bouton hamburger (mobile) */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Messages</h1>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8">
          <div className="max-w-4xl">
            <div className="space-y-3 md:space-y-4">
              {messages.map(m => (
                <div 
                  key={m._id} 
                  className={`bg-white rounded-xl md:rounded-2xl border shadow-sm p-4 md:p-6 transition-all duration-300 hover:shadow-md ${
                    !m.lu ? 'border-rose-200 bg-gradient-to-r from-rose-50/30 to-white' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-lg shadow-md flex-shrink-0 ${
                        !m.lu ? 'bg-gradient-to-br from-rose-400 to-rose-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      }`}>
                        {m.nom.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm md:text-lg truncate">{m.nom}</p>
                        <p className="text-xs md:text-sm text-gray-500 truncate">{m.telephone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                      {!m.lu && (
                        <div className="flex items-center gap-1 md:gap-2 bg-rose-100 text-rose-600 px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-rose-500 rounded-full animate-pulse" />
                          <span className="hidden xs:inline">Nouveau</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(m.createdAt).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed bg-gray-50 rounded-lg md:rounded-xl p-3 md:p-4">
                    {m.message}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href={`https://wa.me/${wa}?text=${encodeURIComponent(`Bonjour ${m.nom}, ${m.message}`)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-xs bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-all duration-300 shadow-md shadow-green-500/30"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                      Répondre sur WhatsApp
                    </a>
                    {!m.lu && (
                      <button 
                        onClick={() => markLu(m._id)}
                        className="text-xs bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
                      >
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center py-16 md:py-20 bg-white rounded-2xl border border-gray-100">
                  <svg className="w-16 h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="text-gray-400 text-sm md:text-base">Aucun message</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}