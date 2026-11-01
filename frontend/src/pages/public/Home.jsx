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
        <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] w-full">
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
            className="inline-block border-2 border-gray-300 hover:border-rose-500 hover:bg-rose-500 hover:text-white text-gray-800 px-10 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            Voir la galerie
          </Link>
        </div>
      </section>

      {/* Atouts */}
      <section className="py-20 px-4 max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: 'Sur mesure',
              desc: 'Chaque vêtement est taillé selon vos mesures exactes, pour un ajustement parfait et un confort absolu.',
              icon: (
                <svg className="w-10 h-10 text-rose-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879a3 3 0 11-4.242-4.242L7.757 7.757m0 0l2.879-2.879a3 3 0 114.242 4.242L12 12m-4.243-4.243L5 5" />
                </svg>
              ),
            },
            {
              title: 'Créations uniques',
              desc: 'Des modèles exclusifs inspirés des plus belles étoffes et confectionnés avec la précision des grands ateliers.',
              icon: (
                <svg className="w-10 h-10 text-rose-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              ),
            },
            {
              title: 'Livraison ponctuelle',
              desc: 'Un calendrier d’essayage et de confection rigoureusement tenu pour honorer tous vos événements sans stress.',
              icon: (
                <svg className="w-10 h-10 text-rose-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((a, index) => (
            <div 
              key={a.title} 
              className="card text-center p-8 group transition-all duration-300 hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-rose-400"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-rose-50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-rose-100">
                {a.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-xl">{a.title}</h3>
              <p className="text-gray-600 text-base leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section décorative */}
      <section className="py-20 px-4 bg-gradient-to-r from-rose-50 via-white to-rose-50">
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
            className="inline-block bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white px-10 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-rose-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}