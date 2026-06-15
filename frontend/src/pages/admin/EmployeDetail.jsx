import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function EmployeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employe, setEmploye] = useState(null);
  const [paiements, setPaiements] = useState([]);

  useEffect(() => {
    load();
  }, [id]);

  const load = () => {
    api.get(`/employes/${id}`).then(r => setEmploye(r.data));
    api.get(`/paiements?employeId=${id}`).then(r => setPaiements(r.data));
  };

  const deleteEmploye = async () => {
    if (!confirm('Supprimer cet employé ?')) return;
    try {
      await api.delete(`/employes/${id}`);
      toast.success('Employé supprimé');
      navigate('/admin/employes');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (!employe) return <div className="p-8 text-gray-400">Chargement...</div>;

  const totalEncaisse = paiements.reduce((sum, p) => sum + (p.montant || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            ← Retour
          </button>
          <div className="flex gap-2">
            <button onClick={() => navigate(`/admin/employes/${id}/edit`)} className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Modifier
            </button>
            <button onClick={deleteEmploye} className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              Supprimer
            </button>
          </div>
        </div>

        {/* Infos employé */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{employe.nom}</h1>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Téléphone :</span> <span className="font-medium ml-2">{employe.telephone}</span></div>
            {employe.email && (
              <div><span className="text-gray-500">Email :</span> <span className="font-medium ml-2">{employe.email}</span></div>
            )}
            {employe.poste && (
              <div><span className="text-gray-500">Poste :</span> <span className="font-medium ml-2">{employe.poste}</span></div>
            )}
            {employe.adresse && (
              <div><span className="text-gray-500">Adresse :</span> <span className="font-medium ml-2">{employe.adresse}</span></div>
            )}
            <div><span className="text-gray-500">Depuis :</span> <span className="font-medium ml-2">{new Date(employe.createdAt).toLocaleDateString('fr-FR')}</span></div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="text-3xl font-bold text-rose-500">{paiements.length}</div>
            <div className="text-xs text-gray-500 mt-1">Paiements reçus</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="text-3xl font-bold text-green-500">{totalEncaisse.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Total encaissé (FCFA)</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="text-3xl font-bold text-blue-500">
              {paiements.length > 0 ? (totalEncaisse / paiements.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">Moyenne par paiement</div>
          </div>
        </div>

        {/* Historique des paiements */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">Historique des paiements reçus</h2>
          {paiements.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucun paiement enregistré</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Client</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Commande</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Mode</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paiements.map(p => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-700">{p.client?.nom || 'N/A'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`/admin/commandes/${p.commande?._id}`} className="text-rose-500 hover:underline text-xs">
                          {p.commande?.typeVetement || 'N/A'}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          p.mode === 'wave' ? 'bg-blue-100 text-blue-700' :
                          p.mode === 'orange_money' ? 'bg-orange-100 text-orange-700' :
                          p.mode === 'carte_bancaire' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {p.mode === 'especes' ? 'Espèces' : 
                           p.mode === 'wave' ? 'Wave' :
                           p.mode === 'orange_money' ? 'Orange Money' :
                           p.mode === 'carte_bancaire' ? 'Carte' : 'Autre'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">
                        {p.montant?.toLocaleString()} FCFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}