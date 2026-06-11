import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext.jsx';

const STATUTS = ['en_attente', 'en_cours', 'prete', 'livree', 'refusee'];

export default function CommandeDetail() {
  const { id }           = useParams();
  const { user }         = useAuth();
  const navigate         = useNavigate();
  const [cmd, setCmd]    = useState(null);
  const [paies, setPaies] = useState([]);
  const { register, handleSubmit: hsStatut } = useForm();
  const { register: regP, handleSubmit: hsPaie, reset: resetP } = useForm();

  const load = () => {
    api.get(`/commandes/${id}`).then(r => setCmd(r.data));
    if (user?.role === 'admin')
      api.get(`/paiements/commande/${id}`).then(r => setPaies(r.data));
  };

  useEffect(() => { load(); }, [id]);

  const updateStatut = async (data) => {
    try {
      await api.put(`/commandes/${id}`, data);
      toast.success('Statut mis à jour'); load();
    } catch { toast.error('Erreur'); }
  };

  const addPaiement = async (data) => {
    try {
      await api.post('/paiements', { ...data, commande: id });
      toast.success('Paiement enregistré'); resetP(); load();
    } catch { toast.error('Erreur'); }
  };

  const generatePDF = async () => {
    try {
      const response = await api.get(`/commandes/${id}/facture`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture_${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Facture téléchargée');
    } catch {
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  if (!cmd) return <div className="p-8 text-gray-400">Chargement...</div>;

  const reste = cmd.prixTotal - cmd.avancePaye;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1">
          ← Retour
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Infos commande */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Détails</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-500">Client :</span> <span className="font-medium ml-2">{cmd.client?.nom}</span></div>
              <div><span className="text-gray-500">Téléphone :</span> <span className="font-medium ml-2">{cmd.client?.telephone}</span></div>
              <div><span className="text-gray-500">Sexe :</span> <span className="font-medium ml-2 capitalize">{cmd.sexe || 'N/A'}</span></div>
              <div><span className="text-gray-500">Vêtement :</span> <span className="font-medium ml-2">{cmd.typeVetement}</span></div>
              <div><span className="text-gray-500">Description :</span> <p className="mt-1 text-gray-700">{cmd.description}</p></div>
              {cmd.dateLivraison && (
                <div><span className="text-gray-500">Livraison prévue :</span> <span className="font-medium ml-2">{new Date(cmd.dateLivraison).toLocaleDateString('fr-FR')}</span></div>
              )}
            </div>

            {/* Mesures */}
{cmd.mesures && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">Mesures (cm)</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    {Object.entries(cmd.mesures)
                      .filter(([k, v]) => v && k !== 'autres')
                      .map(([k, v]) => {
                      const labels = {
                        cou: 'Cou', tourPoitrine: 'Poitrine', longueurMancheCourte: 'Longueur manche courte',
                        longueurMancheLongue: 'Longueur manche longue', tourManche: 'Tour de manche',
                        tourPoignet: 'Tour de poignet', longueurBoubou: 'Longueur boubou',
                        epaules: 'Epaule', ceinture: 'Ceinture', tourFesse: 'Tour de fesse',
                        tourCuisse: 'Tour de cuisse', tourGenou: 'Tour de genou', tourMollet: 'Tour de mollet',
                        longueurPantalon: 'Longueur pantalon', longueurDemiSaison: 'Longueur demi-saison',
                        tourTaille: 'Taille', longueurHaut: 'Longueur haut', longueurMariniere: 'Longueur marinière',
                        longueurBoubou3Quart: 'Longueur boubou 3/4', longueurJupe: 'Longueur jupe',
                        longueurPagne: 'Longueur pagne', autres: 'Autres',
                        hauteurTotal: 'Hauteur totale', hauteurDos: 'Hauteur du dos',
                        longueurBras: 'Longueur des bras', tourBras: 'Tour de bras', tourHanches: 'Tour de hanches',
                      };
                      return (
                        <div key={k} className="flex justify-between">
                          <span className="text-gray-400">{labels[k] || k} :</span>
                          <span className="font-medium">{v}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Images */}
            {cmd.images?.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Photos</h3>
                <div className="flex gap-2 flex-wrap">
                  {cmd.images.map((img, i) => (
                    <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                      <img src={img} className="w-16 h-16 object-cover rounded-lg border" alt="" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Statut + Paiements */}
          <div className="space-y-6">
            {/* Changer statut */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Statut</h2>
              <form onSubmit={hsStatut(updateStatut)} className="space-y-3">
                <select {...register('statut')} defaultValue={cmd.statut} className="input">
                  {STATUTS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
                <input {...register('prixTotal')} type="number" defaultValue={cmd.prixTotal} className="input" placeholder="Prix total (FCFA)" />
                <input {...register('dateLivraison')} type="date" defaultValue={cmd.dateLivraison?.slice(0, 10)} className="input" />
                <input {...register('note')} className="input" placeholder="Note (optionnel)" />
                <button type="submit" className="w-full bg-rose-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-rose-600">
                  Mettre à jour
                </button>
              </form>
            </div>

            {/* Bouton Générer PDF */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-3">Facture</h2>
              <button
                onClick={generatePDF}
                className="w-full bg-blue-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Générer la facture PDF
              </button>
            </div>

            {/* Paiements (admin seulement) */}
            {user?.role === 'admin' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-1">Paiements</h2>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-500">Total : <b>{cmd.prixTotal?.toLocaleString()} FCFA</b></span>
                  <span className="text-gray-500">Reste : <b className={reste > 0 ? 'text-red-500' : 'text-green-600'}>{reste?.toLocaleString()} FCFA</b></span>
                </div>

                <form onSubmit={hsPaie(addPaiement)} className="space-y-3 mb-4">
                  <input {...regP('montant', { required: true })} type="number" className="input" placeholder="Montant (FCFA)" />
                  <select {...regP('mode')} className="input">
                    {['especes', 'wave', 'orange_money', 'autre'].map(m => (
                      <option key={m} value={m}>{m.replace('_', ' ')}</option>
                    ))}
                  </select>
                  <input {...regP('note')} className="input" placeholder="Note (optionnel)" />
                  <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600">
                    Enregistrer paiement
                  </button>
                </form>

                <div className="space-y-2">
                  {paies.map(p => (
                    <div key={p._id} className="flex justify-between text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                      <span>{new Date(p.createdAt).toLocaleDateString('fr-FR')} · {p.mode}</span>
                      <span className="font-semibold text-green-600">+{p.montant?.toLocaleString()} FCFA</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Historique statuts */}
        {cmd.historiqueStatut?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
            <h2 className="font-bold text-gray-800 mb-3">Historique</h2>
            <div className="space-y-2">
              {cmd.historiqueStatut.map((h, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-32 text-gray-400 text-xs">{new Date(h.date).toLocaleDateString('fr-FR')}</span>
                  <span className="font-medium capitalize text-gray-700">{h.statut.replace('_', ' ')}</span>
                  {h.note && <span className="text-gray-400">— {h.note}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}