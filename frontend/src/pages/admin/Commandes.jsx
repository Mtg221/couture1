import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';

const STATUTS = ['tous', 'en_attente', 'en_cours', 'prete', 'livree', 'refusee'];
const COLORS  = {
  en_attente: 'bg-amber-100 text-amber-700',
  en_cours:   'bg-blue-100 text-blue-700',
  prete:      'bg-green-100 text-green-700',
  livree:     'bg-gray-100 text-gray-600',
  refusee:    'bg-red-100 text-red-600',
};

export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [statut, setStatut]       = useState('tous');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commandeToDelete, setCommandeToDelete] = useState(null);

  useEffect(() => {
    const params = statut !== 'tous' ? { statut } : {};
    api.get('/commandes', { params }).then(r => setCommandes(r.data));
  }, [statut]);

  const confirmDelete = (id) => {
    setCommandeToDelete(id);
    setShowDeleteModal(true);
  };

  const deleteCommande = async () => {
    try {
      await api.delete(`/commandes/${commandeToDelete}`);
      toast.success('Commande supprimée');
      setCommandes(commandes.filter(c => c._id !== commandeToDelete));
      setShowDeleteModal(false);
      setCommandeToDelete(null);
    } catch {
      toast.error('Erreur lors de la suppression');
      setShowDeleteModal(false);
      setCommandeToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 sticky top-0 z-20 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Commandes</h1>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Filtres */}
          <div className="flex gap-3 flex-wrap mb-8">
            {STATUTS.map(s => (
              <button 
                key={s} 
                onClick={() => setStatut(s)}
                className={`px-5 py-2.5 rounded-full text-sm capitalize font-medium transition-all duration-300 ${
                  statut === s 
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 transform scale-105' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Tableau */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Client</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Vêtement</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Statut</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {commandes.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50 transition-colors duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {c.client?.nom?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <span className="font-medium text-gray-800">{c.client?.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {c.vetements?.length > 0 
                        ? `${c.vetements[0].typeVetement}${c.vetements.length > 1 ? ` (+${c.vetements.length - 1})` : ''}`
                        : c.typeVetement || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                        c.vetements?.[0]?.statut ? COLORS[c.vetements[0].statut] : COLORS[c.statut]
                      }`}>
                        {(c.vetements?.[0]?.statut || c.statut || 'en_attente').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          to={`/admin/commandes/${c._id}`} 
                          className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-600 font-medium bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs transition-all duration-300"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Voir
                        </Link>
                        <button 
                          onClick={() => confirmDelete(c._id)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs transition-all duration-300"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {commandes.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-400">Aucune commande trouvée</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Confirmer la suppression</h3>
            <p className="text-gray-600 text-center mb-6">
              Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCommandeToDelete(null);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-medium transition-all duration-300"
              >
                Annuler
              </button>
              <button
                onClick={deleteCommande}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg shadow-red-500/30"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}