import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Commande() {
  const { register, handleSubmit, watch, setValue } = useForm();
  const [vetements, setVetements] = useState([{ typeVetement: '', description: '', quantite: 1, photoModele: null, photoTissu: null }]);
  const [sent, setSent] = useState(false);
  const descriptionGlobale = watch('descriptionGlobale');
  const sexe = watch('sexe');

  const addVetement = () => {
    setVetements([...vetements, { typeVetement: '', description: '', quantite: 1, photoModele: null, photoTissu: null }]);
  };

  const removeVetement = (index) => {
    if (vetements.length === 1) {
      toast.error('Il faut au moins un vêtement');
      return;
    }
    const newVetements = vetements.filter((_, i) => i !== index);
    setVetements(newVetements);
  };

  const updateVetement = (index, field, value) => {
    const newVetements = [...vetements];
    newVetements[index][field] = value;
    setVetements(newVetements);
  };

  const onSubmit = async (data) => {
    try {
      const vetementsValides = vetements.filter(v => v.typeVetement.trim() !== '');
      if (vetementsValides.length === 0) {
        toast.error('Ajoutez au moins un vêtement');
        return;
      }

      const form = new FormData();
      form.append('nom', data.nom);
      form.append('telephone', data.telephone);
      form.append('sexe', sexe || 'homme');
      form.append('description', descriptionGlobale || '');

      const vetementsJson = vetementsValides.map((v) => ({
        typeVetement: v.typeVetement,
        description: v.description || '',
        quantite: Number(v.quantite) || 1,
      }));

      form.append('vetements', JSON.stringify(vetementsJson));

      vetementsValides.forEach((v, idx) => {
        if (v.photoModele) {
          form.append(`photoModele_${idx}`, v.photoModele);
        }
        if (v.photoTissu) {
          form.append(`photoTissu_${idx}`, v.photoTissu);
        }
      });

      await api.post('/commandes/public', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSent(true);
      setVetements([{ typeVetement: '', description: '', quantite: 1, photoModele: null, photoTissu: null }]);
      setValue('nom', '');
      setValue('telephone', '');
      setValue('descriptionGlobale', '');
    } catch {
      toast.error('Erreur lors de l\'envoi. Réessayez.');
    }
  };

  if (sent) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-6">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Commande reçue !</h2>
        <p className="text-gray-500 max-w-sm">
          Nous allons vous contacter par WhatsApp ou téléphone pour confirmer les détails et prendre vos mesures.
        </p>
        <button onClick={() => setSent(false)} className="mt-6 text-rose-500 font-medium hover:underline">
          Passer une autre commande
        </button>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Passer une commande</h1>
        <p className="text-gray-500 mb-8">Remplissez le formulaire, nous vous recontactons rapidement pour prendre vos mesures.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          <section>
            <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b">Vos informations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Nom complet</label>
                <input {...register('nom', { required: true })} className="input" placeholder="Aminata Sow" />
              </div>
              <div>
                <label className="label">Téléphone</label>
                <input {...register('telephone', { required: true })} className="input" placeholder="+221 7X XXX XX XX" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b">Détails de la commande</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Sexe</label>
                <select {...register('sexe', { required: true })} className="input">
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>
              <div>
                <label className="label">Description globale (optionnel)</label>
                <textarea {...register('descriptionGlobale')} rows={3} className="input resize-none"
                  placeholder="Informations générales sur votre commande..." />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-700">Vêtements</h2>
              <button type="button" onClick={addVetement} className="text-sm bg-rose-500 text-white px-3 py-1.5 rounded-lg hover:bg-rose-600">
                + Ajouter un vêtement
              </button>
            </div>

            <div className="space-y-4">
              {vetements.map((v, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-medium text-gray-700">Vêtement #{idx + 1}</span>
                    <button type="button" onClick={() => removeVetement(idx)} className="text-red-500 text-sm hover:underline">
                      Supprimer
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="label text-xs">Type de vêtement</label>
                      <select 
                        value={v.typeVetement}
                        onChange={(e) => updateVetement(idx, 'typeVetement', e.target.value)}
                        className="input text-sm"
                      >
                        <option value="">Choisir...</option>
                        {['Boubou', 'Robe', 'Costume', 'Tailleur', 'Tenue enfant', 'Pantalon', 'Chemise', 'Jupe', 'Veste', 'Haut', 'Marinière', 'Autre'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label text-xs">Quantité</label>
                      <input 
                        type="number" 
                        value={v.quantite}
                        onChange={(e) => updateVetement(idx, 'quantite', e.target.value)}
                        className="input text-sm" 
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="label text-xs">Description du modèle</label>
                    <textarea 
                      value={v.description}
                      onChange={(e) => updateVetement(idx, 'description', e.target.value)}
                      rows={3} 
                      className="input resize-none text-sm"
                      placeholder="Décrivez le style, la couleur, les détails souhaités..." 
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="label text-xs">Photo du modèle (optionnel)</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => updateVetement(idx, 'photoModele', e.target.files?.[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100"
                      />
                      {v.photoModele && <p className="text-xs text-green-600 mt-1">✓ Photo sélectionnée</p>}
                    </div>
                    <div>
                      <label className="label text-xs">Photo du tissu (optionnel)</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => updateVetement(idx, 'photoTissu', e.target.files?.[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100"
                      />
                      {v.photoTissu && <p className="text-xs text-green-600 mt-1">✓ Photo sélectionnée</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <p className="font-medium mb-1">📏 Prise des mesures</p>
            <p>Nous vous contacterons pour prendre vos mesures professionnellement. Aucune mesure n'est requise pour le moment.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
          >
            Envoyer ma commande
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}