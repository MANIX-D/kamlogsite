import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex flex-shrink-0 items-center gap-2 p-2 text-blue-900 hover:text-red-600 transition-colors group ${className}`}
      aria-label={i18n.language === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <Globe size={20} className="group-hover:rotate-12 transition-transform" />
      <span className="hidden sm:inline text-sm font-medium uppercase">
        {i18n.language}
      </span>
    </button>
  );
}
