import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch]   = useState('');
  const [modal, setModal]     = useState(false);
  const { register, handleSubmit, reset, watch } = useForm();
  const sexe = watch('sexe');

  const load = () => api.get('/clients', { params: { search } }).then(r => setClients(r.data));
  useEffect(() => { load(); }, [search]);

  const onCreate = async (data) => {
    try {
      await api.post('/clients', data);
      toast.success('Client ajouté');
      setModal(false); reset(); load();
    } catch { toast.error('Erreur'); }
  };

  const mesuresHomme = [
    ['cou', 'Cou'], ['poitrine', 'Poitrine'], ['longueurMancheCourte', 'Longueur manche courte'],
    ['longueurMancheLongue', 'Longueur manche longue'], ['tourDeManche', 'Tour de manche'],
    ['tourDePoignet', 'Tour de poignet'], ['longueurBoubou', 'Longueur boubou'],
    ['epaule', 'Epaule'], ['ceinture', 'Ceinture'], ['tourDeFesse', 'Tour de fesse'],
    ['tourDuneCuisse', 'Tour d\'une cuisse'], ['tourDeGenou', 'Tour de genou'],
    ['tourDeMollet', 'Tour de mollet'], ['longueurPantalon', 'Longueur pantalon'],
    ['longueurDemiSaison', 'Longueur demi-saison'],
  ];

  const mesuresFemme = [
    ['cou', 'Cou'], ['poitrine', 'Poitrine'], ['longueurMancheCourte', 'Longueur manche courte'],
    ['longueurMancheLongue', 'Longueur manche longue'], ['tourDeManche', 'Tour de manche'],
    ['tourDePoignet', 'Tour de poignet'], ['longueurBoubou', 'Longueur boubou'],
    ['epaule', 'Epaule'], ['taille', 'Taille'], ['ceinture', 'Ceinture'],
    ['tourDeFesse', 'Tour de fesse'], ['tourDuneCuisse', 'Tour d\'une cuisse'],
    ['tourDeGenou', 'Tour de genou'], ['tourDeMollet', 'Tour de mollet'],
    ['longueurPantalon', 'Longueur pantalon'], ['longueurHaut', 'Longueur haut'],
    ['longueurMariniere', 'Longueur marinière'], ['longueurBoubou3Quart', 'Longueur boubou 3/4'],
    ['longueurJupe', 'Longueur jupe'], ['longueurPagne', 'Longueur pagne'],
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
          <button onClick={() => setModal(true)}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors">
            + Nouveau client
          </button>
        </div>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input mb-6 max-w-sm"
          placeholder="Rechercher par nom ou téléphone..."
        />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Nom</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Téléphone</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Sexe</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Depuis</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {clients.map(c => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{c.nom}</td>
                  <td className="px-5 py-3 text-gray-600">{c.telephone}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.sexe === 'homme' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                      {c.sexe}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/admin/clients/${c._id}`} className="text-rose-500 hover:underline text-xs">Voir</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clients.length === 0 && (
            <p className="text-center py-10 text-gray-400">Aucun client</p>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl my-8">
            <h2 className="font-bold text-gray-800 mb-4">Nouveau client</h2>
            <form onSubmit={handleSubmit(onCreate)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Nom</label><input {...register('nom', { required: true })} className="input" /></div>
                <div><label className="label">Téléphone</label><input {...register('telephone', { required: true })} className="input" /></div>
              </div>
              <div>
                <label className="label">Sexe</label>
                <select {...register('sexe')} className="input">
                  <option value="femme">Femme</option>
                  <option value="homme">Homme</option>
                </select>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold text-gray-700 mb-3">Mesures (en cm)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(sexe === 'homme' ? mesuresHomme : mesuresFemme).map(([name, label]) => (
                    <div key={name}>
                      <label className="label text-xs">{label}</label>
                      <input type="number" {...register(`mesures${sexe === 'homme' ? 'Homme' : 'Femme'}.${name}`)} className="input text-sm" placeholder="cm" />
                    </div>
                  ))}
                </div>
              </div>

              <div><label className="label">Notes</label><textarea {...register('notes')} rows={2} className="input resize-none" /></div>

              <div className="flex gap-3 pt-2 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setModal(false)}
                  className="flex-1 border border-gray-200 rounded-xl py-2 text-sm text-gray-600 hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit" className="flex-1 bg-rose-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-rose-600">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}