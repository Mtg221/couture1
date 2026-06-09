import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Contact() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const wa = import.meta.env.VITE_WHATSAPP_NUMBER;

  const onSubmit = async (data) => {
    try {
      await api.post('/messages', data);
      toast.success('Message envoyé ! On vous contacte bientôt.');
      reset();
    } catch {
      toast.error('Erreur lors de l\'envoi.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Nous contacter</h1>
        <p className="text-gray-500 mb-8">Une question ? Envoyez-nous un message.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input {...register('nom', { required: true })} className="input" placeholder="Fatou Diallo" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input {...register('telephone', { required: true })} className="input" placeholder="+221 7X XXX XX XX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea {...register('message', { required: true })} rows={4} className="input resize-none" placeholder="Votre message..." />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Envoi...' : 'Envoyer le message'}
          </button>
        </form>

        <a
          href={`https://wa.me/${wa}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors"
        >
          Ou contacter directement sur WhatsApp
        </a>
      </main>
      <Footer />
    </div>
  );
}