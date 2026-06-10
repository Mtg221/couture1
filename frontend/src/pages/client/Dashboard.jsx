import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    try {
      const userData = user || (await api.get('/auth/me')).data;
      
      if (userData.role !== 'client' || !userData.clientId) {
        navigate('/login');
        return;
      }

      const [clientRes, commandesRes] = await Promise.all([
        api.get(`/clients/${userData.clientId}`),
        api.get(`/commandes/client/${userData.clientId}`)
      ]);

      setClient(clientRes.data);
      setCommandes(commandesRes.data);
    } catch (err) {
      console.error(err);
      logout();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Mon Espace</h1>
            <p className="text-gray-500">{client.nom}</p>
          </div>
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="text-sm text-gray-600 hover:text-rose-500 font-medium"
          >
            Déconnexion
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">📋</span>
              Mes informations
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Nom complet</span>
                <span className="font-medium text-gray-800">{client.nom}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Téléphone</span>
                <span className="font-medium text-gray-800">{client.telephone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-800">{client.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Sexe</span>
                <span className="font-medium text-gray-800 capitalize">{client.sexe}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">📊</span>
              Résumé des commandes
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-rose-500">{commandes.length}</div>
                <div className="text-xs text-gray-500 mt-1">Total commandes</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-500">
                  {commandes.filter(c => c.statut === 'livree').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Livrées</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-500">
                  {commandes.filter(c => c.statut === 'en_cours' || c.statut === 'prete').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">En cours</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-500">
                  {commandes.filter(c => c.statut === 'en_attente').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">En attente</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">📏</span>
            Mes mesures
          </h2>
          {client.sexe === 'homme' && client.mesuresHomme && Object.keys(client.mesuresHomme).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(client.mesuresHomme).map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">
                    {k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-lg font-bold text-gray-800">{v} <span className="text-sm font-normal text-gray-500">cm</span></div>
                </div>
              ))}
            </div>
          ) : client.sexe === 'femme' && client.mesuresFemme && Object.keys(client.mesuresFemme).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(client.mesuresFemme).map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">
                    {k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-lg font-bold text-gray-800">{v} <span className="text-sm font-normal text-gray-500">cm</span></div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-4">Aucune mesure enregistrée</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">🛍️</span>
            Mes commandes
          </h2>
          {commandes.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">Aucune commande pour le moment</p>
          ) : (
            <div className="space-y-4">
              {commandes.map(cmd => (
                <div key={cmd._id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{cmd.typeVetement}</h3>
                      <p className="text-xs text-gray-500">{new Date(cmd.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      cmd.statut === 'prete' ? 'bg-green-100 text-green-700' :
                      cmd.statut === 'livree' ? 'bg-gray-100 text-gray-600' :
                      cmd.statut === 'refusee' ? 'bg-red-100 text-red-600' :
                      cmd.statut === 'en_cours' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {cmd.statut.replace('_', ' ')}
                    </span>
                  </div>
                  {cmd.description && (
                    <p className="text-sm text-gray-600 mb-2">{cmd.description}</p>
                  )}
                  {cmd.images && cmd.images.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {cmd.images.slice(0, 3).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={`http://localhost:3000/${img}`} 
                          alt="Aperçu" 
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                      {cmd.images.length > 3 && (
                        <div className="w-16 h-16 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50 text-xs text-gray-500">
                          +{cmd.images.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                  {(cmd.prixTotal || cmd.avancePaye) && (
                    <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 text-sm">
                      {cmd.prixTotal > 0 && (
                        <div>
                          <span className="text-gray-500">Prix total: </span>
                          <span className="font-medium">{cmd.prixTotal} FCFA</span>
                        </div>
                      )}
                      {cmd.avancePaye > 0 && (
                        <div>
                          <span className="text-gray-500">Avance: </span>
                          <span className="font-medium">{cmd.avancePaye} FCFA</span>
                        </div>
                      )}
                      {cmd.prixTotal > 0 && cmd.avancePaye < cmd.prixTotal && (
                        <div>
                          <span className="text-gray-500">Reste: </span>
                          <span className="font-medium text-rose-500">{cmd.prixTotal - cmd.avancePaye} FCFA</span>
                        </div>
                      )}
                    </div>
                  )}
                  {cmd.dateLivraison && (
                    <div className="mt-2 text-xs text-gray-500">
                      Date de livraison prévue: <span className="font-medium">{new Date(cmd.dateLivraison).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}