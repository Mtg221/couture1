import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import logo from '../../assets/logo.png';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-b from-rose-50 to-white">
        <img src={logo} alt="NKG Couture" className="h-32 md:h-40 w-auto mb-8" />
        <span className="text-rose-500 font-medium text-sm tracking-widest uppercase mb-4">
          Atelier de couture · Dakar
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Des vêtements créés<br />
          <span className="text-rose-500">rien que pour vous</span>
        </h1>
        <p className="text-gray-500 max-w-xl mb-8 text-lg">
          Robes, costumes, boubous, tailleurs — sur mesure, avec soin,
          livrés dans les délais.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            to="/commande"
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Passer une commande
          </Link>
          <Link
            to="/galerie"
            className="border border-gray-300 hover:border-rose-400 text-gray-700 px-8 py-3 rounded-full font-medium transition-colors"
          >
            Voir la galerie
          </Link>
        </div>
      </section>

      {/* Atouts */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '✂️', title: 'Sur mesure', desc: 'Chaque vêtement est taillé selon vos mesures exactes.' },
            { icon: '🎨', title: 'Créations uniques', desc: 'Des modèles originaux ou selon vos inspirations.' },
            { icon: '🚀', title: 'Livraison rapide', desc: 'Respect des délais convenus, sans compromis.' },
          ].map(a => (
            <div key={a.title} className="text-center p-6">
              <div className="text-4xl mb-4">{a.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{a.title}</h3>
              <p className="text-gray-500 text-sm">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}