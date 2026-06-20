import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext.jsx';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import logo from '../../assets/logo.png';

const STATUT_COLORS = {
  en_attente: 'bg-amber-100 text-amber-700',
  en_cours:   'bg-blue-100 text-blue-700',
  prete:      'bg-green-100 text-green-700',
  livree:     'bg-gray-100 text-gray-600',
  refusee:    'bg-red-100 text-red-600',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then(res => setStats(res.data));
  }, []);

  if (!stats) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Chargement...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
            <p className="text-sm text-gray-500 mt-1">Bienvenue sur votre espace d'administration</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl">
              <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.username}</span>
            </div>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-600 font-medium px-4 py-2 rounded-xl hover:bg-rose-50 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              label="Clients" 
              value={stats.totalClients} 
              color="blue"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>}
            />
            <StatCard 
              label="Commandes" 
              value={stats.totalCommandes} 
              color="rose"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
            />
            <StatCard 
              label="En cours" 
              value={stats.commandesEnCours} 
              color="amber"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
            />
            <StatCard 
              label="Chiffre d'affaires" 
              value={`${stats.chiffreAffaires.toLocaleString()} FCFA`} 
              color="green"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
            />
          </div>

          {/* Commandes récentes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-white to-gray-50">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Commandes récentes</h2>
                <p className="text-sm text-gray-500 mt-1">Les dernières commandes passées</p>
              </div>
              <Link 
                to="/admin/commandes" 
                className="inline-flex items-center gap-2 text-sm text-rose-500 hover:text-rose-600 font-medium bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-all duration-300"
              >
                Voir tout
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {stats.commandesRecentes.map(c => (
                <Link 
                  key={c._id} 
                  to={`/admin/commandes/${c._id}`}
                  className="flex items-center justify-between px-8 py-4 hover:bg-gray-50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {c.client?.nom?.charAt(0).toUpperCase() || 'C'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
                        {c.client?.nom || 'Client inconnu'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {c.vetements?.[0]?.typeVetement || c.typeVetement || 'Commande'}
                        {c.vetements && c.vetements.length > 1 && (
                          <span className="text-xs text-gray-400 ml-1">(+{c.vetements.length - 1} autres)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${STATUT_COLORS[c.vetements?.[0]?.statut || c.statut]}`}>
                      {(c.vetements?.[0]?.statut || c.statut || 'en_attente').replace('_', ' ')}
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}