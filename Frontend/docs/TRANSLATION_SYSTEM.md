# Système de Traduction Global - KAMLOG

## Vue d'ensemble

Le site KAMLOG utilise un système de traduction complet basé sur **i18next** et **react-i18next** qui permet de gérer facilement le contenu en **Français** (langue par défaut) et **Anglais**.

## Structure des fichiers

```
src/
├── i18n/
│   ├── config.ts                    # Configuration i18next
│   └── locales/
│       ├── fr.json                  # Traductions françaises
│       └── en.json                  # Traductions anglaises
├── utils/
│   └── i18nHelpers.ts              # Helpers pour contenu multilingue dynamique
└── components/
    └── LanguageSwitcher.tsx         # Composant de changement de langue
```

## Configuration actuelle

### Langues supportées
- **fr** (Français) - Langue par défaut
- **en** (English)

### Configuration i18next

Le fichier `src/i18n/config.ts` contient la configuration de base:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      fr: { translation: frTranslations }
    },
    lng: 'fr',               // Langue par défaut
    fallbackLng: 'fr',       // Langue de secours
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

## Utilisation dans les composants React

### Import du hook de traduction

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>{t('hero.title')}</p>
    </div>
  );
}
```

### Exemples d'utilisation

```typescript
// Texte simple
<h1>{t('nav.home')}</h1>

// Avec interpolation
<p>{t('welcome', { name: 'John' })}</p>

// Avec placeholder
<input placeholder={t('contact.form.fields.name')} />

// Conditionnel
<button>
  {isSubmitting ? t('contact.form.buttons.sending') : t('contact.form.buttons.send')}
</button>
```

## Structure des clés de traduction

Les fichiers JSON sont organisés de manière hiérarchique:

```json
{
  "nav": {
    "home": "Accueil",
    "about": "À propos",
    "services": "Nos Services"
  },
  "hero": {
    "title": "Votre partenaire logistique",
    "subtitle": "Solutions complètes"
  },
  "contact": {
    "form": {
      "name": "Nom",
      "email": "Email",
      "submit": "Envoyer"
    }
  }
}
```

## Contenu Dynamique Multilingue

Pour le contenu provenant de l'API (actualités, services, partenaires, etc.), utilisez le helper fourni:

### Utilisation du helper

```typescript
import { useMultilingualContent } from '@/utils/i18nHelpers';

function NewsComponent({ news }) {
  const { getLocalizedField } = useMultilingualContent();

  return (
    <div>
      <h2>{getLocalizedField(news, 'title')}</h2>
      <p>{getLocalizedField(news, 'description')}</p>
    </div>
  );
}
```

### Structure des données dans la base de données

Pour que le contenu dynamique soit multilingue, les tables doivent contenir des colonnes pour chaque langue:

#### Exemple: Table `actualites`

```sql
CREATE TABLE actualites (
  id UUID PRIMARY KEY,
  title_fr TEXT NOT NULL,
  title_en TEXT,
  description_fr TEXT NOT NULL,
  description_en TEXT,
  content_fr TEXT NOT NULL,
  content_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Exemple: Table `services`

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_en TEXT,
  description_fr TEXT NOT NULL,
  description_en TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Migration MySQL pour ajouter des colonnes de traduction

```sql
-- Ajouter des colonnes de traduction à une table existante
ALTER TABLE actualites
ADD COLUMN title_en VARCHAR(255) NULL AFTER title_fr,
ADD COLUMN description_en TEXT NULL AFTER description_fr,
ADD COLUMN content_en LONGTEXT NULL AFTER content_fr;

-- Copier les valeurs françaises comme valeurs par défaut pour l'anglais
UPDATE actualites
SET
  title_en = COALESCE(title_en, title_fr),
  description_en = COALESCE(description_en, description_fr),
  content_en = COALESCE(content_en, content_fr);
```

## Composant LanguageSwitcher

Le composant de changement de langue est déjà implémenté dans le Navbar:

```typescript
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <button onClick={toggleLanguage}>
      <Globe className="w-5 h-5" />
      <span>{i18n.language.toUpperCase()}</span>
    </button>
  );
}
```

## Traductions complètes disponibles

Toutes les pages suivantes ont des traductions complètes:

### Pages publiques
- ✅ **Accueil** (`hero`, `services`, `testimonials`, `why`)
- ✅ **À propos** (`about`)
- ✅ **Services** (`services`, `servicesDetailed`)
- ✅ **Infrastructures** (`infrastructuresPage`)
- ✅ **Partenaires** (`partners`)
- ✅ **Actualités** (`news`, `jobs`)
- ✅ **Contact** (`contact`)

### Composants
- ✅ **Navigation** (`nav`)
- ✅ **Footer** (`footer`)
- ✅ **Modal de visite** (`visitRequest`)

### Interface Admin
- ✅ **Login** (`admin.login`)
- ✅ **Dashboard** (`admin.dashboard`)
- ✅ **Actualités** (`admin.news`)
- ✅ **Partenaires** (`admin.partners`)
- ✅ **Services** (`admin.services`)
- ✅ **Infrastructures** (`admin.infrastructures`)
- ✅ **Messages** (`admin.messages`)
- ✅ **Newsletter** (`admin.newsletter`)
- ✅ **Actions communes** (`admin.common`)

## Ajouter de nouvelles traductions

### 1. Ajouter les clés dans les fichiers JSON

**fr.json:**
```json
{
  "newSection": {
    "title": "Nouveau titre",
    "description": "Nouvelle description"
  }
}
```

**en.json:**
```json
{
  "newSection": {
    "title": "New title",
    "description": "New description"
  }
}
```

### 2. Utiliser dans le composant

```typescript
function NewComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('newSection.title')}</h1>
      <p>{t('newSection.description')}</p>
    </div>
  );
}
```

## Best Practices

### ✅ À FAIRE

1. **Toujours utiliser des clés de traduction** - Jamais de texte en dur
   ```typescript
   ✅ <h1>{t('hero.title')}</h1>
   ❌ <h1>Bienvenue</h1>
   ```

2. **Structure hiérarchique claire** - Organiser par section/page
   ```json
   {
     "contact": {
       "form": {
         "fields": {
           "name": "Nom"
         }
       }
     }
   }
   ```

3. **Utiliser le helper pour le contenu dynamique**
   ```typescript
   const { getLocalizedField } = useMultilingualContent();
   const title = getLocalizedField(item, 'title');
   ```

4. **Tester les deux langues** - Vérifier que tout s'affiche correctement

### ❌ À ÉVITER

1. **Texte hardcodé** - Ne jamais mettre de texte directement dans le JSX
2. **Clés inconsistantes** - Utiliser la même structure pour fr et en
3. **Oublier les placeholders** - Traduire aussi les placeholders des inputs
4. **Traductions manquantes** - Toujours avoir une clé en français ET en anglais

## Déploiement et Production

Le système de traduction est **prêt pour la production**:

- ✅ Pas de dépendances externes supplémentaires
- ✅ Build optimisé avec Vite
- ✅ Fichiers JSON compilés dans le bundle
- ✅ Changement de langue instantané sans rechargement
- ✅ Sauvegarde automatique de la langue sélectionnée (via localStorage)

## Support et Extension

### Ajouter une nouvelle langue

Pour ajouter une nouvelle langue (ex: Espagnol):

1. Créer `/src/i18n/locales/es.json`
2. Ajouter dans `config.ts`:
   ```typescript
   import esTranslations from './locales/es.json';

   resources: {
     fr: { translation: frTranslations },
     en: { translation: enTranslations },
     es: { translation: esTranslations }  // Nouvelle langue
   }
   ```

3. Mettre à jour le `LanguageSwitcher` pour inclure l'espagnol

### Maintenance

- Les fichiers de traduction sont dans `/src/i18n/locales/`
- Utiliser un outil de validation JSON pour éviter les erreurs de syntaxe
- Documenter les nouvelles clés ajoutées
- Tester régulièrement le changement de langue

## Conclusion

Le système de traduction de KAMLOG est:
- ✅ **Complet** - Toutes les pages sont traduites
- ✅ **Scalable** - Facile d'ajouter de nouvelles traductions
- ✅ **Performant** - Optimisé pour la production
- ✅ **Maintenable** - Code propre et bien organisé
- ✅ **Flexible** - Support du contenu statique et dynamique

Pour toute question ou amélioration, référez-vous à la documentation officielle de [react-i18next](https://react.i18next.com/).
