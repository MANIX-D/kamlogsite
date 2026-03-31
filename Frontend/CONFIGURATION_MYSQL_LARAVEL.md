# Configuration MySQL + Laravel - KAMLOG

## Résumé des modifications

✅ **Supabase complètement supprimé** du projet frontend
✅ **Configuration Laravel + MySQL** prête à l'emploi
✅ **API REST** configurée avec Axios
✅ **Authentification** via Laravel Sanctum (tokens Bearer)

---

## 1. Configuration Frontend (React + Vite)

### Variables d'environnement (`.env`)

```env
# Laravel Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
```

**Note importante :** La configuration de la base de données MySQL se fait dans le backend Laravel, pas dans le frontend.

### Client API (`src/services/apiClient.ts`)

Le projet utilise **Axios** pour communiquer avec le backend Laravel :

```typescript
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,  // http://localhost:8000/api
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,  // Pour les cookies de session
});

// Intercepteur pour ajouter le token Bearer
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Configuration des endpoints (`src/config/api.ts`)

Tous les endpoints de l'API sont définis dans ce fichier :

```typescript
export const API_ENDPOINTS = {
  // API Publique
  services: '/services',
  actualites: '/actualites',
  partners: '/partners',
  infrastructures: '/infrastructures',
  contact: '/contact',
  newsletter: '/newsletter',
  visitRequest: '/visit-requests',
  quotes: '/quotes',

  // API Admin
  admin: {
    login: '/admin/login',
    logout: '/admin/logout',
    me: '/admin/me',
    services: '/admin/services',
    actualites: '/admin/actualites',
    partners: '/admin/partners',
    infrastructures: '/admin/infrastructures',
    messages: '/admin/messages',
    newsletter: '/admin/newsletter',
    announcements: '/admin/announcements',
    jobOffers: '/admin/job-offers',
    visitRequests: '/admin/visit-requests',
    quotes: '/admin/quotes',
    dashboard: '/admin/dashboard',
  },
};
```

---

## 2. Backend Laravel + MySQL

### Prérequis

- PHP 8.1+
- Composer
- MySQL 8.0+
- Laravel 10+

### Installation rapide

```bash
# 1. Créer le projet Laravel
composer create-project laravel/laravel kamlog-backend
cd kamlog-backend

# 2. Créer la base de données MySQL
mysql -u root -p
CREATE DATABASE kamlog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 3. Configuration .env
cp .env.example .env
# Éditer le fichier .env avec les paramètres MySQL

# 4. Installer Sanctum
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# 5. Copier les migrations depuis le dossier laravel_migrations/
# dans database/migrations/

# 6. Exécuter les migrations
php artisan migrate

# 7. Créer un admin
php artisan tinker
# Puis créer l'utilisateur admin (voir BACKEND_SETUP.md)

# 8. Démarrer le serveur
php artisan serve
```

### Configuration MySQL (`.env` du backend Laravel)

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kamlog
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
SESSION_DRIVER=database

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Structure de la base de données MySQL

Le projet contient **12 tables principales** :

1. **services** - Services offerts (transport, magasinage, etc.)
2. **actualites** - Actualités et news
3. **partners** - Partenaires commerciaux
4. **infrastructures** - Infrastructures et entrepôts
5. **contact_messages** - Messages de contact
6. **newsletter_subscribers** - Abonnés newsletter
7. **visit_requests** - Demandes de visite
8. **announcements** - Annonces importantes
9. **job_offers** - Offres d'emploi
10. **job_applications** - Candidatures
11. **quotes** - Demandes de devis
12. **admin_users** - Utilisateurs administrateurs

Toutes les migrations sont disponibles dans le dossier `laravel_migrations/`.

---

## 3. Architecture Frontend ↔ Backend

### Flux d'authentification (Sanctum)

```
1. Frontend : POST /api/admin/login
   Body: { email, password }

2. Backend : Vérifie les credentials
   Retourne: { token: "xxx", user: {...} }

3. Frontend : Stocke le token dans localStorage
   localStorage.setItem('auth_token', token)

4. Frontend : Requêtes suivantes avec header
   Authorization: Bearer {token}
```

### Flux de requête publique

```
Frontend : GET /api/services
Backend : Retourne la liste des services actifs
Frontend : Affiche les données
```

### Flux de requête admin

```
Frontend : GET /api/admin/services
Header : Authorization: Bearer {token}
Backend : Vérifie le token, vérifie les permissions
Backend : Retourne la liste complète des services
Frontend : Affiche dans l'interface admin
```

---

## 4. Internationalisation (i18n)

Le système de traduction supporte le contenu dynamique provenant de MySQL :

### Structure des champs dans MySQL

```sql
-- Chaque table de contenu a des champs multilingues
CREATE TABLE services (
  id BIGINT UNSIGNED PRIMARY KEY,
  title_fr VARCHAR(255),
  title_en VARCHAR(255),
  description_fr TEXT,
  description_en TEXT,
  ...
);
```

### Utilisation dans le frontend

```typescript
import { useMultilingualContent } from '@/utils/i18nHelpers';

function ServiceCard({ service }) {
  const { getLocalizedField } = useMultilingualContent();

  return (
    <div>
      <h3>{getLocalizedField(service, 'title')}</h3>
      <p>{getLocalizedField(service, 'description')}</p>
    </div>
  );
}
```

Le helper `getLocalizedField` :
- Retourne `title_fr` si la langue active est français
- Retourne `title_en` si la langue active est anglais
- Utilise le français comme fallback si la traduction anglaise n'existe pas

---

## 5. Structure des fichiers

```
kamlog-frontend/
├── .env                              # Configuration API
├── src/
│   ├── config/
│   │   └── api.ts                    # Endpoints API
│   ├── services/
│   │   ├── apiClient.ts              # Client Axios configuré
│   │   ├── api.ts                    # Services API publics
│   │   ├── adminApi.ts               # Services API admin
│   │   └── auth.ts                   # Service d'authentification
│   ├── i18n/
│   │   ├── config.ts                 # Configuration i18next
│   │   └── locales/
│   │       ├── fr.json               # Traductions FR
│   │       └── en.json               # Traductions EN
│   └── utils/
│       └── i18nHelpers.ts            # Helper multilingue

kamlog-backend/  (Laravel)
├── .env                              # Configuration MySQL
├── config/
│   └── cors.php                      # Configuration CORS
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/                  # Controllers API
│   └── Models/                       # Modèles Eloquent
└── database/
    └── migrations/                   # Migrations MySQL
```

---

## 6. Vérification de la configuration

### Vérifier que Supabase est supprimé

```bash
# Dans le dossier du projet frontend
grep -r "supabase" --exclude-dir=node_modules --exclude-dir=.git

# Résultat attendu :
# Aucune référence à Supabase dans le code (seulement dans la documentation)
```

### Vérifier la configuration API

```bash
# Afficher la variable d'environnement
cat .env | grep VITE_API_BASE_URL

# Résultat attendu :
# VITE_API_BASE_URL=http://localhost:8000/api
```

### Tester la connexion au backend

```bash
# Démarrer le frontend
npm run dev

# Dans un autre terminal, démarrer le backend Laravel
cd kamlog-backend
php artisan serve

# Ouvrir le navigateur sur http://localhost:5173
# Le frontend doit pouvoir communiquer avec http://localhost:8000/api
```

---

## 7. Commandes utiles

### Frontend (React)

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Vérifier les types TypeScript
npm run typecheck
```

### Backend (Laravel)

```bash
# Voir toutes les routes API
php artisan route:list

# Rafraîchir la base de données
php artisan migrate:refresh

# Créer un contrôleur
php artisan make:controller Api/MonController --api

# Vider le cache
php artisan cache:clear
php artisan config:clear
```

---

## 8. Documentation complète

Pour plus de détails, consultez :

- **BACKEND_SETUP.md** - Guide détaillé d'installation du backend Laravel
- **LARAVEL_BACKEND_GUIDE.md** - Guide de développement Laravel
- **docs/TRANSLATION_SYSTEM.md** - Système de traduction complet
- **laravel_migrations/README.md** - Documentation des migrations

---

## Résumé

✅ **Pas de Supabase** - Projet 100% Laravel + MySQL
✅ **API RESTful** - Communication via Axios
✅ **Authentification Sanctum** - Tokens Bearer sécurisés
✅ **Multilingue** - FR/EN via i18next + champs MySQL _fr/_en
✅ **CORS configuré** - Frontend et backend communiquent sans problème
✅ **Structure propre** - Séparation claire frontend/backend

Le projet est prêt à être développé et déployé avec MySQL et Laravel ! 🚀
