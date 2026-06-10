import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Commande() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [files, setFiles]   = useState([]);
  const [sent, setSent]     = useState(false);

  const onSubmit = async (data) => {
    try {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        form.append(k, v);
      });
      files.forEach(f => form.append('images', f));
      await api.post('/commandes/public', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSent(true);
      reset();
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
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Passer une commande</h1>
        <p className="text-gray-500 mb-8">Remplissez le formulaire, nous vous recontactons rapidement pour prendre vos mesures.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          <section>
            <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b">Vos informations</h2>
            <div className="grid grid-cols-1 gap-4">
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
            <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b">Détails du vêtement</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Sexe</label>
                <select {...register('sexe', { required: true })} className="input">
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>
              <div>
                <label className="label">Type de vêtement</label>
                <select {...register('typeVetement', { required: true })} className="input">
                  <option value="">Choisir...</option>
                  {['Robe', 'Costume', 'Boubou', 'Tailleur', 'Tenue enfant', 'Autre'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Description du modèle</label>
                <textarea {...register('description', { required: true })} rows={3} className="input resize-none"
                  placeholder="Décrivez le style, la couleur, les détails souhaités..." />
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
              <p className="text-sm text-gray-500 mt-2">{files.length} fichier(s) sélectionné(s)</p>
            )}
          </section>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <p className="font-medium mb-1">📏 Prise des mesures</p>
            <p>Nous vous contacterons pour prendre vos mesures professionnellement. Aucune mesure n'est requise pour le moment.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma commande'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}