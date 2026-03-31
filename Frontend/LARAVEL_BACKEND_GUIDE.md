# Guide Backend Laravel pour KAMLOG

## Architecture du Projet

Ce projet utilise :
- **Frontend** : React + TypeScript + Vite + Tailwind CSS
- **Backend** : Laravel (PHP) + MySQL
- **Communication** : API REST avec Axios

---

## Configuration Laravel Requise

### 1. Prérequis

```bash
# PHP >= 8.1
# Composer
# MySQL >= 8.0
# Laravel >= 10.x
```

### 2. Installation Laravel

```bash
composer create-project laravel/laravel kamlog-backend
cd kamlog-backend
```

### 3. Configuration de la Base de Données

**Fichier `.env` Laravel :**

```env
APP_NAME=KAMLOG
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kamlog
DB_USERNAME=root
DB_PASSWORD=

# CORS Configuration
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
SESSION_DOMAIN=localhost
```

### 4. Installation des Packages Nécessaires

```bash
# Sanctum pour l'authentification API
composer require laravel/sanctum

# Publication de la configuration Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Exécuter les migrations
php artisan migrate
```

---

## Configuration CORS

**Fichier `config/cors.php` :**

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

---

## Schéma de Base de Données MySQL

Créez un fichier de migration :

```bash
php artisan make:migration create_kamlog_tables
```

**Contenu de la migration :**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Table: services
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('nom_fr');
            $table->string('nom_en');
            $table->text('description_fr');
            $table->text('description_en');
            $table->string('icon')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Table: actualites
        Schema::create('actualites', function (Blueprint $table) {
            $table->id();
            $table->string('titre_fr');
            $table->string('titre_en');
            $table->text('contenu_fr');
            $table->text('contenu_en');
            $table->enum('type', ['article', 'annonce', 'offre']);
            $table->string('image')->nullable();
            $table->date('date_publication');
            $table->timestamps();
        });

        // Table: partners (partenaires)
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name_fr');
            $table->string('name_en');
            $table->string('logo_url')->nullable();
            $table->text('description_fr')->nullable();
            $table->text('description_en')->nullable();
            $table->string('category')->nullable();
            $table->string('website')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Table: infrastructures
        Schema::create('infrastructures', function (Blueprint $table) {
            $table->id();
            $table->string('nom_fr');
            $table->string('nom_en');
            $table->text('description_fr');
            $table->text('description_en');
            $table->string('surface')->nullable();
            $table->string('capacite')->nullable();
            $table->string('image')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Table: contact_messages (messages du formulaire de contact)
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('email');
            $table->string('telephone')->nullable();
            $table->string('sujet');
            $table->text('message');
            $table->boolean('lu')->default(false);
            $table->timestamps();
        });

        // Table: newsletter_subscribers (abonnés newsletter)
        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->timestamps();
        });

        // Table: visit_requests (demandes de visite)
        Schema::create('visit_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('company')->nullable();
            $table->date('date');
            $table->text('message')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $table->timestamps();
        });

        // Table: announcements (annonces)
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title_fr');
            $table->string('title_en');
            $table->text('content_fr');
            $table->text('content_en');
            $table->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal');
            $table->boolean('is_active')->default(true);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->timestamps();
        });

        // Table: job_offers (offres d'emploi)
        Schema::create('job_offers', function (Blueprint $table) {
            $table->id();
            $table->string('title_fr');
            $table->string('title_en');
            $table->text('description_fr');
            $table->text('description_en');
            $table->text('requirements_fr');
            $table->text('requirements_en');
            $table->enum('contract_type', ['CDI', 'CDD', 'Stage', 'Freelance']);
            $table->string('location');
            $table->string('experience_level');
            $table->string('salary_range')->nullable();
            $table->date('application_deadline');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Table: admin_users (administrateurs)
        Schema::create('admin_users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_offers');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('visit_requests');
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('infrastructures');
        Schema::dropIfExists('partners');
        Schema::dropIfExists('actualites');
        Schema::dropIfExists('services');
        Schema::dropIfExists('admin_users');
    }
};
```

**Exécuter les migrations :**

```bash
php artisan migrate
```

---

## Modèles Eloquent

Créez les modèles :

```bash
php artisan make:model Service
php artisan make:model Actualite
php artisan make:model Partner
php artisan make:model Infrastructure
php artisan make:model ContactMessage
php artisan make:model NewsletterSubscriber
php artisan make:model VisitRequest
php artisan make:model Announcement
php artisan make:model JobOffer
php artisan make:model AdminUser
```

**Exemple de modèle `app/Models/Service.php` :**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_fr',
        'nom_en',
        'description_fr',
        'description_en',
        'icon',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];
}
```

---

## Contrôleurs

### Contrôleur Public : `app/Http/Controllers/Api/ServiceController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::where('is_active', true)
            ->orderBy('display_order')
            ->get();

        return response()->json($services);
    }
}
```

### Contrôleur Admin : `app/Http/Controllers/Api/Admin/ActualiteController.php`

```php
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Actualite;
use Illuminate\Http\Request;

class ActualiteController extends Controller
{
    public function index()
    {
        return Actualite::orderBy('date_publication', 'desc')->get();
    }

    public function show(Actualite $actualite)
    {
        return $actualite;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre_fr' => 'required|string|max:255',
            'titre_en' => 'required|string|max:255',
            'contenu_fr' => 'required|string',
            'contenu_en' => 'required|string',
            'type' => 'required|in:article,annonce,offre',
            'image' => 'nullable|string',
            'date_publication' => 'required|date',
        ]);

        $actualite = Actualite::create($validated);

        return response()->json($actualite, 201);
    }

    public function update(Request $request, Actualite $actualite)
    {
        $validated = $request->validate([
            'titre_fr' => 'string|max:255',
            'titre_en' => 'string|max:255',
            'contenu_fr' => 'string',
            'contenu_en' => 'string',
            'type' => 'in:article,annonce,offre',
            'image' => 'nullable|string',
            'date_publication' => 'date',
        ]);

        $actualite->update($validated);

        return response()->json($actualite);
    }

    public function destroy(Actualite $actualite)
    {
        $actualite->delete();

        return response()->json(null, 204);
    }

    public function stats()
    {
        return response()->json([
            'totalActualites' => Actualite::where('type', 'article')->count(),
            'totalOffres' => Actualite::where('type', 'offre')->count(),
            'totalPartenaires' => \App\Models\Partner::count(),
            'totalMessages' => \App\Models\ContactMessage::count(),
            'totalNewsletter' => \App\Models\NewsletterSubscriber::count(),
            'totalAnnouncements' => \App\Models\Announcement::count(),
            'totalJobOffers' => \App\Models\JobOffer::count(),
        ]);
    }
}
```

### Contrôleur Auth : `app/Http/Controllers/Api/Admin/AuthController.php`

```php
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = AdminUser::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les informations d\'identification fournies sont incorrectes.'],
            ]);
        }

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    public function me(Request $request)
    {
        return response()->json([
            'id' => $request->user()->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
        ]);
    }
}
```

---

## Routes API

**Fichier `routes/api.php` :**

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ActualiteController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\InfrastructureController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\VisitRequestController;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\ActualiteController as AdminActualiteController;
use App\Http\Controllers\Api\Admin\MessageController;
use App\Http\Controllers\Api\Admin\NewsletterController as AdminNewsletterController;
use App\Http\Controllers\Api\Admin\AnnouncementController;
use App\Http\Controllers\Api\Admin\JobOfferController;
use App\Http\Controllers\Api\Admin\VisitRequestController as AdminVisitRequestController;

// Routes publiques
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/actualites', [ActualiteController::class, 'index']);
Route::get('/actualites/{id}', [ActualiteController::class, 'show']);
Route::get('/partners', [PartnerController::class, 'index']);
Route::get('/infrastructures', [InfrastructureController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);
Route::post('/newsletter', [NewsletterController::class, 'subscribe']);
Route::post('/visit-requests', [VisitRequestController::class, 'store']);

// Routes d'authentification admin
Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    // Routes protégées par Sanctum
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        // Statistiques dashboard
        Route::get('/actualites/stats', [AdminActualiteController::class, 'stats']);

        // CRUD Actualités
        Route::apiResource('actualites', AdminActualiteController::class);

        // Messages
        Route::get('/messages', [MessageController::class, 'index']);
        Route::get('/messages/{message}', [MessageController::class, 'show']);
        Route::put('/messages/{message}/read', [MessageController::class, 'markAsRead']);
        Route::delete('/messages/{message}', [MessageController::class, 'destroy']);

        // Newsletter
        Route::get('/newsletter', [AdminNewsletterController::class, 'index']);
        Route::delete('/newsletter/{subscriber}', [AdminNewsletterController::class, 'destroy']);

        // Annonces
        Route::apiResource('announcements', AnnouncementController::class);

        // Offres d'emploi
        Route::apiResource('job-offers', JobOfferController::class);

        // Demandes de visite
        Route::get('/visit-requests', [AdminVisitRequestController::class, 'index']);
        Route::get('/visit-requests/{visitRequest}', [AdminVisitRequestController::class, 'show']);
        Route::put('/visit-requests/{visitRequest}/status', [AdminVisitRequestController::class, 'updateStatus']);
        Route::delete('/visit-requests/{visitRequest}', [AdminVisitRequestController::class, 'destroy']);
    });
});
```

---

## Middleware Sanctum

**Fichier `app/Http/Kernel.php` :**

Assurez-vous que le middleware Sanctum est activé :

```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

---

## Créer un Administrateur

```bash
php artisan tinker
```

```php
$admin = new App\Models\AdminUser();
$admin->name = 'Admin KAMLOG';
$admin->email = 'admin@kamlog.com';
$admin->password = Hash::make('password123');
$admin->save();
```

---

## Démarrage du Serveur

```bash
# Backend Laravel
php artisan serve
# Serveur : http://localhost:8000

# Frontend React (dans un autre terminal)
npm run dev
# Serveur : http://localhost:5173
```

---

## Tests API

Utilisez Postman ou cURL pour tester :

```bash
# Test public
curl http://localhost:8000/api/services

# Login admin
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kamlog.com","password":"password123"}'

# Obtenir les actualités (authentifié)
curl http://localhost:8000/api/admin/actualites \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Points Importants

1. **Sanctum** : Utilisé pour l'authentification API avec tokens
2. **CORS** : Configuré pour accepter les requêtes depuis `localhost:5173`
3. **Validation** : Toutes les requêtes sont validées
4. **API REST** : Respect des conventions RESTful
5. **Sécurité** : Routes admin protégées par middleware `auth:sanctum`

---

## Structure des Réponses API

### Succès
```json
{
  "id": 1,
  "nom_fr": "Service Name",
  "created_at": "2026-03-10T12:00:00.000000Z"
}
```

### Erreur
```json
{
  "message": "Unauthenticated.",
  "errors": {
    "email": ["Le champ email est obligatoire."]
  }
}
```

---

## Notes Finales

- Le frontend React est **déjà prêt** et configuré
- Il suffit de créer le backend Laravel avec ce guide
- Toutes les routes API correspondent aux endpoints utilisés par le frontend
- L'authentification utilise des tokens Bearer (Laravel Sanctum)
