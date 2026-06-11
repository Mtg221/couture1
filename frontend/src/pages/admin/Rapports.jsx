import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function Rapports() {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [recap, setRecap] = useState(null);
  const [recettes, setRecettes] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRapports = async () => {
    if (!dateDebut || !dateFin) return;
    setLoading(true);
    try {
      const recapRes = await api.get('/dashboard/recapitulatif', {
        params: { dateDebut, dateFin },
      });
      setRecap(recapRes.data);

      const recettesRes = await api.get('/dashboard/recettes', {
        params: { dateDebut, dateFin },
      });
      setRecettes(recettesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-rose-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Rapports & Statistiques</h1>
        </div>

        {/* Filtres dates */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Période</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date de début</label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date de fin</label>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchRapports}
                disabled={loading || !dateDebut || !dateFin}
                className="w-full bg-rose-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Chargement...' : 'Afficher les rapports'}
              </button>
            </div>
          </div>
        </div>

        {recap && recettes && (
          <>
            {/* État récapitulatif des commandes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h2 className="font-bold text-gray-800 mb-4">État Récapitulatif des Commandes</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Total commandes</p>
                  <p className="text-2xl font-bold text-gray-800">{recap.totalCommandes}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-600">Total recettes</p>
                  <p className="text-2xl font-bold text-blue-700">{recap.totalRecettes.toLocaleString()} FCFA</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-green-600">Avances reçues</p>
                  <p className="text-2xl font-bold text-green-700">{recap.totalAvances.toLocaleString()} FCFA</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-sm text-amber-600">Reste à recevoir</p>
                  <p className="text-2xl font-bold text-amber-700">{recap.resteARecevoir.toLocaleString()} FCFA</p>
                </div>
              </div>

              <h3 className="font-semibold text-gray-700 mb-3">Par statut</h3>
              <div className="grid md:grid-cols-5 gap-3">
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <p className="text-xs text-amber-600">En attente</p>
                  <p className="text-lg font-bold text-amber-700">{recap.parStatut.en_attente}</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-600">En cours</p>
                  <p className="text-lg font-bold text-blue-700">{recap.parStatut.en_cours}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <p className="text-xs text-green-600">Prêtes</p>
                  <p className="text-lg font-bold text-green-700">{recap.parStatut.prete}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-600">Livrées</p>
                  <p className="text-lg font-bold text-gray-700">{recap.parStatut.livree}</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-xl">
                  <p className="text-xs text-red-600">Refusées</p>
                  <p className="text-lg font-bold text-red-700">{recap.parStatut.refusee}</p>
                </div>
              </div>

              {recap.commandes?.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Liste des commandes</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Client</th>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Vêtement</th>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Statut</th>
                          <th className="text-right px-4 py-2 font-medium text-gray-600">Prix</th>
                          <th className="text-right px-4 py-2 font-medium text-gray-600">Avance</th>
                          <th className="text-right px-4 py-2 font-medium text-gray-600">Reste</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {recap.commandes.map(c => (
                          <tr key={c._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-800">{c.client?.nom}</td>
                            <td className="px-4 py-3 text-gray-600">{c.typeVetement}</td>
                            <td className="px-4 py-3">
                              <span className="text-xs px-2 py-1 rounded-full font-medium capitalize bg-gray-100 text-gray-700">
                                {c.statut.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-medium">{c.prixTotal?.toLocaleString()} FCFA</td>
                            <td className="px-4 py-3 text-right text-green-600">{c.avancePaye?.toLocaleString()} FCFA</td>
                            <td className="px-4 py-3 text-right text-amber-600">{(c.prixTotal - c.avancePaye)?.toLocaleString()} FCFA</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Recettes entre deux dates */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Recettes</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-green-600">Total général</p>
                  <p className="text-3xl font-bold text-green-700">{recettes.totalGeneral.toLocaleString()} FCFA</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-600">Nombre de paiements</p>
                  <p className="text-3xl font-bold text-blue-700">{recettes.nombrePaiements}</p>
                </div>
              </div>

              <h3 className="font-semibold text-gray-700 mb-3">Par mode de paiement</h3>
              <div className="grid md:grid-cols-4 gap-3 mb-6">
                {Object.entries(recettes.parMode).map(([mode, montant]) => (
                  <div key={mode} className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-600 capitalize">{mode.replace('_', ' ')}</p>
                    <p className="text-lg font-bold text-gray-800">{montant.toLocaleString()} FCFA</p>
                  </div>
                ))}
              </div>

              {recettes.paiements?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Détail des paiements</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Date</th>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Client</th>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Vêtement</th>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Mode</th>
                          <th className="text-right px-4 py-2 font-medium text-gray-600">Montant</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {recettes.paiements.map(p => (
                          <tr key={p._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-600">
                              {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-800">
                              {p.commande?.client?.nom || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{p.commande?.typeVetement || 'N/A'}</td>
                            <td className="px-4 py-3">
                              <span className="text-xs px-2 py-1 rounded-full font-medium capitalize bg-gray-100 text-gray-700">
                                {p.mode}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-green-600">
                              +{p.montant?.toLocaleString()} FCFA
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {!recap && !loading && (
          <p className="text-center text-gray-400 py-8">Sélectionnez une période pour afficher les rapports</p>
        )}
      </div>
    </div>
  );
}