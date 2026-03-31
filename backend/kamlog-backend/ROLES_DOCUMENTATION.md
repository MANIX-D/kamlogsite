# Documentation Système de Rôles - KAMLOG Backend

## 🎯 Vue d'Ensemble

Le backend KAMLOG implémente un système de gestion des rôles avec 3 niveaux d'accès :

1. **super_admin** - Accès complet (gestion utilisateurs, métriques)
2. **admin** - Gestion du contenu (CRUD complet)
3. **editor** - Lecture seule (consultation uniquement)

---

## 📋 Structure des Rôles

### **Super Admin**
**Rôle** : `super_admin`  
**Permissions** :
- ✅ Toutes les permissions admin
- ✅ Gestion des utilisateurs admin
- ✅ Accès aux métriques d'authentification
- ✅ Configuration système

**Utilisateur par défaut** :
```
Email: superadmin@kamlog.cm
Mot de passe: SuperAdmin123!
```

### **Admin**
**Rôle** : `admin`  
**Permissions** :
- ✅ CRUD complet sur tous les contenus
- ✅ Gestion des services
- ✅ Gestion des actualités
- ✅ Gestion des partenaires
- ✅ Gestion des infrastructures
- ✅ Gestion des offres d'emploi
- ✅ Gestion des annonces
- ✅ Gestion des messages de contact
- ✅ Gestion des demandes de visite
- ✅ Gestion des demandes de devis
- ✅ Upload/suppression de fichiers
- ✅ Monitoring du stockage

**Utilisateur par défaut** :
```
Email: admin@kamlog.cm
Mot de passe: Admin123!
```

### **Editor**
**Rôle** : `editor`  
**Permissions** :
- ✅ Lecture seule sur tous les contenus
- ✅ Consultation des services
- ✅ Consultation des actualités
- ✅ Consultation des partenaires
- ✅ Consultation des infrastructures
- ✅ Consultation des offres d'emploi
- ✅ Consultation des annonces
- ❌ Pas de création/modification/suppression

**Utilisateur par défaut** :
```
Email: editor@kamlog.cm
Mot de passe: Editor123!
```

---

## 🔧 Implémentation Technique

### **1. Migration**

**Fichier** : `database/migrations/2026_03_25_210319_add_role_to_users_table.php`

```php
Schema::table('users', function (Blueprint $table) {
    $table->enum('role', ['super_admin', 'admin', 'editor'])->default('editor');
    $table->boolean('is_active')->default(true);
    $table->index('role');
    $table->index('is_active');
});
```

### **2. Modèle User**

**Fichier** : `app/Models/User.php`

**Attributs** :
```php
protected $fillable = [
    'name',
    'email',
    'password',
    'role',
    'is_active',
];

protected $casts = [
    'is_active' => 'boolean',
];
```

**Méthodes de vérification** :
```php
// Vérifier si super admin
$user->isSuperAdmin(); // bool

// Vérifier si admin (super_admin ou admin)
$user->isAdmin(); // bool

// Vérifier si éditeur
$user->isEditor(); // bool

// Vérifier un rôle spécifique
$user->hasRole('admin'); // bool

// Vérifier plusieurs rôles
$user->hasAnyRole(['admin', 'super_admin']); // bool
```

**Scopes** :
```php
// Filtrer par rôle
User::ofRole('admin')->get();

// Utilisateurs actifs
User::active()->get();
```

### **3. Middlewares**

#### **CheckRole** (Flexible)
**Fichier** : `app/Http/Middleware/CheckRole.php`  
**Alias** : `role`

Vérifie que l'utilisateur a l'un des rôles spécifiés.

**Usage** :
```php
// Un seul rôle
Route::middleware(['role:super_admin'])->group(function () {
    // Routes super admin uniquement
});

// Plusieurs rôles
Route::middleware(['role:super_admin,admin'])->group(function () {
    // Routes super admin et admin
});
```

#### **CheckSuperAdmin**
**Fichier** : `app/Http/Middleware/CheckSuperAdmin.php`  
**Alias** : `role.super_admin`

Vérifie que l'utilisateur est super_admin.

**Usage** :
```php
Route::middleware(['role.super_admin'])->group(function () {
    // Routes super admin uniquement
});
```

#### **CheckAdmin**
**Fichier** : `app/Http/Middleware/CheckAdmin.php`  
**Alias** : `role.admin`

Vérifie que l'utilisateur est admin ou super_admin.

**Usage** :
```php
Route::middleware(['role.admin'])->group(function () {
    // Routes admin et super admin
});
```

#### **CheckEditor**
**Fichier** : `app/Http/Middleware/CheckEditor.php`  
**Alias** : `role.editor`

Vérifie que l'utilisateur a au moins le rôle editor.

**Usage** :
```php
Route::middleware(['role.editor'])->group(function () {
    // Routes pour tous les utilisateurs authentifiés
});
```

### **4. Enregistrement des Middlewares**

**Fichier** : `bootstrap/app.php`

```php
$middleware->alias([
    'role' => \App\Http\Middleware\CheckRole::class,
    'role.super_admin' => \App\Http\Middleware\CheckSuperAdmin::class,
    'role.admin' => \App\Http\Middleware\CheckAdmin::class,
    'role.editor' => \App\Http\Middleware\CheckEditor::class,
]);
```

---

## 🛣️ Protection des Routes

### **Routes Publiques**
Aucune authentification requise.

```php
GET /api/v1/services
GET /api/v1/news
GET /api/v1/partners
POST /api/v1/contact
POST /api/v1/newsletter/subscribe
```

### **Routes Super Admin**
Middleware : `role:super_admin`

```php
GET /api/v1/admin/metrics/auth/today
GET /api/v1/admin/metrics/auth/period
```

### **Routes Admin & Super Admin**
Middleware : `role:super_admin,admin`

```php
// Services
POST   /api/v1/admin/services
PUT    /api/v1/admin/services/{id}
DELETE /api/v1/admin/services/{id}

// News
POST   /api/v1/admin/news
PUT    /api/v1/admin/news/{id}
DELETE /api/v1/admin/news/{id}

// Partners
POST   /api/v1/admin/partners
PUT    /api/v1/admin/partners/{id}
DELETE /api/v1/admin/partners/{id}

// Infrastructures
POST   /api/v1/admin/infrastructures
PUT    /api/v1/admin/infrastructures/{id}
DELETE /api/v1/admin/infrastructures/{id}

// Jobs
POST   /api/v1/admin/jobs
PUT    /api/v1/admin/jobs/{id}
DELETE /api/v1/admin/jobs/{id}

// Announcements
POST   /api/v1/admin/announcements
PUT    /api/v1/admin/announcements/{id}
DELETE /api/v1/admin/announcements/{id}

// Contact Messages
GET    /api/v1/admin/contact-messages
PUT    /api/v1/admin/contact-messages/{id}
DELETE /api/v1/admin/contact-messages/{id}

// Visit Requests
GET    /api/v1/admin/visit-requests
PUT    /api/v1/admin/visit-requests/{id}
DELETE /api/v1/admin/visit-requests/{id}

// Quote Requests
GET    /api/v1/admin/quote-requests
PUT    /api/v1/admin/quote-requests/{id}
DELETE /api/v1/admin/quote-requests/{id}

// Files
POST   /api/v1/admin/files/images/upload
DELETE /api/v1/admin/files/images
DELETE /api/v1/admin/files/cvs

// Storage
GET    /api/v1/admin/storage/stats
GET    /api/v1/admin/storage/health
```

### **Routes Tous Admins (Editor, Admin, Super Admin)**
Middleware : `role:super_admin,admin,editor`

```php
// Lecture seule
GET /api/v1/admin/services
GET /api/v1/admin/services/{id}
GET /api/v1/admin/news
GET /api/v1/admin/news/{id}
GET /api/v1/admin/partners
GET /api/v1/admin/partners/{id}
GET /api/v1/admin/infrastructures
GET /api/v1/admin/infrastructures/{id}
GET /api/v1/admin/jobs
GET /api/v1/admin/jobs/{id}
GET /api/v1/admin/announcements
GET /api/v1/admin/announcements/{id}
```

---

## 🧪 Tests

### **1. Créer les Utilisateurs**

```bash
# Exécuter la migration
php artisan migrate

# Exécuter le seeder
php artisan db:seed --class=UserSeeder
```

### **2. Tester l'Authentification**

```bash
# Login Super Admin
curl -X POST http://localhost:8000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@kamlog.cm",
    "password": "SuperAdmin123!"
  }'

# Réponse
{
  "success": true,
  "token": "1|xxxxxxxxxxxxx",
  "user": {
    "id": 1,
    "name": "Super Admin",
    "email": "superadmin@kamlog.cm",
    "role": "super_admin",
    "is_active": true
  }
}
```

### **3. Tester les Permissions**

```bash
# Avec token Super Admin - ✅ Devrait fonctionner
curl -X GET http://localhost:8000/api/v1/admin/metrics/auth/today \
  -H "Authorization: Bearer 1|xxxxxxxxxxxxx"

# Avec token Admin - ❌ Devrait être refusé (403)
curl -X GET http://localhost:8000/api/v1/admin/metrics/auth/today \
  -H "Authorization: Bearer 2|xxxxxxxxxxxxx"

# Avec token Editor - ✅ Devrait fonctionner (lecture seule)
curl -X GET http://localhost:8000/api/v1/admin/services \
  -H "Authorization: Bearer 3|xxxxxxxxxxxxx"

# Avec token Editor - ❌ Devrait être refusé (403)
curl -X POST http://localhost:8000/api/v1/admin/services \
  -H "Authorization: Bearer 3|xxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"title_fr": "Test"}'
```

### **4. Tester Compte Désactivé**

```bash
# Login avec compte désactivé - ❌ Devrait être refusé (403)
curl -X POST http://localhost:8000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin.disabled@kamlog.cm",
    "password": "Admin123!"
  }'
```

---

## 📊 Matrice des Permissions

| Action | Super Admin | Admin | Editor |
|--------|-------------|-------|--------|
| **Métriques** | ✅ | ❌ | ❌ |
| **Gestion Utilisateurs** | ✅ | ❌ | ❌ |
| **Créer Contenu** | ✅ | ✅ | ❌ |
| **Modifier Contenu** | ✅ | ✅ | ❌ |
| **Supprimer Contenu** | ✅ | ✅ | ❌ |
| **Lire Contenu** | ✅ | ✅ | ✅ |
| **Upload Fichiers** | ✅ | ✅ | ❌ |
| **Supprimer Fichiers** | ✅ | ✅ | ❌ |
| **Monitoring Storage** | ✅ | ✅ | ❌ |

---

## 🔒 Sécurité

### **Vérifications Automatiques**

Tous les middlewares vérifient automatiquement :

1. ✅ **Authentification** - L'utilisateur est connecté
2. ✅ **Compte actif** - `is_active = true`
3. ✅ **Rôle valide** - L'utilisateur a le bon rôle

### **Réponses d'Erreur**

```json
// Non authentifié
{
  "success": false,
  "message": "Non authentifié"
}
// Status: 401

// Compte désactivé
{
  "success": false,
  "message": "Compte désactivé"
}
// Status: 403

// Permissions insuffisantes
{
  "success": false,
  "message": "Accès refusé. Permissions insuffisantes."
}
// Status: 403
```

### **Messages en Développement**

En environnement `local`, les messages d'erreur sont plus détaillés :

```json
{
  "success": false,
  "message": "Accès refusé. Rôles requis: super_admin, admin"
}
```

En production, les messages sont génériques pour ne pas exposer la structure des rôles.

---

## 🚀 Utilisation dans les Contrôleurs

### **Vérifier le Rôle Manuellement**

```php
public function someAction(Request $request)
{
    $user = $request->user();
    
    // Vérifier super admin
    if ($user->isSuperAdmin()) {
        // Code pour super admin
    }
    
    // Vérifier admin
    if ($user->isAdmin()) {
        // Code pour admin et super admin
    }
    
    // Vérifier rôle spécifique
    if ($user->hasRole('editor')) {
        // Code pour editor uniquement
    }
    
    // Vérifier plusieurs rôles
    if ($user->hasAnyRole(['admin', 'super_admin'])) {
        // Code pour admin ou super admin
    }
}
```

### **Filtrer les Données par Rôle**

```php
public function index(Request $request)
{
    $user = $request->user();
    
    $query = Service::query();
    
    // Les editors ne voient que les services actifs
    if ($user->isEditor()) {
        $query->where('is_active', true);
    }
    
    // Les admins voient tout
    return $query->paginate(15);
}
```

---

## 📝 Commandes Utiles

```bash
# Créer un nouvel utilisateur
php artisan tinker
>>> User::create([
    'name' => 'Nouvel Admin',
    'email' => 'newadmin@kamlog.cm',
    'password' => bcrypt('Password123!'),
    'role' => 'admin',
    'is_active' => true,
]);

# Changer le rôle d'un utilisateur
>>> $user = User::where('email', 'user@kamlog.cm')->first();
>>> $user->update(['role' => 'admin']);

# Désactiver un utilisateur
>>> $user = User::find(1);
>>> $user->update(['is_active' => false]);

# Lister tous les admins
>>> User::ofRole('admin')->get();

# Lister tous les utilisateurs actifs
>>> User::active()->get();
```

---

## ✅ Checklist Implémentation

- [x] Migration ajoutée (role, is_active)
- [x] Modèle User mis à jour (fillable, casts, méthodes)
- [x] 4 middlewares créés (CheckRole, CheckSuperAdmin, CheckAdmin, CheckEditor)
- [x] Middlewares enregistrés dans bootstrap/app.php
- [x] Routes protégées par rôles
- [x] UserSeeder avec 4 utilisateurs de test
- [x] Documentation complète

---

## 🎯 Résumé

**Système de rôles complet et sécurisé** avec :

✅ 3 niveaux d'accès (super_admin, admin, editor)  
✅ 4 middlewares flexibles  
✅ Protection automatique des routes  
✅ Vérification compte actif  
✅ Messages d'erreur sécurisés  
✅ Utilisateurs de test  
✅ Documentation complète  

**Le système de rôles KAMLOG est prêt pour la production !** 🚀
