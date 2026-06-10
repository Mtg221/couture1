import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname }    = useLocation();

  const links = [
    { to: '/',         label: 'Accueil' },
    { to: '/galerie',  label: 'Galerie' },
    { to: '/commande', label: 'Commander' },
    { to: '/contact',  label: 'Contact' },
    { to: '/login', label: 'Connexion', auth: true },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-rose-600 tracking-wide">
          Atelier Couture
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${
                l.auth
                  ? 'bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600'
                  : pathname === l.to
                    ? 'text-rose-600'
                    : 'text-gray-600 hover:text-rose-500'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setOpen(!open)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 pb-4 flex flex-col gap-3">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`py-2 font-medium ${
                l.auth
                  ? 'bg-rose-500 text-white px-4 rounded-lg text-center'
                  : 'text-gray-700'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}