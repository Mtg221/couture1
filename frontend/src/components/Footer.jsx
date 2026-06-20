import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <img src={logo} alt="NKG Couture" className="h-20 w-auto mx-auto mb-6 bg-white rounded-2xl p-3 shadow-lg transition-transform duration-300 hover:scale-105" />
        <p className="text-white font-medium text-lg mb-2">NKG Couture - Mme KOUNDOUL</p>
        <p className="text-gray-500 mb-6">Broderie - Prêt à porter - Simple</p>
        <div className="w-16 h-0.5 bg-rose-500 mx-auto mb-6"></div>
        <p className="text-gray-600">© {new Date().getFullYear()} — Tous droits réservés</p>
      </div>
    </footer>
  );
}