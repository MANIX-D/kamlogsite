# KAMLOG - Site Web Corporate

Site web de la **Société Camerounaise de Magasinage et de Logistique (KAMLOG)**.

## Stack Technique

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le style
- **React Router** pour la navigation
- **i18next** pour l'internationalisation (FR/EN)
- **Axios** pour les requêtes API
- **Lucide React** pour les icônes

### Backend
- **Laravel 10+** (PHP 8.1+)
- **MySQL 8.0+**
- **Laravel Sanctum** pour l'authentification API
- **API RESTful**

## Installation

### Prérequis

- Node.js 18+ et npm
- PHP 8.1+
- Composer
- MySQL 8.0+

### Frontend

```bash
# Installer les dépendances
npm install

# Copier le fichier .env
cp .env.example .env

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

### Backend

Voir le fichier **BACKEND_SETUP.md** pour les instructions détaillées d'installation du backend Laravel + MySQL.

```bash
# Installation rapide du backend
composer create-project laravel/laravel kamlog-backend
cd kamlog-backend

# Configuration MySQL dans .env
# Copier les migrations depuis laravel_migrations/
# Exécuter php artisan migrate
# Créer un admin via php artisan tinker

# Démarrer le serveur Laravel
php artisan serve
```

Le backend sera accessible sur `http://localhost:8000`

## Configuration

### Variables d'environnement (.env)

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Note :** La configuration MySQL se fait dans le `.env` du backend Laravel, pas dans le frontend.

## Fonctionnalités

### Pages Publiques
- **Accueil** - Présentation de KAMLOG, services, témoignages
- **À propos** - Histoire, mission, vision, valeurs
- **Services** - Liste détaillée des services (transport, magasinage, manutention, etc.)
- **Infrastructures** - Présentation des entrepôts et équipements
- **Partenaires** - Logos et présentation des partenaires
- **Actualités** - News et offres d'emploi
- **Contact** - Formulaire de contact et informations

### Interface Administrateur
- **Dashboard** - Statistiques et vue d'ensemble
- **Gestion des services** - CRUD complet
- **Gestion des actualités** - CRUD avec publication/dépublication
- **Gestion des partenaires** - CRUD avec réorganisation
- **Gestion des infrastructures** - CRUD complet
- **Messages de contact** - Consultation et marquage comme lu
- **Newsletter** - Liste des abonnés
- **Demandes de visite** - Gestion des statuts
- **Annonces** - CRUD complet
- **Offres d'emploi** - CRUD avec gestion des candidatures
- **Demandes de devis** - Gestion des statuts

Accès admin : `http://localhost:5173/admin/login`

**Identifiants par défaut :**
- Email : `admin@kamlog.cm`
- Mot de passe : `Admin123!`

## Internationalisation

Le site supporte **Français** (défaut) et **Anglais**.

### Contenu statique
Les traductions de l'interface sont dans `src/i18n/locales/`:
- `fr.json` - Traductions françaises
- `en.json` - Traductions anglaises

### Contenu dynamique
Le contenu provenant de la base de données MySQL utilise des champs multilingues :
- `title_fr` / `title_en`
- `description_fr` / `description_en`

Voir **docs/TRANSLATION_SYSTEM.md** pour plus de détails.

## Structure du Projet

```
project/
├── src/
│   ├── components/          # Composants React réutilisables
│   │   ├── admin/          # Composants spécifiques à l'admin
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   ├── pages/              # Pages de l'application
│   │   ├── admin/         # Pages admin
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   └── ...
│   ├── services/          # Services API
│   │   ├── apiClient.ts   # Client Axios configuré
│   │   ├── api.ts         # API publique
│   │   ├── adminApi.ts    # API admin
│   │   └── auth.ts        # Authentification
│   ├── i18n/              # Internationalisation
│   │   ├── config.ts
│   │   └── locales/
│   ├── types/             # Types TypeScript
│   ├── utils/             # Fonctions utilitaires
│   └── config/            # Configuration (endpoints API)
├── laravel_migrations/    # Migrations MySQL pour Laravel
├── docs/                  # Documentation
├── public/                # Assets statiques
└── ...
```

## Scripts disponibles

```bash
# Développement
npm run dev              # Démarrer le serveur de développement

# Build
npm run build            # Build pour la production
npm run preview          # Prévisualiser le build

# Qualité du code
npm run lint             # Linter ESLint
npm run typecheck        # Vérifier les types TypeScript
```

## API Backend

Tous les endpoints sont documentés dans **BACKEND_SETUP.md**.

### API Publique (sans authentification)
- GET `/api/services` - Liste des services
- GET `/api/actualites` - Liste des actualités
- GET `/api/partners` - Liste des partenaires
- GET `/api/infrastructures` - Liste des infrastructures
- POST `/api/contact` - Envoyer un message
- POST `/api/newsletter/subscribe` - S'abonner
- POST `/api/visit-requests` - Demander une visite
- POST `/api/quotes` - Demander un devis

### API Admin (avec authentification Bearer)
- POST `/api/admin/login` - Connexion
- GET `/api/admin/me` - Profil utilisateur
- GET `/api/admin/dashboard` - Statistiques
- Endpoints CRUD pour toutes les entités

## Base de Données

Le projet utilise **MySQL 8.0+** avec **12 tables principales** :

1. services
2. actualites
3. partners
4. infrastructures
5. contact_messages
6. newsletter_subscribers
7. visit_requests
8. announcements
9. job_offers
10. job_applications
11. quotes
12. admin_users

Voir **laravel_migrations/README.md** pour la documentation complète du schéma.

## Sécurité

- Authentification via **Laravel Sanctum** (tokens Bearer)
- Validation stricte des données
- Rate limiting (60 req/min publique, 120 req/min admin)
- CORS configuré pour le frontend
- Hashage bcrypt des mots de passe
- Protection contre les injections SQL (Eloquent ORM)

## Documentation

- **BACKEND_SETUP.md** - Installation et configuration du backend Laravel
- **CONFIGURATION_MYSQL_LARAVEL.md** - Vue d'ensemble de l'architecture
- **LARAVEL_BACKEND_GUIDE.md** - Guide de développement Laravel
- **docs/TRANSLATION_SYSTEM.md** - Système de traduction
- **laravel_migrations/README.md** - Documentation des migrations
- **src/i18n/README.md** - Utilisation de i18next

## Déploiement

### Frontend
```bash
npm run build
# Déployer le dossier dist/ sur votre hébergeur
```

### Backend
```bash
# Configuration production dans .env
APP_ENV=production
APP_DEBUG=false

# Optimisation Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Déployer sur votre serveur
```

## Support

Pour toute question ou problème, consultez d'abord la documentation dans le dossier `docs/`.

## Licence

Propriété de KAMLOG - Tous droits réservés.
