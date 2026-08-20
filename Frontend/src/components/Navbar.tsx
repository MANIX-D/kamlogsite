import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ASSETS } from '../constants/assets';
import LanguageSwitcher from './LanguageSwitcher';
import { useOverlay } from '../hooks/useOverlay';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  // Verrou du scroll + fermeture sur Échap
  useOverlay(isOpen, () => setIsOpen(false));

  // Referme le menu lors d'un changement de page
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.services'), href: '/services' },
    { label: t('nav.infrastructures'), href: '/infrastructures' },
    { label: t('nav.partners'), href: '/partners' },
    { label: t('nav.news'), href: '/news' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  return (
    <nav className="bg-white/70 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.08)] fixed w-full top-0 z-50 border-b border-white/30">
      <div className="container-page">
        <div className="flex justify-between items-center h-16 sm:h-20 gap-2">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center group" aria-label="KAMLOG — Accueil">
            <img
              src={ASSETS.logo}
              alt="KAMLOG"
              className="h-9 xs:h-10 sm:h-12 w-auto group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-0.5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  location.pathname === item.href
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-[#1F3878] hover:text-red-600 hover:bg-red-50/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Language Selector & Mobile Menu Button */}
          <div className="flex items-center gap-1 xs:gap-2 sm:gap-4">
            <LanguageSwitcher />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-[#1F3878] hover:text-red-600 transition-all duration-300 p-2 rounded-lg hover:bg-gray-100"
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation — hauteur bornée et scrollable pour rester
            utilisable en paysage, où la hauteur disponible est très réduite */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="md:hidden pb-5 pt-2 space-y-1 animate-fade-in-down border-t border-gray-100/80 max-h-[calc(100dvh-4rem)] overflow-y-auto scroll-contain"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={location.pathname === item.href ? 'page' : undefined}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                  location.pathname === item.href
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'text-[#1F3878] hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
