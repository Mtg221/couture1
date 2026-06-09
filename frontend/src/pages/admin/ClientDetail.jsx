import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    api.get(`/clients/${id}`).then(r => setClient(r.data));
    api.get(`/commandes/client/${id}`).then(r => setCommandes(r.data));
  }, [id]);

  if (!client) return <div className="p-8 text-gray-400">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1">
          ← Retour
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{client.nom}</h1>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Téléphone :</span> <span className="font-medium ml-2">{client.telephone}</span></div>
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

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">Commandes ({commandes.length})</h2>
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