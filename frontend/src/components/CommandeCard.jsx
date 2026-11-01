import { Link } from 'react-router-dom';

const STATUT_CONFIG = {
  en_attente: {
    label: 'En attente',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
  },
  en_cours: {
    label: 'En cours',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-400',
  },
  prete: {
    label: 'Prête',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-400',
  },
  livree: {
    label: 'Livrée',
    badge: 'bg-gray-100 text-gray-700 border-gray-200',
    dot: 'bg-gray-400',
  },
  refusee: {
    label: 'Refusée',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-400',
  },
};

export default function CommandeCard({ commande, basePath = '/admin/commandes' }) {
  if (!commande) return null;

  const statutKey = commande.vetements?.[0]?.statut || commande.statut || 'en_attente';
  const config = STATUT_CONFIG[statutKey] || STATUT_CONFIG.en_attente;
  const clientNom = commande.client?.nom || 'Client particulier';
  const initial = clientNom.charAt(0).toUpperCase();
  const vetementType = commande.vetements?.[0]?.typeVetement || commande.typeVetement || 'Vêtement sur mesure';
  const total = commande.montantTotal || 0;
  const avance = commande.avance || 0;
  const solde = Math.max(0, total - avance);
  const dateFormatted = commande.dateCommande 
    ? new Date(commande.dateCommande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-all duration-200 hover:shadow-md hover:border-gray-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm"
              aria-hidden="true"
            >
              {initial}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors truncate">
                {clientNom}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {commande.numeroCommande ? `#${commande.numeroCommande} · ` : ''}
                {vetementType}
                {commande.vetements && commande.vetements.length > 1 && (
                  <span className="text-gray-400 ml-1">
                    (+{commande.vetements.length - 1} autre{commande.vetements.length > 2 ? 's' : ''})
                  </span>
                )}
              </p>
            </div>
          </div>

          <span 
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
            {config.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 py-3 border-y border-gray-50 text-xs mb-4">
          <div>
            <span className="text-gray-400 block mb-0.5">Montant total</span>
            <span className="font-semibold text-gray-800">
              {total.toLocaleString()} FCFA
            </span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 block mb-0.5">Reste à payer</span>
            <span className={`font-semibold ${solde > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {solde > 0 ? `${solde.toLocaleString()} FCFA` : 'Soldé'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        {dateFormatted ? (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {dateFormatted}
          </span>
        ) : <span />}

        <Link
          to={`${basePath}/${commande._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 py-1.5 px-3 rounded-lg hover:bg-rose-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          aria-label={`Détails de la commande de ${clientNom}`}
        >
          Détails
          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
