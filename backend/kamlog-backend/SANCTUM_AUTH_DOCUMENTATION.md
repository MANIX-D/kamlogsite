# Documentation Authentification Sanctum - KAMLOG

## 🔐 Configuration Complète

### **1. Configuration Auth**

**Fichier**: `config/auth.php`

```php
'guards' => [
    'admin' => [
        'driver' => 'sanctum',
        'provider' => 'admin_users',
    ],
],

'providers' => [
    'admin_users' => [
        'driver' => 'eloquent',
        'model' => AdminUser::class,
    ],
],
```

### **2. Configuration Sanctum**

**Fichier**: `config/sanctum.php`

- **Domaines autorisés**: `localhost:5173`, `localhost:3000`, `127.0.0.1:8000`
- **Expiration tokens**: 1440 minutes (24 heures)
- **Guard**: `admin`

---

## 🚀 Endpoints API

### **Base URL**: `/api/v1/admin/auth`

### **1. Login**

**POST** `/api/v1/admin/auth/login`

**Request Body**:
```json
{
  "email": "admin@kamlog.com",
  "password": "password123"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "admin": {
      "id": 1,
      "name": "Super Admin",
      "email": "admin@kamlog.com",
      "role": "super_admin",
      "avatar": null,
      "phone": "+237 000 000 000"
    },
    "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "abilities": [
      "admin:*",
      "users:*",
      "content:*",
      "settings:*"
    ]
  }
}
```

**Response Error (422)**:
```json
{
  "message": "Les identifiants fournis sont incorrects.",
  "errors": {
    "email": ["Les identifiants fournis sont incorrects."]
  }
}
```

---

### **2. Logout**

**POST** `/api/v1/admin/auth/logout`

**Headers**:
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

### **3. Logout All (Révoquer tous les tokens)**

**POST** `/api/v1/admin/auth/logout-all`

**Headers**:
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Tous les tokens ont été révoqués"
}
```

---

### **4. Me (Informations utilisateur connecté)**

**GET** `/api/v1/admin/auth/me`

**Headers**:
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Super Admin",
    "email": "admin@kamlog.com",
    "role": "super_admin",
    "avatar": null,
    "phone": "+237 000 000 000",
    "is_active": true,
    "last_login_at": "2026-03-25T10:30:00.000000Z",
    "created_at": "2026-03-20T08:00:00.000000Z"
  }
}
```

---

### **5. Refresh Token**

**POST** `/api/v1/admin/auth/refresh`

**Headers**:
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Token rafraîchi",
  "data": {
    "token": "2|xxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "abilities": [
      "admin:*",
      "users:*",
      "content:*",
      "settings:*"
    ]
  }
}
```

---

## 👥 Gestion des Rôles

### **Hiérarchie des Rôles**

| Rôle | Niveau | Abilities |
|------|--------|-----------|
| **super_admin** | 3 | `admin:*`, `users:*`, `content:*`, `settings:*` |
| **admin** | 2 | `admin:read`, `admin:update`, `users:*`, `content:*` |
| **editor** | 1 | `admin:read`, `content:*` |

### **Abilities Détaillées**

- `admin:*` - Toutes les actions admin
- `admin:read` - Lecture des données admin
- `admin:update` - Mise à jour des données admin
- `users:*` - Gestion complète des utilisateurs
- `content:*` - Gestion complète du contenu
- `settings:*` - Gestion des paramètres système

---

## 🛡️ Middlewares

### **1. CheckAdminRole**

Vérifie le rôle de l'utilisateur.

**Utilisation**:
```php
Route::middleware(['auth:sanctum', 'admin.role:super_admin,admin'])->group(function () {
    // Routes accessibles aux super_admin et admin
});
```

**Réponse si accès refusé (403)**:
```json
{
  "success": false,
  "message": "Accès refusé. Rôle insuffisant.",
  "required_roles": ["super_admin"],
  "user_role": "editor"
}
```

### **2. CheckAdminAbility**

Vérifie les permissions (abilities) du token.

**Utilisation**:
```php
Route::middleware(['auth:sanctum', 'admin.ability:users:*'])->group(function () {
    // Routes nécessitant la permission users:*
});
```

**Réponse si accès refusé (403)**:
```json
{
  "success": false,
  "message": "Accès refusé. Permission insuffisante.",
  "required_ability": "users:*"
}
```

---

## 📋 Structure des Routes

### **Routes Publiques**
```php
POST /api/v1/admin/auth/login
```

### **Routes Authentifiées (tous les admins)**
```php
POST /api/v1/admin/auth/logout
POST /api/v1/admin/auth/logout-all
GET  /api/v1/admin/auth/me
POST /api/v1/admin/auth/refresh
```

### **Routes Super Admin uniquement**
```php
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'admin.role:super_admin'])
    ->group(function () {
        // Gestion des admins
        // Paramètres système
    });
```

### **Routes Admin et Super Admin**
```php
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'admin.role:super_admin,admin'])
    ->group(function () {
        // Gestion complète du contenu
    });
```

### **Routes Editor, Admin et Super Admin**
```php
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'admin.role:super_admin,admin,editor'])
    ->group(function () {
        // Édition du contenu
    });
```

---

## 🔧 Utilisation Frontend

### **1. Login**

```javascript
const login = async (email, password) => {
  try {
    const response = await axios.post('/api/v1/admin/auth/login', {
      email,
      password
    });
    
    const { token, admin, abilities } = response.data.data;
    
    // Stocker le token
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(admin));
    localStorage.setItem('admin_abilities', JSON.stringify(abilities));
    
    // Configurer axios pour les requêtes futures
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response.data);
    throw error;
  }
};
```

### **2. Logout**

```javascript
const logout = async () => {
  try {
    await axios.post('/api/v1/admin/auth/logout');
    
    // Nettoyer le storage
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_abilities');
    
    // Retirer le header Authorization
    delete axios.defaults.headers.common['Authorization'];
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

### **3. Vérifier l'authentification**

```javascript
const checkAuth = async () => {
  const token = localStorage.getItem('admin_token');
  
  if (!token) {
    return false;
  }
  
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.get('/api/v1/admin/auth/me');
    return response.data.data;
  } catch (error) {
    // Token invalide ou expiré
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_abilities');
    return false;
  }
};
```

### **4. Refresh Token**

```javascript
const refreshToken = async () => {
  try {
    const response = await axios.post('/api/v1/admin/auth/refresh');
    const { token, abilities } = response.data.data;
    
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_abilities', JSON.stringify(abilities));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return token;
  } catch (error) {
    console.error('Refresh token error:', error);
    throw error;
  }
};
```

### **5. Vérifier les Permissions**

```javascript
const hasAbility = (ability) => {
  const abilities = JSON.parse(localStorage.getItem('admin_abilities') || '[]');
  return abilities.includes(ability) || abilities.includes('admin:*');
};

const hasRole = (role) => {
  const admin = JSON.parse(localStorage.getItem('admin_user') || '{}');
  return admin.role === role;
};

// Utilisation
if (hasAbility('users:*')) {
  // Afficher la gestion des utilisateurs
}

if (hasRole('super_admin')) {
  // Afficher les paramètres système
}
```

---

## 🧪 Tests avec Postman/Insomnia

### **1. Login**

```bash
POST http://localhost:8000/api/v1/admin/auth/login
Content-Type: application/json

{
  "email": "admin@kamlog.com",
  "password": "password123"
}
```

### **2. Me (avec token)**

```bash
GET http://localhost:8000/api/v1/admin/auth/me
Authorization: Bearer 1|xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### **3. Logout**

```bash
POST http://localhost:8000/api/v1/admin/auth/logout
Authorization: Bearer 1|xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🗄️ Comptes Admin par Défaut

Créés par le seeder `AdminUserSeeder`:

| Email | Password | Rôle | Description |
|-------|----------|------|-------------|
| `admin@kamlog.com` | `password123` | super_admin | Accès complet |
| `admin.user@kamlog.com` | `password123` | admin | Gestion contenu + users |
| `editor@kamlog.com` | `password123` | editor | Édition contenu |

**⚠️ IMPORTANT**: Changer ces mots de passe en production !

---

## 🔒 Sécurité

### **Bonnes Pratiques**

1. **HTTPS en production** - Toujours utiliser HTTPS
2. **Tokens sécurisés** - Ne jamais exposer les tokens
3. **Expiration** - Les tokens expirent après 24h
4. **Révocation** - Possibilité de révoquer tous les tokens
5. **Rate limiting** - Limiter les tentatives de connexion
6. **Validation** - Valider toutes les entrées
7. **CORS** - Configurer correctement les domaines autorisés

### **Configuration .env**

```env
# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:3000
SANCTUM_EXPIRATION=1440

# Session
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost

# CORS
FRONTEND_URL=http://localhost:5173
```

---

## 📝 Commandes Utiles

### **Créer les admins par défaut**

```bash
php artisan db:seed --class=AdminUserSeeder
```

### **Révoquer tous les tokens expirés**

```bash
php artisan sanctum:prune-expired
```

### **Vérifier la configuration**

```bash
php artisan config:show auth
php artisan config:show sanctum
```

### **Tester l'authentification**

```bash
php artisan tinker

>>> $admin = AdminUser::first();
>>> $token = $admin->createToken('test')->plainTextToken;
>>> echo $token;
```

---

## ✅ Checklist d'Implémentation

- [x] Configuration `config/auth.php` avec guard admin
- [x] Configuration `config/sanctum.php` avec domaines frontend
- [x] Contrôleur `AdminAuthController` (login, logout, me, refresh)
- [x] Middleware `CheckAdminRole` pour vérifier les rôles
- [x] Middleware `CheckAdminAbility` pour vérifier les permissions
- [x] Routes API dans `routes/api.php`
- [x] Seeder `AdminUserSeeder` pour créer les admins par défaut
- [x] Mutateur `setPasswordAttribute` dans AdminUser
- [x] Méthode `updateLastLogin` dans AdminUser
- [x] Documentation complète

---

## 🚀 Prochaines Étapes

1. Configurer CORS pour le frontend
2. Implémenter les contrôleurs API pour le contenu
3. Ajouter le rate limiting sur les routes de login
4. Créer les tests unitaires pour l'authentification
5. Implémenter la réinitialisation de mot de passe
6. Ajouter la vérification email (optionnel)

---

## 📚 Ressources

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Laravel Authentication](https://laravel.com/docs/authentication)
- [Token Abilities](https://laravel.com/docs/sanctum#token-abilities)
