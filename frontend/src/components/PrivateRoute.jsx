import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
    </div>
  );

  if (!user) return <Navigate to="/admin/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/admin" replace />;

  return children;
}