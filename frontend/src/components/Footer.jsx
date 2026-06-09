export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-white font-medium mb-1">Atelier Couture</p>
        <p>Dakar, Sénégal · Créations sur mesure</p>
        <p className="mt-2">© {new Date().getFullYear()} — Tous droits réservés</p>
      </div>
    </footer>
  );
}