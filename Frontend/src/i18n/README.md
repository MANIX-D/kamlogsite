# Système de traduction i18next - KAMLOG

## Vue d'ensemble

Ce projet utilise **i18next** avec **react-i18next** pour gérer les traductions en français (FR) et anglais (EN). Le système est conçu pour gérer à la fois :
- Les contenus statiques (interface, labels, messages)
- Les contenus dynamiques provenant du backend Laravel (API MySQL)

## 1. Configuration

### Fichier de configuration : `src/i18n/config.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationFR from './locales/fr.json';
import translationEN from './locales/en.json';

const resources = {
  fr: { translation: translationFR },
  en: { translation: translationEN },
};

const savedLanguage = localStorage.getItem('kamlog-language') || 'fr';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

// Sauvegarde automatique de la langue sélectionnée
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('kamlog-language', lng);
});

export default i18n;
```

**Langues configurées :**
- Français (`fr`) - langue par défaut
- Anglais (`en`)

**Persistance :** La langue sélectionnée est sauvegardée dans `localStorage` sous la clé `kamlog-language`.

## 2. Structure des fichiers

```
src/i18n/
├── config.ts                  # Configuration i18next
├── locales/
│   ├── fr.json               # Traductions françaises
│   └── en.json               # Traductions anglaises
└── README.md                 # Documentation

src/utils/
└── i18nHelpers.ts            # Helpers pour contenus multilingues

src/components/
└── LanguageSwitcher.tsx      # Composant sélecteur de langue
```

### Exemple de structure JSON

**fr.json :**
```json
{
  "nav": {
    "home": "Accueil",
    "about": "À Propos",
    "services": "Nos services"
  },
  "hero": {
    "title": "Votre partenaire stratégique",
    "subtitle": "Solutions complètes de transport"
  }
}
```

**en.json :**
```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "services": "Our Services"
  },
  "hero": {
    "title": "Your strategic partner",
    "subtitle": "Complete transport solutions"
  }
}
```

## 3. Utilisation dans les composants

### Composants React

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
}
```

### Sélecteur de langue : `LanguageSwitcher`

Le composant `LanguageSwitcher` permet de basculer entre FR et EN :

```typescript
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <button onClick={toggleLanguage}>
      <Globe size={20} />
      <span>{i18n.language}</span>
    </button>
  );
}
```

## 4. Contenus dynamiques (Base de données)

### Structure de la base de données

Toutes les tables de contenu dynamique ont des champs multilingues :

**Table `actualites` :**
- `titre_fr` / `titre_en`
- `contenu_fr` / `contenu_en`

**Table `services` :**
- `nom_fr` / `nom_en`
- `description_fr` / `description_en`

**Table `infrastructures` :**
- `nom_fr` / `nom_en`
- `description_fr` / `description_en`

**Table `partners` :**
- `name_fr` / `name_en`
- `description_fr` / `description_en`

### Helper pour les contenus multilingues

**Fichier : `src/utils/i18nHelpers.ts`**

```typescript
import { useTranslation } from 'react-i18next';

export const useMultilingualContent = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const getLocalizedField = (item: any, fieldName: string): string => {
    const localizedKey = `${fieldName}_${currentLang}`;
    const fallbackKey = `${fieldName}_fr`;
    return item[localizedKey] || item[fallbackKey] || '';
  };

  return { getLocalizedField, currentLang };
};
```

### Exemple d'utilisation avec Laravel API

```typescript
import { useEffect, useState } from 'react';
import { adminApiService, Service } from '../services/adminApi';
import { useMultilingualContent } from '../utils/i18nHelpers';

function ServicesDisplay() {
  const [services, setServices] = useState<Service[]>([]);
  const { getLocalizedField } = useMultilingualContent();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const data = await adminApiService.getServices();
    setServices(data);
  };

  return (
    <div>
      {services.map((service) => (
        <div key={service.id}>
          <h3>{getLocalizedField(service, 'title')}</h3>
          <p>{getLocalizedField(service, 'description')}</p>
        </div>
      ))}
    </div>
  );
}
```

Le helper `getLocalizedField` :
1. Cherche d'abord le champ dans la langue active (ex: `nom_en`)
2. Si non trouvé, revient au français (ex: `nom_fr`)
3. Retourne une chaîne vide si aucun n'existe

## 5. Navbar et navigation

Le composant `Navbar` utilise les traductions pour tous les liens :

```typescript
const navItems = [
  { label: t('nav.home'), href: '/' },
  { label: t('nav.about'), href: '/about' },
  { label: t('nav.services'), href: '/services' },
];
```

Le `LanguageSwitcher` est intégré dans la navbar.

## 6. Évolutivité

### Ajouter une nouvelle traduction

1. Ajoutez la clé dans `fr.json` :
```json
{
  "myNewSection": {
    "title": "Mon nouveau titre"
  }
}
```

2. Ajoutez la traduction dans `en.json` :
```json
{
  "myNewSection": {
    "title": "My new title"
  }
}
```

3. Utilisez-la dans votre composant :
```typescript
<h1>{t('myNewSection.title')}</h1>
```

### Ajouter une nouvelle langue

1. Créez `src/i18n/locales/es.json`
2. Modifiez `src/i18n/config.ts` pour inclure la nouvelle langue
3. Mettez à jour le `LanguageSwitcher`

### Nouveaux composants

Tous les nouveaux composants peuvent utiliser le système automatiquement :

```typescript
import { useTranslation } from 'react-i18next';

function NewComponent() {
  const { t } = useTranslation();
  return <div>{t('key.path')}</div>;
}
```

## 7. Résumé

✅ **Configuration complète** : i18next configuré avec FR/EN
✅ **Persistance** : Langue sauvegardée dans localStorage
✅ **Composants traduits** : Navbar, Footer, toutes les pages
✅ **Sélecteur de langue** : LanguageSwitcher fonctionnel
✅ **Base de données multilingue** : Tables avec champs _fr/_en
✅ **Helpers** : Fonctions pour gérer les contenus dynamiques
✅ **Évolutif** : Facile d'ajouter de nouvelles traductions/langues
