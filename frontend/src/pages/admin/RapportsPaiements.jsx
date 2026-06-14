import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function RapportsPaiements() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rapport, setRapport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRapport = async () => {
    if (!startDate || !endDate) {
      toast.error('Veuillez sélectionner les deux dates');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/rapports/rapport', {
        params: { startDate, endDate }
      });
      setRapport(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la génération du rapport');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-rose-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Rapports de Paiements</h1>
        </div>

        {/* Filtres dates */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">Période</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="label">Date de début</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input" 
              />
            </div>
            <div>
              <label className="label">Date de fin</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input" 
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={generateRapport}
                disabled={loading}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-xl font-medium transition-colors disabled:opacity-60"
              >
                {loading ? 'Génération...' : 'Générer le rapport'}
              </button>
            </div>
          </div>
        </div>

        {rapport && (
          <>
            {/* Totaux par type */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cash</p>
                    <p className="text-lg font-bold text-gray-800">{formatCurrency(rapport.cash)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{rapport.counts.cash} transaction(s)</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Wave</p>
                    <p className="text-lg font-bold text-gray-800">{formatCurrency(rapport.wave)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{rapport.counts.wave} transaction(s)</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Orange Money</p>
                    <p className="text-lg font-bold text-gray-800">{formatCurrency(rapport.orange_money)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{rapport.counts.orange_money} transaction(s)</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Carte Bancaire</p>
                    <p className="text-lg font-bold text-gray-800">{formatCurrency(rapport.carte_bancaire)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{rapport.counts.carte_bancaire} transaction(s)</p>
              </div>
            </div>

            {/* Total général */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl shadow-sm p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total général encaissé</p>
                  <p className="text-3xl font-bold">{formatCurrency(rapport.total)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Période</p>
                  <p className="font-medium">
                    {new Date(rapport.period.startDate).toLocaleDateString('fr-FR')} - {new Date(rapport.period.endDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Tableau des transactions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Détail des transactions</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-5 py-3 font-medium text-gray-600">Date</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-600">Mode</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-600">Montant</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-600">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rapport.transactions.map(t => (
                      <tr key={t._id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 text-gray-600">{new Date(t.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            t.mode === 'cash' ? 'bg-green-100 text-green-700' :
                            t.mode === 'wave' ? 'bg-blue-100 text-blue-700' :
                            t.mode === 'orange_money' ? 'bg-orange-100 text-orange-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {t.mode.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-semibold text-gray-800">{formatCurrency(t.montant)}</td>
                        <td className="px-5 py-3 text-gray-500">{t.note || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rapport.transactions.length === 0 && (
                  <p className="text-center py-10 text-gray-400">Aucune transaction dans cette période</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}