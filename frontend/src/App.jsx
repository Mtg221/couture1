import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import WhatsAppButton from './components/WhatsAppButton';

// Public
import Home     from './pages/public/Home';
import Galerie  from './pages/public/Galerie';
import Contact  from './pages/public/Contact';
import Commande from './pages/public/Commande';

// Admin
import Login           from './pages/admin/Login';
import Dashboard       from './pages/admin/Dashboard';
import Clients         from './pages/admin/Clients';
import ClientDetail    from './pages/admin/ClientDetail';
import Commandes       from './pages/admin/Commandes';
import CommandeDetail  from './pages/admin/CommandeDetail';
import GalerieAdmin    from './pages/admin/GalerieAdmin';
import Messages        from './pages/admin/Messages';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <WhatsAppButton />
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Home />} />
          <Route path="/galerie"  element={<Galerie />} />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/commande" element={<Commande />} />

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin/clients"            element={<PrivateRoute><Clients /></PrivateRoute>} />
          <Route path="/admin/clients/:id"        element={<PrivateRoute><ClientDetail /></PrivateRoute>} />
          <Route path="/admin/commandes"          element={<PrivateRoute><Commandes /></PrivateRoute>} />
          <Route path="/admin/commandes/:id"      element={<PrivateRoute><CommandeDetail /></PrivateRoute>} />
          <Route path="/admin/galerie"            element={<PrivateRoute adminOnly><GalerieAdmin /></PrivateRoute>} />
          <Route path="/admin/messages"           element={<PrivateRoute><Messages /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}