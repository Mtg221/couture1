import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm();
  const sexe = watch('sexe');

  useEffect(() => {
    load();
  }, [id]);

  const load = () => {
    api.get(`/clients/${id}`).then(r => {
      setClient(r.data);
      reset({
        nom: r.data.nom,
        telephone: r.data.telephone,
        email: r.data.email,
        sexe: r.data.sexe,
        notes: r.data.notes,
        ...r.data.mesuresHomme,
        ...r.data.mesuresFemme,
      });
    });
    api.get(`/commandes/client/${id}`).then(r => setCommandes(r.data));
  };

  const updateClient = async (data) => {
    try {
      const mesuresHomme = {};
      const mesuresFemme = {};
      Object.keys(data).forEach(key => {
        if (key !== 'nom' && key !== 'telephone' && key !== 'email' && key !== 'password' && key !== 'sexe' && key !== 'notes') {
          if (mesuresHomme[key] !== undefined) mesuresHomme[key] = data[key];
          else mesuresFemme[key] = data[key];
        }
      });
      await api.put(`/clients/${id}`, {
        nom: data.nom,
        telephone: data.telephone,
        email: data.email,
        password: data.password || undefined,
        sexe: data.sexe,
        notes: data.notes,
        mesuresHomme: Object.keys(mesuresHomme).length ? mesuresHomme : undefined,
        mesuresFemme: Object.keys(mesuresFemme).length ? mesuresFemme : undefined,
      });
      toast.success('Client mis à jour');
      setEditMode(false);
      load();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteClient = async () => {
    if (!confirm('Supprimer ce client et toutes ses commandes ?')) return;
    try {
      await api.delete(`/clients/${id}`);
      toast.success('Client supprimé');
      navigate('/admin/clients');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const deleteCommande = async (cmdId) => {
    if (!confirm('Supprimer cette commande ?')) return;
    try {
      await api.delete(`/commandes/${cmdId}`);
      toast.success('Commande supprimée');
      load();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (!client) return <div className="p-8 text-gray-400">Chargement...</div>;

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            ← Retour
          </button>
          <div className="flex gap-2">
            <button onClick={() => setEditMode(!editMode)} className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              {editMode ? 'Annuler' : 'Modifier'}
            </button>
            <button onClick={deleteClient} className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              Supprimer
            </button>
          </div>
        </div>

        {editMode ? (
          <form onSubmit={handleSubmit(updateClient)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Modifier le client</h1>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div><label className="label">Nom</label><input {...register('nom', { required: true })} className="input" /></div>
              <div><label className="label">Téléphone</label><input {...register('telephone', { required: true })} className="input" /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div><label className="label">Email</label><input type="email" {...register('email', { required: true })} className="input" /></div>
              <div><label className="label">Nouveau mot de passe</label><input type="password" {...register('password')} className="input" placeholder="Laisser vide pour ne pas changer" /></div>
            </div>
            <div className="mb-4">
              <label className="label">Sexe</label>
              <select {...register('sexe')} className="input">
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>

            <div className="pt-4 border-t mb-4">
              <h3 className="font-semibold text-gray-700 mb-3">Mesures (en cm)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(sexe === 'homme' ? mesuresHomme : mesuresFemme).map(([name, label]) => (
                  <div key={name}>
                    <label className="label text-xs">{label}</label>
                    <input type="number" {...register(name)} className="input text-sm" placeholder="cm" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="label">Notes</label>
              <textarea {...register('notes')} rows={2} className="input resize-none" />
            </div>

            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600">
              Enregistrer les modifications
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{client.nom}</h1>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Téléphone :</span> <span className="font-medium ml-2">{client.telephone}</span></div>
              <div><span className="text-gray-500">Email :</span> <span className="font-medium ml-2">{client.email}</span></div>
              <div><span className="text-gray-500">Sexe :</span> <span className="font-medium ml-2 capitalize">{client.sexe}</span></div>
              <div><span className="text-gray-500">Créé le :</span> <span className="font-medium ml-2">{new Date(client.createdAt).toLocaleDateString('fr-FR')}</span></div>
            </div>

            {client.mesuresHomme && Object.keys(client.mesuresHomme).length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-700 mb-3">Mesures (Homme)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {Object.entries(client.mesuresHomme).map(([k, v]) => (
                    <div key={k} className="flex justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-gray-500">{k.replace(/([A-Z])/g, ' $1').trim()} :</span>
                      <span className="font-medium">{v} cm</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {client.mesuresFemme && Object.keys(client.mesuresFemme).length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-700 mb-3">Mesures (Femme)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {Object.entries(client.mesuresFemme).map(([k, v]) => (
                    <div key={k} className="flex justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-gray-500">{k.replace(/([A-Z])/g, ' $1').trim()} :</span>
                      <span className="font-medium">{v} cm</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {client.notes && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
                <p className="text-gray-600 text-sm">{client.notes}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Commandes ({commandes.length})</h2>
          </div>
          {commandes.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucune commande</p>
          ) : (
            <div className="space-y-3">
              {commandes.map(cmd => (
                <div key={cmd._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">{cmd.typeVetement}</p>
                    <p className="text-xs text-gray-500">{new Date(cmd.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      cmd.statut === 'prete' ? 'bg-green-100 text-green-700' :
                      cmd.statut === 'livree' ? 'bg-gray-100 text-gray-600' :
                      cmd.statut === 'refusee' ? 'bg-red-100 text-red-600' :
                      cmd.statut === 'en_cours' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {cmd.statut.replace('_', ' ')}
                    </span>
                    <a href={`/admin/commandes/${cmd._id}`} className="text-rose-500 text-xs hover:underline">Voir</a>
                    <button onClick={() => deleteCommande(cmd._id)} className="text-red-500 text-xs hover:underline ml-2">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}