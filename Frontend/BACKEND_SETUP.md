# Configuration Backend Laravel + MySQL pour KAMLOG

## Prérequis

- PHP 8.1 ou supérieur
- Composer
- MySQL 8.0 ou supérieur
- Laravel 10+

## Installation du Backend Laravel

### 1. Créer le projet Laravel

```bash
composer create-project laravel/laravel kamlog-backend
cd kamlog-backend
```

### 2. Configuration de la base de données MySQL

Éditez le fichier `.env` à la racine du projet Laravel :

```env
APP_NAME=KAMLOG
APP_ENV=local
APP_KEY=base64:VOTRE_CLE_GENEREE
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kamlog
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
SESSION_DRIVER=database
SESSION_LIFETIME=120

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 3. Créer la base de données MySQL

```sql
CREATE DATABASE kamlog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Installer Laravel Sanctum

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 5. Configuration CORS

Éditez `config/cors.php` :

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### 6. Copier les migrations

Copiez tous les fichiers du dossier `laravel_migrations/` dans `database/migrations/` de votre projet Laravel.

### 7. Exécuter les migrations

```bash
php artisan migrate
```

### 8. Créer un utilisateur administrateur

```bash
php artisan tinker
```

Puis dans le shell Tinker :

```php
$admin = new App\Models\AdminUser();
$admin->name = 'Super Admin';
$admin->email = 'admin@kamlog.cm';
$admin->password = bcrypt('Admin123!');
$admin->role = 'super_admin';
$admin->is_active = true;
$admin->save();
```

## Structure des API Endpoints

### API Publique (Sans authentification)

#### Services
- `GET /api/services` - Liste tous les services actifs
- `GET /api/services/{id}` - Détails d'un service

#### Actualités
- `GET /api/actualites` - Liste des actualités publiées (avec pagination)
- `GET /api/actualites/{id}` - Détails d'une actualité

#### Partenaires
- `GET /api/partners` - Liste des partenaires actifs

#### Infrastructures
- `GET /api/infrastructures` - Liste des infrastructures actives
- `GET /api/infrastructures/{id}` - Détails d'une infrastructure

#### Contact
- `POST /api/contact` - Envoyer un message de contact

#### Newsletter
- `POST /api/newsletter/subscribe` - S'abonner à la newsletter
- `POST /api/newsletter/unsubscribe` - Se désabonner

#### Demandes de visite
- `POST /api/visit-requests` - Créer une demande de visite

#### Devis
- `POST /api/quotes` - Demander un devis

### API Admin (Avec authentification Sanctum)

#### Authentification
- `POST /api/admin/login` - Connexion admin
- `POST /api/admin/logout` - Déconnexion
- `GET /api/admin/me` - Profil utilisateur

#### Dashboard
- `GET /api/admin/dashboard` - Statistiques générales

#### Services (CRUD complet)
- `GET /api/admin/services` - Liste
- `GET /api/admin/services/{id}` - Détails
- `POST /api/admin/services` - Créer
- `PUT /api/admin/services/{id}` - Modifier
- `DELETE /api/admin/services/{id}` - Supprimer

#### Actualités (CRUD complet)
- `GET /api/admin/actualites` - Liste
- `GET /api/admin/actualites/{id}` - Détails
- `POST /api/admin/actualites` - Créer
- `PUT /api/admin/actualites/{id}` - Modifier
- `DELETE /api/admin/actualites/{id}` - Supprimer
- `POST /api/admin/actualites/{id}/publish` - Publier
- `POST /api/admin/actualites/{id}/unpublish` - Dépublier

#### Partenaires (CRUD complet)
- `GET /api/admin/partners` - Liste
- `GET /api/admin/partners/{id}` - Détails
- `POST /api/admin/partners` - Créer
- `PUT /api/admin/partners/{id}` - Modifier
- `DELETE /api/admin/partners/{id}` - Supprimer

#### Infrastructures (CRUD complet)
- `GET /api/admin/infrastructures` - Liste
- `GET /api/admin/infrastructures/{id}` - Détails
- `POST /api/admin/infrastructures` - Créer
- `PUT /api/admin/infrastructures/{id}` - Modifier
- `DELETE /api/admin/infrastructures/{id}` - Supprimer

#### Messages Contact
- `GET /api/admin/messages` - Liste
- `GET /api/admin/messages/{id}` - Détails
- `PUT /api/admin/messages/{id}/read` - Marquer comme lu
- `DELETE /api/admin/messages/{id}` - Supprimer

#### Newsletter
- `GET /api/admin/newsletter` - Liste des abonnés
- `DELETE /api/admin/newsletter/{id}` - Supprimer un abonné

#### Annonces (CRUD complet)
- `GET /api/admin/announcements` - Liste
- `GET /api/admin/announcements/{id}` - Détails
- `POST /api/admin/announcements` - Créer
- `PUT /api/admin/announcements/{id}` - Modifier
- `DELETE /api/admin/announcements/{id}` - Supprimer

#### Offres d'emploi (CRUD complet)
- `GET /api/admin/job-offers` - Liste
- `GET /api/admin/job-offers/{id}` - Détails
- `POST /api/admin/job-offers` - Créer
- `PUT /api/admin/job-offers/{id}` - Modifier
- `DELETE /api/admin/job-offers/{id}` - Supprimer
- `GET /api/admin/job-offers/{id}/applications` - Liste des candidatures

#### Demandes de visite
- `GET /api/admin/visit-requests` - Liste
- `GET /api/admin/visit-requests/{id}` - Détails
- `PUT /api/admin/visit-requests/{id}/status` - Changer le statut
- `DELETE /api/admin/visit-requests/{id}` - Supprimer

#### Devis
- `GET /api/admin/quotes` - Liste
- `GET /api/admin/quotes/{id}` - Détails
- `PUT /api/admin/quotes/{id}/status` - Changer le statut
- `DELETE /api/admin/quotes/{id}` - Supprimer

## Format des réponses API

### Succès
```json
{
  "success": true,
  "data": { ... },
  "message": "Message de succès"
}
```

### Erreur
```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": { ... }
}
```

### Liste paginée
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75
  }
}
```

## Démarrage du serveur

```bash
# Démarrer le serveur Laravel
php artisan serve

# Le serveur démarre sur http://localhost:8000
# Les API sont accessibles sur http://localhost:8000/api
```

## Commandes utiles

```bash
# Rafraîchir la base de données
php artisan migrate:refresh

# Rafraîchir avec seeders
php artisan migrate:refresh --seed

# Vider le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Voir toutes les routes
php artisan route:list

# Créer un nouveau contrôleur
php artisan make:controller Api/NomController --api

# Créer un modèle avec migration
php artisan make:model NomModel -m

# Créer une validation FormRequest
php artisan make:request NomRequest
```

## Tests avec cURL

### Connexion Admin
```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kamlog.cm",
    "password": "Admin123!"
  }'
```

### Récupérer les services (public)
```bash
curl -X GET http://localhost:8000/api/services \
  -H "Accept: application/json"
```

### Créer un service (admin - avec token)
```bash
curl -X POST http://localhost:8000/api/admin/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "title_fr": "Nouveau service",
    "title_en": "New service",
    "description_fr": "Description en français",
    "description_en": "Description in English",
    "icon": "package",
    "is_active": true
  }'
```

## Configuration Frontend

Le frontend React est déjà configuré pour se connecter au backend Laravel via :

- **Base URL**: `http://localhost:8000/api` (défini dans `.env`)
- **Authentification**: Bearer token (Sanctum)
- **Headers**: `Accept-Language` pour l'internationalisation
- **CORS**: Configuré pour accepter les requêtes depuis `localhost:5173`

## Sécurité

- Authentification via **Laravel Sanctum** (tokens)
- Rate limiting (60 req/min pour API publique, 120 pour admin)
- Validation stricte des données avec **FormRequest**
- Protection CSRF désactivée pour les routes API
- Hashage bcrypt des mots de passe
- Permissions basées sur les rôles (super_admin, admin, editor)

## Notes importantes

1. **Upload de fichiers** : Configurez le storage Laravel pour gérer les uploads d'images et CVs
2. **Emails** : Configurez SMTP pour les notifications (newsletter, contact, etc.)
3. **Queue** : Pour les tâches longues, configurez Laravel Queue
4. **Production** : Utilisez `.env.production` avec `APP_DEBUG=false`
