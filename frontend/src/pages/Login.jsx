import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      const user = await login(email, password);
      if (user.role === 'client') {
        navigate('/client/dashboard');
      } else {
        navigate('/admin');
      }
    } catch {
      toast.error('Identifiants incorrects');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="NKG Couture" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenue</h1>
          <p className="text-gray-500 text-sm">Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label">Email ou identifiant</label>
            <input 
              {...register('email', { required: true })} 
              className="input" 
              placeholder="admin ou votre@email.com" 
              type="text"
              autoFocus 
            />
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <input 
              type="password" 
              {...register('password', { required: true })} 
              className="input" 
              placeholder="••••••••" 
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60 shadow-md"
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          <p>Accès administrateur et client</p>
        </div>
      </div>
    </div>
  );
}