import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <img src={logo} alt="NKG Couture" className="h-20 w-auto mx-auto mb-6 bg-white rounded-2xl p-3 shadow-lg transition-transform duration-300 hover:scale-105" />
        <p className="text-white font-medium text-lg mb-2">NKG Couture - Mme KOUNDOUL</p>
        <p className="text-gray-500 mb-6">Broderie - Prêt à porter - Simple</p>
        <div className="w-16 h-0.5 bg-rose-500 mx-auto mb-6"></div>
        
        {/* Section création site web */}
        <div className="mb-6">
          <p className="text-gray-500 text-xs mb-3 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Pour tout besoin de création site web
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs">
            <a 
              href="tel:+221781224646" 
              className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +221 78 122 46 46
            </a>
            <span className="hidden sm:inline text-gray-600">|</span>
            <a 
              href="mailto:asstallfils@gmail.com" 
              className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              asstallfils@gmail.com
            </a>
          </div>
        </div>
        
        <p className="text-gray-600">© {new Date().getFullYear()} — Tous droits réservés</p>
      </div>
    </footer>
  );
}