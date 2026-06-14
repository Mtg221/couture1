import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext.jsx';
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

  if (!stats) return <div className="p-8 text-gray-400">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="NKG Couture" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.username}</span>
          <button onClick={logout} className="text-sm text-rose-500 hover:underline">Déconnexion</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-rose-500 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Retour
        </Link>

        {/* Nav admin */}
        <nav className="flex gap-2 flex-wrap mb-8">
          {[
            { to: '/admin',           label: 'Dashboard' },
            { to: '/admin/clients',   label: 'Clients' },
            { to: '/admin/commandes', label: 'Commandes' },
            { to: '/admin/galerie',   label: 'Galerie' },
            { to: '/admin/messages',  label: 'Messages' },
            { to: '/admin/employes',  label: 'Employés' },
            { to: '/admin/rapports',  label: 'Rapports' },
            { to: '/admin/rapports-paiements',  label: 'Rapports Paiements' },
          ].map(l => (
            <Link key={l.to} to={l.to}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Clients" value={stats.totalClients} color="blue"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>}
          />
          <StatCard label="Commandes" value={stats.totalCommandes} color="rose"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
          />
          <StatCard label="En cours" value={stats.commandesEnCours} color="amber"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          />
          <StatCard label="Chiffre d'affaires" value={`${stats.chiffreAffaires.toLocaleString()} FCFA`} color="green"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          />
        </div>

        {/* Commandes récentes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Commandes récentes</h2>
            <Link to="/admin/commandes" className="text-sm text-rose-500 hover:underline">Voir tout</Link>
          </div>
          <div className="divide-y">
            {stats.commandesRecentes.map(c => (
              <Link key={c._id} to={`/admin/commandes/${c._id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-800">{c.client?.nom || 'Client inconnu'}</p>
                  <p className="text-sm text-gray-500">
                    {c.vetements?.[0]?.typeVetement || c.typeVetement || 'Commande'}
                    {c.vetements && c.vetements.length > 1 && <span className="text-xs text-gray-400 ml-1">(+{c.vetements.length - 1})</span>}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUT_COLORS[c.vetements?.[0]?.statut || c.statut]}`}>
                  {(c.vetements?.[0]?.statut || c.statut || 'en_attente').replace('_', ' ')}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}