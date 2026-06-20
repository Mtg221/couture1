import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname }    = useLocation();

  const links = [
    { to: '/',         label: 'Accueil' },
    { to: '/galerie',  label: 'Galerie' },
    { to: '/contact',  label: 'Contact' },
    { to: '/login', label: 'Connexion', auth: true },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-md shadow-gray-200/50 sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-auto py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="NKG Couture" className="h-14 w-auto transition-transform duration-300 group-hover:scale-105" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-all duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-0.5 after:bg-rose-500 after:transition-all after:duration-300 hover:after:w-full ${
                l.auth
                  ? 'bg-rose-500 text-white px-5 py-2.5 rounded-xl hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 after:hidden'
                  : pathname === l.to
                    ? 'text-rose-600 after:w-full'
                    : 'text-gray-600 hover:text-rose-500'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-600 hover:text-rose-500 transition-colors duration-300"
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
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 pb-4 flex flex-col gap-3 animate-fade-in">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`py-3 font-medium rounded-xl transition-all duration-300 ${
                l.auth
                  ? 'bg-rose-500 text-white px-4 text-center hover:bg-rose-600'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-500'
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