import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CATEGORIES = ['toutes', 'robe', 'costume', 'boubou', 'tailleur', 'enfant', 'autre'];

export default function Galerie() {
  const [items, setItems]         = useState([]);
  const [categorie, setCategorie] = useState('toutes');
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    const params = categorie !== 'toutes' ? { categorie } : {};
    api.get('/galerie', { params })
      .then(res => setItems(res.data))
      .finally(() => setLoading(false));
  }, [categorie]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelected(null);
    };
    if (selected) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selected]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Nos réalisations</h1>
          <p className="text-gray-600 mb-10 text-lg">Découvrez le savoir-faire de l'atelier à travers nos créations</p>
        </div>

        {/* Filtres */}
        <div className="flex gap-2.5 flex-wrap mb-10 animate-fade-in" role="toolbar" aria-label="Filtrer par catégorie">
          {CATEGORIES.map(c => {
            const isActive = categorie === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategorie(c)}
                aria-pressed={isActive}
                className={`px-5 py-2.5 rounded-full text-sm font-medium capitalize transition-all duration-200 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 font-semibold'
                    : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-200'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500" role="status">
            <div className="animate-spin w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm font-medium">Chargement des réalisations...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-gray-100 p-8">
            <p className="text-lg font-medium text-gray-700">Aucune réalisation dans cette catégorie.</p>
            <p className="text-sm text-gray-500 mt-1">Revenez bientôt ou contactez-nous pour une commande sur mesure.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((item, index) => (
              <button
                key={item._id}
                type="button"
                onClick={() => setSelected(item)}
                aria-label={`Agrandir ${item.titre || item.categorie}`}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 aspect-square transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-rose-200 text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.titre || `Modèle de ${item.categorie}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 flex items-end p-4">
                    <div className="text-white">
                      {item.titre && <p className="font-semibold text-sm line-clamp-1">{item.titre}</p>}
                      <p className="text-xs text-white/90 capitalize">{item.categorie}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selected.titre || 'Détails de la création'}
        >
          <div 
            className="max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-200 animate-fade-in" 
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={selected.imageUrl} 
                alt={selected.titre || selected.categorie} 
                className="w-full max-h-[65vh] object-contain bg-gray-950" 
              />
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Fermer l'aperçu"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {selected.titre && <p className="font-bold text-2xl text-gray-900 mb-2">{selected.titre}</p>}
              {selected.description && <p className="text-gray-600 text-base leading-relaxed mb-4">{selected.description}</p>}
              <span className="inline-block text-xs bg-rose-50 text-rose-700 border border-rose-100 px-3 py-1.5 rounded-full capitalize font-semibold">
                {selected.categorie}
              </span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}