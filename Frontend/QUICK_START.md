# 🚀 Guide de Démarrage Rapide - KAMLOG

## Configuration en 5 minutes

### Prérequis
- ✅ Node.js 18+
- ✅ PHP 8.1+
- ✅ Composer
- ✅ MySQL 8.0+

---

## Étape 1️⃣ : Frontend (React)

```bash
# Installer les dépendances
npm install

# Vérifier le fichier .env
cat .env
# VITE_API_BASE_URL=http://localhost:8000/api

# Démarrer le serveur de développement
npm run dev
```

✅ **Frontend démarré sur http://localhost:5173**

---

## Étape 2️⃣ : Backend (Laravel)

### A. Créer le projet Laravel

```bash
# Dans un dossier séparé
composer create-project laravel/laravel kamlog-backend
cd kamlog-backend
```

### B. Créer la base de données MySQL

```bash
mysql -u root -p
```

```sql
CREATE DATABASE kamlog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### C. Configurer Laravel

Éditez le fichier `.env` :

```env
APP_NAME=KAMLOG
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kamlog
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
SESSION_DRIVER=database
```

### D. Installer Sanctum

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### E. Copier les migrations

```bash
# Depuis le projet frontend vers le backend Laravel
cp ../kamlog-frontend/laravel_migrations/*.php database/migrations/
```

### F. Configurer CORS

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

### G. Exécuter les migrations

```bash
php artisan migrate
```

### H. Créer un utilisateur admin

```bash
php artisan tinker
```

Dans Tinker, tapez :

```php
$admin = new App\Models\AdminUser();
$admin->name = 'Super Admin';
$admin->email = 'admin@kamlog.cm';
$admin->password = bcrypt('Admin123!');
$admin->role = 'super_admin';
$admin->is_active = true;
$admin->save();
exit
```

### I. Démarrer le serveur Laravel

```bash
php artisan serve
```

✅ **Backend démarré sur http://localhost:8000**

---

## Étape 3️⃣ : Tester la connexion

### Test 1 : API publique

```bash
curl http://localhost:8000/api/services
```

**Résultat attendu :** `{"data": []}`

### Test 2 : Login admin

```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kamlog.cm",
    "password": "Admin123!"
  }'
```

**Résultat attendu :** `{"token": "...", "user": {...}}`

### Test 3 : Frontend

Ouvrez votre navigateur sur `http://localhost:5173`

- Page d'accueil : ✅ Devrait s'afficher
- Menu admin : ✅ Cliquez sur "Admin" dans le menu
- Connexion : ✅ Utilisez `admin@kamlog.cm` / `Admin123!`

---

## Étape 4️⃣ : Implémenter les API Controllers

### A. Créer le modèle AdminUser

Créez `app/Models/AdminUser.php` :

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class AdminUser extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
    ];
}
```

### B. Créer le AuthController

Créez `app/Http/Controllers/Api/Admin/AuthController.php` :

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
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Ce compte est désactivé.'],
            ]);
        }

        $user->last_login_at = now();
        $user->save();

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    }
}
```

### C. Définir les routes API

Éditez `routes/api.php` :

```php
<?php

use App\Http\Controllers\Api\Admin\AuthController;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// Routes admin protégées
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Ajoutez ici vos routes CRUD pour services, actualités, etc.
});
```

### D. Redémarrer le serveur

```bash
# Ctrl+C pour arrêter
php artisan serve
```

---

## Résumé des URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | - |
| **Backend API** | http://localhost:8000/api | - |
| **Admin Login** | http://localhost:5173/admin/login | admin@kamlog.cm / Admin123! |
| **MySQL** | localhost:3306 | root / (votre mot de passe) |

---

## Commandes utiles

### Frontend
```bash
npm run dev          # Démarrer
npm run build        # Build production
npm run lint         # Linter
```

### Backend
```bash
php artisan serve              # Démarrer
php artisan route:list         # Voir les routes
php artisan migrate:refresh    # Rafraîchir la DB
php artisan cache:clear        # Vider le cache
```

### MySQL
```bash
mysql -u root -p kamlog        # Se connecter à la DB
```

---

## Prochaines étapes

1. ✅ Implémenter les controllers pour :
   - Services
   - Actualités
   - Partenaires
   - Infrastructures
   - Messages
   - etc.

2. ✅ Ajouter la validation avec FormRequest

3. ✅ Implémenter l'upload de fichiers

4. ✅ Configurer les emails (contact, newsletter)

5. ✅ Tests et déploiement

---

## Besoin d'aide ?

Consultez la documentation complète :

- **BACKEND_SETUP.md** - Guide détaillé Laravel
- **CONFIGURATION_MYSQL_LARAVEL.md** - Architecture
- **VERIFICATION_MYSQL.md** - Vérifications techniques
- **MIGRATION_COMPLETE.md** - Résumé de la migration

---

🎉 **Félicitations ! Votre projet KAMLOG est maintenant configuré et prêt à l'emploi !**
