import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const STATUTS = ['tous', 'en_attente', 'en_cours', 'prete', 'livree', 'refusee'];
const COLORS  = {
  en_attente: 'bg-amber-100 text-amber-700',
  en_cours:   'bg-blue-100 text-blue-700',
  prete:      'bg-green-100 text-green-700',
  livree:     'bg-gray-100 text-gray-600',
  refusee:    'bg-red-100 text-red-600',
};

export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [statut, setStatut]       = useState('tous');

  useEffect(() => {
    const params = statut !== 'tous' ? { statut } : {};
    api.get('/commandes', { params }).then(r => setCommandes(r.data));
  }, [statut]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-rose-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Commandes</h1>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {STATUTS.map(s => (
            <button key={s} onClick={() => setStatut(s)}
              className={`px-3 py-1 rounded-full text-sm capitalize font-medium transition-colors ${
                statut === s ? 'bg-rose-500 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Client</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Vêtement</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Statut</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Date</th>
                <th className="px-5 py-3"/>
              </tr>
            </thead>
            <tbody className="divide-y">
              {commandes.map(c => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{c.client?.nom}</td>
                  <td className="px-5 py-3 text-gray-600">{c.typeVetement}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${COLORS[c.statut]}`}>
                      {c.statut.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/admin/commandes/${c._id}`} className="text-rose-500 hover:underline text-xs">Voir</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {commandes.length === 0 && (
            <p className="text-center py-10 text-gray-400">Aucune commande</p>
          )}
        </div>
      </div>
    </div>
  );
}