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
  const { register, handleSubmit, reset } = useForm();

  const load = () => {
    api.get(`/clients/${id}`).then(r => {
      setClient(r.data);
      reset(r.data);
    });
    api.get('/commandes', { params: { clientId: id } }).then(r => setCommandes(r.data));
  };

  useEffect(() => { load(); }, [id]);

  const updateClient = async (data) => {
    try {
      const updateData = {
        nom: data.nom,
        telephone: data.telephone,
        notes: data.notes,
        sexe: data.sexe,
      };
      if (data.sexe === 'homme' && data.mesuresHomme) {
        updateData.mesuresHomme = data.mesuresHomme;
      } else if (data.sexe === 'femme' && data.mesuresFemme) {
        updateData.mesuresFemme = data.mesuresFemme;
      }
      await api.put(`/clients/${id}`, updateData);
      toast.success('Client mis à jour');
      load();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteClient = async () => {
    if (!confirm('Supprimer ce client ?')) return;
    try {
      await api.delete(`/clients/${id}`);
      toast.success('Client supprimé');
      navigate('/admin/clients');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (!client) return <div className="p-8 text-gray-400">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1">
          ← Retour
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Infos client */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Informations</h2>
            <form onSubmit={handleSubmit(updateClient)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom</label>
                  <input {...register('nom', { required: true })} className="input" />
                </div>
                <div>
                  <label className="label">Téléphone</label>
                  <input {...register('telephone', { required: true })} className="input" />
                </div>
              </div>
              <div>
                <label className="label">Sexe</label>
                <select {...register('sexe')} className="input">
                  <option value="femme">Femme</option>
                  <option value="homme">Homme</option>
                </select>
              </div>
              <div>
                <label className="label">Notes</label>
                <textarea {...register('notes')} rows={3} className="input resize-none" />
              </div>
              <button type="submit" className="w-full bg-rose-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-rose-600">
                Mettre à jour
              </button>
            </form>
            <button onClick={deleteClient} className="w-full mt-3 border border-red-200 text-red-500 py-2 rounded-xl text-sm font-medium hover:bg-red-50">
              Supprimer le client
            </button>
          </div>

          {/* Mesures */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Mesures (cm)</h2>
            {client.sexe === 'homme' ? (
              client.mesuresHomme && Object.keys(client.mesuresHomme).length > 0 ? (
                <div className="space-y-2 text-sm">
                  {Object.entries(client.mesuresHomme).filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-medium text-gray-800">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Aucune mesure enregistrée</p>
              )
            ) : (
              client.mesuresFemme && Object.keys(client.mesuresFemme).length > 0 ? (
                <div className="space-y-2 text-sm">
                  {Object.entries(client.mesuresFemme).filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-medium text-gray-800">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Aucune mesure enregistrée</p>
              )
            )}
          </div>
        </div>

        {/* Commandes du client */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-800">Commandes ({commandes.length})</h2>
          </div>
          <div className="divide-y">
            {commandes.map(c => (
              <div key={c._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-800">{c.typeVetement}</p>
                  <p className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    c.statut === 'en_attente' ? 'bg-amber-100 text-amber-700' :
                    c.statut === 'en_cours' ? 'bg-blue-100 text-blue-700' :
                    c.statut === 'prete' ? 'bg-green-100 text-green-700' :
                    c.statut === 'livree' ? 'bg-gray-100 text-gray-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {c.statut.replace('_', ' ')}
                  </span>
                  <a href={`/admin/commandes/${c._id}`} className="text-rose-500 hover:underline text-xs">Voir</a>
                </div>
              </div>
            ))}
            {commandes.length === 0 && (
              <p className="text-center py-6 text-gray-400 text-sm">Aucune commande</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}