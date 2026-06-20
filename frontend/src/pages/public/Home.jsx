import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import logo from '../../assets/logo.png';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-rose-100 via-rose-50 to-white">
        <div className="animate-fade-in">
          <img src={logo} alt="NKG Couture" className="h-40 md:h-52 w-auto mb-10 drop-shadow-lg transition-transform duration-500 hover:scale-105" />
          <span className="inline-block text-rose-500 font-medium text-sm tracking-widest uppercase mb-6 bg-rose-50 px-4 py-2 rounded-full">
            Atelier de couture · Dakar
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Des vêtements créés<br />
            <span className="text-rose-500">rien que pour vous</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mb-10 text-xl font-light leading-relaxed">
            Robes, costumes, boubous, tailleurs — sur mesure, avec soin,
            livrés dans les délais.
          </p>
          <Link
            to="/galerie"
            className="inline-block border-2 border-gray-300 hover:border-rose-400 hover:bg-rose-500 hover:text-white text-gray-700 px-10 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Voir la galerie
          </Link>
        </div>
      </section>

      {/* Atouts */}
      <section className="py-20 px-4 max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { icon: '✂️', title: 'Sur mesure', desc: 'Chaque vêtement est taillé selon vos mesures exactes, pour un ajustement parfait.' },
            { icon: '🎨', title: 'Créations uniques', desc: 'Des modèles originaux ou selon vos inspirations, réalisés avec passion.' },
            { icon: '🚀', title: 'Livraison rapide', desc: 'Respect des délais convenus, sans compromis sur la qualité.' },
          ].map((a, index) => (
            <div 
              key={a.title} 
              className="card text-center p-8 group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-5xl mb-6 transform transition-transform duration-300 group-hover:scale-110">{a.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-3 text-xl">{a.title}</h3>
              <p className="text-gray-500 text-base leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section décorative */}
      <section className="py-20 px-4 bg-gradient-to-r from-rose-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            L'élégance sur mesure
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            Chaque pièce est unique, conçue avec passion et précision pour sublimer votre style.
            De la première mesure à la dernière retouche, nous mettons tout notre savoir-faire 
            au service de votre élégance.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-10 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-rose-500/30"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}