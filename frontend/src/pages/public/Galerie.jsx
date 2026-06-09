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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Nos réalisations</h1>
        <p className="text-gray-500 mb-8">Découvrez quelques-unes de nos créations</p>

        {/* Filtres */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategorie(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                categorie === c
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Chargement...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Aucune réalisation pour le moment.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <div
                key={item._id}
                onClick={() => setSelected(item)}
                className="cursor-pointer group overflow-hidden rounded-xl bg-gray-100 aspect-square"
              >
                <img
                  src={item.imageUrl}
                  alt={item.titre || item.categorie}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <img src={selected.imageUrl} alt={selected.titre} className="w-full max-h-[60vh] object-contain bg-gray-900" />
            <div className="p-4">
              {selected.titre && <p className="font-semibold text-gray-800">{selected.titre}</p>}
              {selected.description && <p className="text-gray-500 text-sm mt-1">{selected.description}</p>}
              <span className="inline-block mt-2 text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full capitalize">
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