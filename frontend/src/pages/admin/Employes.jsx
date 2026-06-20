import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';

export default function Employes() {
  const [employes, setEmployes] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = () => api.get('/employes', { params: { search } }).then(r => setEmployes(r.data));
  useEffect(() => { load(); }, [search]);

  const onCreate = async (data) => {
    try {
      if (editingId) {
        await api.put(`/employes/${editingId}`, data);
        toast.success('Employé modifié');
      } else {
        await api.post('/employes', data);
        toast.success('Employé ajouté');
      }
      setModal(false);
      setEditingId(null);
      reset();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const editEmploye = (employe) => {
    reset({
      nom: employe.nom,
      telephone: employe.telephone,
      email: employe.email || '',
      poste: employe.poste || '',
      adresse: employe.adresse || '',
    });
    setEditingId(employe._id);
    setModal(true);
  };

  const deleteEmploye = async (id) => {
    if (!confirm('Supprimer cet employé ?')) return;
    try {
      await api.delete(`/employes/${id}`);
      toast.success('Employé supprimé');
      load();
    } catch {
      toast.error('Erreur lors de la suppression');
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
          <h1 className="text-2xl font-bold text-gray-800">Employés</h1>
        </header>

        {/* Content */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input max-w-sm"
              placeholder="Rechercher par nom, téléphone ou email..."
            />
            <button 
              onClick={() => { setEditingId(null); reset(); setModal(true); }}
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-rose-600 transition-all duration-300 shadow-lg shadow-rose-500/30 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Nouvel employé
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Nom</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Téléphone</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Poste</th>
                  <th className="px-6 py-4 text-right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employes.map(e => (
                  <tr key={e._id} className="hover:bg-gray-50 transition-colors duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {e.nom.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{e.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{e.telephone}</td>
                    <td className="px-6 py-4 text-gray-600">{e.email || '-'}</td>
                    <td className="px-6 py-4">
                      {e.poste ? (
                        <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-medium">
                          {e.poste}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => editEmploye(e)} 
                          className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs transition-all duration-300"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Modifier
                        </button>
                        <button 
                          onClick={() => deleteEmploye(e._id)} 
                          className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs transition-all duration-300"
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
            {employes.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                </svg>
                <p className="text-gray-400">Aucun employé trouvé</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-xl">
                  {editingId ? "Modifier l'employé" : 'Nouvel employé'}
                </h2>
                <p className="text-sm text-gray-500">
                  {editingId ? 'Modifiez les informations' : 'Ajoutez un nouveau membre à l\'équipe'}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onCreate)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Nom complet *
                  </label>
                  <input {...register('nom', { required: true })} className="input pl-10" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Téléphone *
                  </label>
                  <input {...register('telephone', { required: true })} className="input pl-10" />
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </label>
                <input type="email" {...register('email')} className="input pl-10" placeholder="email@exemple.com" />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Poste / Fonction
                </label>
                <input {...register('poste')} className="input pl-10" placeholder="Ex: Vendeur, Caissier, Responsable boutique..." />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Adresse
                </label>
                <textarea {...register('adresse')} rows={2} className="input resize-none" placeholder="Adresse complète" />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => { setModal(false); setEditingId(null); reset(); }}
                  className="flex-1 border border-gray-200 rounded-xl py-3 text-sm text-gray-600 hover:bg-gray-50 font-medium transition-all duration-300"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-rose-500 text-white rounded-xl py-3 text-sm font-medium hover:bg-rose-600 transition-all duration-300 shadow-lg shadow-rose-500/30"
                >
                  {editingId ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}