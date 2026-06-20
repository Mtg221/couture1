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
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">Nous contacter</h1>
          <p className="text-gray-500 mb-10 text-lg">Une question ? Envoyez-nous un message.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 animate-fade-in">
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Nom complet
            </label>
            <input 
              {...register('nom', { required: true })} 
              className="input pl-10" 
              placeholder="Fatou Diallo" 
            />
          </div>
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Téléphone
            </label>
            <input 
              {...register('telephone', { required: true })} 
              className="input pl-10" 
              placeholder="+221 7X XXX XX XX" 
            />
          </div>
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Message
            </label>
            <textarea 
              {...register('message', { required: true })} 
              rows={5} 
              className="input pl-10 resize-none" 
              placeholder="Votre message..." 
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-rose-500/30"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Envoi en cours...
              </span>
            ) : (
              'Envoyer le message'
            )}
          </button>
        </form>

        <a
          href={`https://wa.me/${wa}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/30"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
          Ou contacter directement sur WhatsApp
        </a>
      </main>
      <Footer />
    </div>
  );
}