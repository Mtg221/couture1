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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">Nos réalisations</h1>
          <p className="text-gray-500 mb-10 text-lg">Découvrez quelques-unes de nos créations</p>
        </div>

        {/* Filtres */}
        <div className="flex gap-3 flex-wrap mb-10 animate-fade-in">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategorie(c)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                categorie === c
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-rose-50 hover:text-rose-500 border border-gray-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="animate-pulse">Chargement...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Aucune réalisation pour le moment.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((item, index) => (
              <div
                key={item._id}
                onClick={() => setSelected(item)}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 aspect-square transform transition-all duration-300 hover:shadow-xl hover:shadow-rose-100/50 hover:-translate-y-1 hover:border-rose-200"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.titre || item.categorie}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white">
                      {item.titre && <p className="font-semibold text-sm">{item.titre}</p>}
                      <p className="text-xs text-white/80 capitalize">{item.categorie}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div 
            className="max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 animate-fade-in" 
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={selected.imageUrl} 
                alt={selected.titre} 
                className="w-full max-h-[65vh] object-contain bg-gray-900" 
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {selected.titre && <p className="font-bold text-2xl text-gray-800 mb-2">{selected.titre}</p>}
              {selected.description && <p className="text-gray-500 text-base leading-relaxed mb-4">{selected.description}</p>}
              <span className="inline-block text-xs bg-rose-100 text-rose-600 px-3 py-1.5 rounded-full capitalize font-medium">
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