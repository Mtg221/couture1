import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function Employes() {
  const [employes, setEmployes] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-rose-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Retour
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Employés</h1>
          </div>
          <button onClick={() => { setEditingId(null); reset(); setModal(true); }}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors">
            + Nouvel employé
          </button>
        </div>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input mb-6 max-w-sm"
          placeholder="Rechercher par nom, téléphone ou email..."
        />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Nom</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Téléphone</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Poste</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {employes.map(e => (
                <tr key={e._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{e.nom}</td>
                  <td className="px-5 py-3 text-gray-600">{e.telephone}</td>
                  <td className="px-5 py-3 text-gray-600">{e.email || '-'}</td>
                  <td className="px-5 py-3 text-gray-600">{e.poste || '-'}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => editEmploye(e)} className="text-blue-500 hover:underline text-xs mr-3">
                      Modifier
                    </button>
                    <button onClick={() => deleteEmploye(e._id)} className="text-red-500 hover:underline text-xs">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {employes.length === 0 && (
            <p className="text-center py-10 text-gray-400">Aucun employé</p>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl my-8">
            <h2 className="font-bold text-gray-800 mb-4">{editingId ? 'Modifier l\'employé' : 'Nouvel employé'}</h2>
            <form onSubmit={handleSubmit(onCreate)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom complet *</label>
                  <input {...register('nom', { required: true })} className="input" />
                </div>
                <div>
                  <label className="label">Téléphone *</label>
                  <input {...register('telephone', { required: true })} className="input" />
                </div>
              </div>
              
              <div>
                <label className="label">Email</label>
                <input type="email" {...register('email')} className="input" placeholder="email@exemple.com" />
              </div>
              
              <div>
                <label className="label">Poste / Fonction</label>
                <input {...register('poste')} className="input" placeholder="Ex: Vendeur, Caissier, Responsable boutique..." />
              </div>
              
              <div>
                <label className="label">Adresse</label>
                <textarea {...register('adresse')} rows={2} className="input resize-none" placeholder="Adresse complète" />
              </div>

              <div className="flex gap-3 pt-2 sticky bottom-0 bg-white">
                <button type="button" onClick={() => { setModal(false); setEditingId(null); reset(); }}
                  className="flex-1 border border-gray-200 rounded-xl py-2 text-sm text-gray-600 hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit" className="flex-1 bg-rose-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-rose-600">
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