import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const CATEGORIES = ['robe', 'costume', 'boubou', 'tailleur', 'enfant', 'autre'];

export default function GalerieAdmin() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-rose-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Retour
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Galerie</h1>
          </div>
          <button onClick={() => setModal(true)}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600">
            + Ajouter une photo
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item._id} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square">
              <img src={item.imageUrl} alt={item.titre} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <button onClick={() => toggleVisible(item)}
                  className="text-xs bg-white/90 text-gray-800 px-3 py-1 rounded-full font-medium">
                  {item.visible ? 'Masquer' : 'Afficher'}
                </button>
                <button onClick={() => onDelete(item._id)}
                  className="text-xs bg-red-500 text-white px-3 py-1 rounded-full font-medium">
                  Supprimer
                </button>
              </div>
              {!item.visible && (
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">Masqué</div>
              )}
            </div>
          ))}
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h2 className="font-bold text-gray-800 mb-4">Ajouter une photo</h2>
              <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
                <div>
                  <label className="label">Image</label>
                  <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-rose-50 file:text-rose-600" />
                </div>
                <div><label className="label">Titre</label><input {...register('titre')} className="input" /></div>
                <div>
                  <label className="label">Catégorie</label>
                  <select {...register('categorie')} className="input">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="label">Description</label><textarea {...register('description')} rows={2} className="input resize-none" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)}
                    className="flex-1 border border-gray-200 rounded-xl py-2 text-sm text-gray-600 hover:bg-gray-50">
                    Annuler
                  </button>
                  <button type="submit" className="flex-1 bg-rose-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-rose-600">
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}