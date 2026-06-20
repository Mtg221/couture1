import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';

const CATEGORIES = ['robe', 'costume', 'boubou', 'tailleur', 'enfant', 'autre'];

export default function GalerieAdmin() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [file, setFile]   = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const load = () => api.get('/galerie').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const onAdd = async (data) => {
    if (!file) return toast.error('Sélectionnez une image');
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => form.append(k, v));
    form.append('image', file);
    try {
      await api.post('/galerie', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Photo ajoutée'); setModal(false); reset(); setFile(null); load();
    } catch { toast.error('Erreur'); }
  };

  const onDelete = async (id) => {
    if (!confirm('Supprimer cette photo ?')) return;
    await api.delete(`/galerie/${id}`);
    toast.success('Photo supprimée'); load();
  };

  const toggleVisible = async (item) => {
    await api.put(`/galerie/${item._id}`, { visible: !item.visible });
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 sticky top-0 z-20 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Galerie</h1>
        </header>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500">Gérez les photos de votre galerie</p>
            <button 
              onClick={() => setModal(true)}
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-rose-600 transition-all duration-300 shadow-lg shadow-rose-500/30 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter une photo
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map(item => (
              <div key={item._id} className="relative group rounded-2xl overflow-hidden bg-gray-100 aspect-square shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <img src={item.imageUrl} alt={item.titre} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end gap-3 p-4">
                  <button 
                    onClick={() => toggleVisible(item)}
                    className={`text-xs px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      item.visible 
                        ? 'bg-white/90 text-gray-800 hover:bg-white' 
                        : 'bg-rose-500 text-white hover:bg-rose-600'
                    }`}
                  >
                    {item.visible ? 'Masquer' : 'Afficher'}
                  </button>
                  <button 
                    onClick={() => onDelete(item._id)}
                    className="text-xs bg-red-500 text-white px-4 py-2 rounded-full font-medium hover:bg-red-600 transition-all duration-300 shadow-lg"
                  >
                    Supprimer
                  </button>
                </div>
                {!item.visible && (
                  <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
                    Masqué
                  </div>
                )}
                {item.titre && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-xs font-medium truncate">{item.titre}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-20">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400">Aucune photo dans la galerie</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-xl">Ajouter une photo</h2>
                <p className="text-sm text-gray-500">Ajoutez une nouvelle création à la galerie</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onAdd)} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Image
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:bg-rose-50 file:text-rose-600 file:text-sm file:font-medium hover:file:bg-rose-100 transition-colors" 
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Titre
                </label>
                <input {...register('titre')} className="input pl-10" placeholder="Ex: Robe de soirée" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select {...register('categorie')} className="input">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Description
                </label>
                <textarea {...register('description')} rows={3} className="input resize-none" placeholder="Décrivez la création..." />
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setModal(false)}
                  className="flex-1 border border-gray-200 rounded-xl py-3 text-sm text-gray-600 hover:bg-gray-50 font-medium transition-all duration-300"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-rose-500 text-white rounded-xl py-3 text-sm font-medium hover:bg-rose-600 transition-all duration-300 shadow-lg shadow-rose-500/30"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}