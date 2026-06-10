import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async ({ username, password }) => {
    try {
      await login(username, password);
      navigate('/admin');
    } catch {
      toast.error('Identifiants incorrects');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Connexion</h1>
        <p className="text-gray-500 text-sm mb-6">Espace administration</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Nom d'utilisateur</label>
            <input {...register('username', { required: true })} className="input" placeholder="admin" autoFocus />
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <input type="password" {...register('password', { required: true })} className="input" placeholder="••••••••" />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}