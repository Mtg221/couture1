import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <img src={logo} alt="NKG Couture" className="h-16 w-auto mx-auto mb-4 bg-white rounded-lg p-2" />
        <p className="text-white font-medium mb-1">NKG Couture - Mme KOUNDOUL</p>
        <p>Broderie - Prêt à porter - Simple</p>
        <p className="mt-2">© {new Date().getFullYear()} — Tous droits réservés</p>
      </div>
    </footer>
  );
}