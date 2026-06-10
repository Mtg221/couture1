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
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [files, setFiles] = useState([]);

  const onSubmit = async (data) => {
    try {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        form.append(k, v);
      });
      files.forEach(f => form.append('images', f));
      
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
      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
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
            <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b">Détails du vêtement</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Type de vêtement</label>
                <select {...register('typeVetement', { required: true })} className="input">
                  <option value="">Choisir...</option>
                  {['Robe', 'Costume', 'Boubou', 'Tailleur', 'Tenue enfant', 'Pantalon', 'Chemise', 'Jupe', 'Veste', 'Autre'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Description du modèle</label>
                <textarea {...register('description', { required: true })} rows={4} className="input resize-none"
                  placeholder="Décrivez le style, la couleur, les détails souhaités, l'occasion..." />
              </div>
              <div>
                <label className="label">Date de livraison souhaitée</label>
                <input type="date" {...register('dateLivraison')} className="input" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b">Photos d'inspiration (optionnel)</h2>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => setFiles(Array.from(e.target.files))}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100"
            />
            {files.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {files.map((file, idx) => (
                  <img 
                    key={idx} 
                    src={URL.createObjectURL(file)} 
                    alt="Aperçu" 
                    className="w-full h-20 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b">Prix et paiement</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Prix total (FCFA)</label>
                <input type="number" {...register('prixTotal', { min: 0 })} className="input" placeholder="0" />
              </div>
              <div>
                <label className="label">Avance versée (FCFA)</label>
                <input type="number" {...register('avancePaye', { min: 0 })} className="input" placeholder="0" />
              </div>
            </div>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">📏 Prise des mesures</p>
            <p>Si vous avez déjà des mesures enregistrées dans votre profil, elles seront automatiquement associées à cette commande. Sinon, nous prendrons vos mesures lors d'un rendez-vous.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Création en cours...' : 'Créer la commande'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}