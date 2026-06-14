import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function NewCommande() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue } = useForm();
  const [vetements, setVetements] = useState([{ typeVetement: '', description: '', quantite: 1, photoModele: null, photoTissu: null }]);
  const descriptionGlobale = watch('descriptionGlobale');
  const dateLivraison = watch('dateLivraison');

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
      form.append('description', descriptionGlobale || '');
      form.append('sexe', user?.sexe || 'homme');
      if (dateLivraison) form.append('dateLivraison', dateLivraison);

      const vetementsJson = vetementsValides.map((v, idx) => ({
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
      
      await api.post('/commandes', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Commande créée avec succès !');
      navigate('/client/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création de la commande');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/client/dashboard')}
            className="text-sm text-gray-500 hover:text-rose-500 mb-2"
          >
            ← Retour à l'espace client
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Nouvelle commande</h1>
          <p className="text-gray-500">Remplissez les détails de votre commande</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <section>
            <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b">Détails de la commande</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Description globale (optionnel)</label>
                <textarea {...register('descriptionGlobale')} rows={3} className="input resize-none"
                  placeholder="Informations générales sur votre commande..." />
              </div>
              <div>
                <label className="label">Date de livraison souhaitée</label>
                <input type="date" {...register('dateLivraison')} className="input" />
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
                      placeholder="Décrivez le style, la couleur, les détails souhaités, l'occasion..." 
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

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">📏 Prise des mesures</p>
            <p>Si vous avez déjà des mesures enregistrées dans votre profil, elles seront automatiquement associées à cette commande. Sinon, nous prendrons vos mesures lors d'un rendez-vous.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
          >
            Créer la commande
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}