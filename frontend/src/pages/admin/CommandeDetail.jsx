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
  const [employes, setEmployes] = useState([]);
  const [vetementIndex, setVetementIndex] = useState(0);
  const { register, handleSubmit: hsStatut, setValue } = useForm();
  const { register: regP, handleSubmit: hsPaie, reset: resetP } = useForm();

  const load = () => {
    api.get(`/commandes/${id}`).then(r => {
      const data = r.data;
      if (data.vetements && data.vetements.length > 0) {
        setValue('statut', data.vetements[0].statut || 'en_attente');
      } else {
        setValue('statut', data.statut || 'en_attente');
      }
      setCmd(data);
    });
    if (user?.role === 'admin') {
      api.get(`/paiements/commande/${id}`).then(r => setPaies(r.data));
      api.get('/employes').then(r => setEmployes(r.data));
    }
  };

  useEffect(() => { load(); }, [id]);

  const updateStatut = async (data) => {
    try {
      const vetement = cmd.vetements?.[vetementIndex];
      if (vetement) {
        const newVetements = [...cmd.vetements];
        newVetements[vetementIndex] = {
          ...vetement,
          statut: data.statut,
        };
        await api.put(`/commandes/${id}`, {
          vetements: JSON.stringify(newVetements),
          statutIndex: vetementIndex,
          statut: data.statut,
          note: data.note,
        });
      } else {
        await api.put(`/commandes/${id}`, { ...data });
      }
      toast.success('Statut mis à jour'); 
      load();
    } catch { 
      toast.error('Erreur'); 
    }
  };

  const addPaiement = async (data) => {
    try {
      await api.post('/paiements', { 
        ...data, 
        commande: id,
        employeId: data.employeId || null,
      });
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
  const vetements = cmd.vetements || (cmd.typeVetement ? [{
    typeVetement: cmd.typeVetement,
    description: cmd.description,
    quantite: 1,
    photoModele: cmd.images?.[0],
    photoTissu: cmd.images?.[1],
    mesures: cmd.mesures,
    statut: cmd.statut,
  }] : []);

  const labelsMesures = {
    cou: 'Cou', tourPoitrine: 'Poitrine', longueurMancheCourte: 'Longueur manche courte',
    longueurMancheLongue: 'Longueur manche longue', tourManche: 'Tour de manche',
    tourPoignet: 'Tour de poignet', longueurBoubou: 'Longueur boubou',
    epaule: 'Epaule', ceinture: 'Ceinture', tourFesse: 'Tour de fesse',
    tourCuisse: 'Tour de cuisse', tourGenou: 'Tour de genou', tourMollet: 'Tour de mollet',
    longueurPantalon: 'Longueur pantalon', longueurDemiSaison: 'Longueur demi-saison',
    tourTaille: 'Taille', longueurHaut: 'Longueur haut', longueurMariniere: 'Longueur marinière',
    longueurBoubou3Quart: 'Longueur boubou 3/4', longueurJupe: 'Longueur jupe',
    longueurPagne: 'Longueur pagne', autres: 'Autres',
    hauteurTotal: 'Hauteur totale', hauteurDos: 'Hauteur du dos',
    longueurBras: 'Longueur des bras', tourBras: 'Tour de bras', tourHanches: 'Tour de hanches',
    epaules: 'Epaules', tourDeFesse: 'Tour de fesse', tourDuneCuisse: 'Tour d\'une cuisse',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1">
          ← Retour
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Infos commande */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Détails de la commande</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-500">Client :</span> <span className="font-medium ml-2">{cmd.client?.nom}</span></div>
              <div><span className="text-gray-500">Téléphone :</span> <span className="font-medium ml-2">{cmd.client?.telephone}</span></div>
              {cmd.dateLivraison && (
                <div><span className="text-gray-500">Livraison prévue :</span> <span className="font-medium ml-2">{new Date(cmd.dateLivraison).toLocaleDateString('fr-FR')}</span></div>
              )}
            </div>

            {cmd.description && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">Description globale</h3>
                <p className="text-gray-700 text-sm">{cmd.description}</p>
              </div>
            )}

            {/* Liste des vêtements */}
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm">Vêtements ({vetements.length})</h3>
              <div className="space-y-3">
                {vetements.map((v, idx) => (
                  <div key={idx} className={`rounded-xl border p-3 ${vetementIndex === idx ? 'border-rose-300 bg-rose-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-800">{v.typeVetement}</p>
                        {v.quantite && v.quantite > 1 && (
                          <p className="text-xs text-gray-500">Quantité : {v.quantite}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        v.statut === 'prete' ? 'bg-green-100 text-green-700' :
                        v.statut === 'livree' ? 'bg-gray-100 text-gray-600' :
                        v.statut === 'refusee' ? 'bg-red-100 text-red-600' :
                        v.statut === 'en_cours' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {v.statut?.replace('_', ' ')}
                      </span>
                    </div>
                    
                    {v.description && <p className="text-xs text-gray-600 mb-2">{v.description}</p>}
                    
                    {(v.photoModele || v.photoTissu) && (
                      <div className="flex gap-2 mt-2">
                        {v.photoModele && (
                          <a href={v.photoModele} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500">
                            <img src={v.photoModele} className="w-12 h-12 object-cover rounded border" alt="Modèle" title="Photo modèle" />
                          </a>
                        )}
                        {v.photoTissu && (
                          <a href={v.photoTissu} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500">
                            <img src={v.photoTissu} className="w-12 h-12 object-cover rounded border" alt="Tissu" title="Photo tissu" />
                          </a>
                        )}
                      </div>
                    )}
                    
                    <button 
                      onClick={() => {
                        setVetementIndex(idx);
                        setValue('statut', v.statut || 'en_attente');
                      }}
                      className={`text-xs mt-2 px-2 py-1 rounded ${vetementIndex === idx ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                    >
                      {vetementIndex === idx ? '✓ Sélectionné' : 'Sélectionner'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mesures du vêtement sélectionné */}
            {vetements[vetementIndex]?.mesures && Object.keys(vetements[vetementIndex].mesures).filter(k => vetements[vetementIndex].mesures[k]).length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Mesures - {vetements[vetementIndex].typeVetement}</h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  {Object.entries(vetements[vetementIndex].mesures)
                    .filter(([k, v]) => v && k !== 'autres')
                    .map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-gray-400">{labelsMesures[k] || k} :</span>
                        <span className="font-medium">{v} cm</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Statut + Paiements */}
          <div className="space-y-6">
            {/* Changer statut */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">
                Statut {vetementIndex !== undefined && vetements[vetementIndex] ? `- ${vetements[vetementIndex].typeVetement}` : ''}
              </h2>
              <form onSubmit={hsStatut(updateStatut)} className="space-y-3">
                <select {...register('statut')} className="input">
                  {STATUTS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
                <input {...register('note')} className="input" placeholder="Note (optionnel)" />
                <button type="submit" className="w-full bg-rose-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-rose-600">
                  Mettre à jour le statut
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
                  <span className="text-gray-500">Payé : <b className="text-green-600">{cmd.avancePaye?.toLocaleString()} FCFA</b></span>
                  <span className="text-gray-500">Reste : <b className={reste > 0 ? 'text-red-500' : 'text-green-600'}>{reste?.toLocaleString()} FCFA</b></span>
                </div>

                <form onSubmit={hsPaie(addPaiement)} className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Montant (FCFA)</label>
                      <input {...regP('montant', { required: true })} type="number" className="input" placeholder="Montant" />
                    </div>
                    <div>
                      <label className="label">Mode de paiement</label>
                      <select {...regP('mode', { required: true })} className="input text-sm">
                        <option value="especes">Espèces</option>
                        <option value="wave">Wave</option>
                        <option value="orange_money">Orange Money</option>
                        <option value="carte_bancaire">Carte bancaire</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Reçu par (employé)</label>
                    <select {...regP('employeId')} className="input text-sm">
                      <option value="">-- Non spécifié --</option>
                      {employes.map(e => (
                        <option key={e._id} value={e._id}>{e.nom} {e.poste && `(${e.poste})`}</option>
                      ))}
                    </select>
                  </div>
                  <input {...regP('note')} className="input" placeholder="Note (optionnel)" />
                  <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600">
                    Enregistrer paiement
                  </button>
                </form>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {paies.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">Aucun paiement enregistré</p>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-3 py-2 font-medium text-gray-600">Date</th>
                            <th className="text-left px-3 py-2 font-medium text-gray-600">Mode</th>
                            <th className="text-left px-3 py-2 font-medium text-gray-600">Reçu par</th>
                            <th className="text-right px-3 py-2 font-medium text-gray-600">Montant</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {paies.map(p => (
                            <tr key={p._id} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-gray-600">
                                <div>{new Date(p.createdAt).toLocaleDateString('fr-FR')}</div>
                                {p.note && <div className="text-xs text-gray-400">{p.note}</div>}
                              </td>
                              <td className="px-3 py-2">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  p.mode === 'wave' ? 'bg-blue-100 text-blue-700' :
                                  p.mode === 'orange_money' ? 'bg-orange-100 text-orange-700' :
                                  p.mode === 'carte_bancaire' ? 'bg-purple-100 text-purple-700' :
                                  p.mode === 'autre' ? 'bg-gray-100 text-gray-600' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {p.mode === 'especes' ? 'Espèces' : 
                                   p.mode === 'wave' ? 'Wave' :
                                   p.mode === 'orange_money' ? 'Orange Money' :
                                   p.mode === 'carte_bancaire' ? 'Carte' : 'Autre'}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                {p.employe ? (
                                  <span className="text-gray-700 font-medium">{p.employe.nom}</span>
                                ) : (
                                  <span className="text-gray-400 text-xs">Non spécifié</span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-right font-semibold text-green-600">
                                +{p.montant?.toLocaleString()} FCFA
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
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