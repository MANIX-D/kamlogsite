# Configuration CORS - KAMLOG Backend

## ✅ Configuration Appliquée

### **CORS déjà configuré pour React (localhost:5173)** ✅

Le fichier `config/cors.php` est déjà optimisé pour votre frontend React.

---

## 📋 Configuration Actuelle

### **Origines Autorisées**

```php
'allowed_origins' => [
    'http://localhost:5173',      // ✅ Vite dev server (React)
    'http://localhost:3000',      // React dev server alternatif
    'http://127.0.0.1:5173',      // Vite alternative
    'http://127.0.0.1:3000',      // React alternative
    'http://127.0.0.1:8000',      // Laravel local
    'http://localhost:8000',      // Laravel local
],
```

### **Chemins CORS**

```php
'paths' => [
    'api/*',                      // Toutes les routes API
    'sanctum/csrf-cookie'         // Token CSRF pour Sanctum
],
```

### **Méthodes Autorisées**

```php
'allowed_methods' => ['*'],       // GET, POST, PUT, PATCH, DELETE, OPTIONS
```

### **Headers Autorisés**

```php
'allowed_headers' => ['*'],       // Tous les headers
```

### **Headers Exposés**

```php
'exposed_headers' => [
    'X-Total-Count',              // Pagination
    'X-Page-Count',
    'X-Per-Page',
    'X-Current-Page',
],
```

### **Credentials**

```php
'supports_credentials' => true,   // Cookies et authentification
```

---

## 🚀 Utilisation dans React

### **1. Configuration Axios**

```javascript
// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true, // Important pour Sanctum
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

### **2. Exemple de Requête**

```javascript
// src/services/newsService.js
import api from '../api/axios';

export const newsService = {
  // Liste des actualités
  async getAll(params = {}) {
    const response = await api.get('/news', { params });
    return response.data;
  },

  // Une actualité par ID
  async getById(id) {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  // Une actualité par slug
  async getBySlug(slug) {
    const response = await api.get(`/news/slug/${slug}`);
    return response.data;
  },

  // Créer (Admin)
  async create(data) {
    const response = await api.post('/admin/news', data);
    return response.data;
  },

  // Mettre à jour (Admin)
  async update(id, data) {
    const response = await api.put(`/admin/news/${id}`, data);
    return response.data;
  },

  // Supprimer (Admin)
  async delete(id) {
    const response = await api.delete(`/admin/news/${id}`);
    return response.data;
  }
};
```

### **3. Authentification avec Sanctum**

```javascript
// src/services/authService.js
import api from '../api/axios';

export const authService = {
  // Obtenir le cookie CSRF
  async getCsrfCookie() {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    });
  },

  // Login
  async login(email, password) {
    // 1. Obtenir le cookie CSRF
    await this.getCsrfCookie();
    
    // 2. Login
    const response = await api.post('/auth/login', { email, password });
    
    // 3. Stocker le token
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Logout
  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // Utilisateur actuel
  async getCurrentUser() {
    const response = await api.get('/auth/user');
    return response.data;
  }
};
```

### **4. Hook React Personnalisé**

```javascript
// src/hooks/useApi.js
import { useState, useEffect } from 'react';

export const useApi = (apiFunc, params = {}, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = async (overrideParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc({ ...params, ...overrideParams });
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { data, loading, error, execute };
};

// Utilisation
function NewsList() {
  const { data, loading, error } = useApi(
    () => newsService.getAll({ per_page: 12 })
  );

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {data?.data.map(news => (
        <NewsCard key={news.id} news={news} />
      ))}
    </div>
  );
}
```

---

## 🔧 Configuration Production

### **Ajouter les Domaines de Production**

```php
// config/cors.php
'allowed_origins' => [
    // Développement
    'http://localhost:5173',
    'http://localhost:3000',
    
    // Production
    'https://kamlog.cm',
    'https://www.kamlog.cm',
    'https://admin.kamlog.cm',
    'https://app.kamlog.cm',
],
```

### **Variables d'Environnement**

```env
# .env.production
SANCTUM_STATEFUL_DOMAINS=kamlog.cm,www.kamlog.cm,admin.kamlog.cm
SESSION_DOMAIN=.kamlog.cm
```

---

## 🧪 Tester la Configuration CORS

### **1. Test Simple avec cURL**

```bash
# Test OPTIONS (preflight)
curl -X OPTIONS http://localhost:8000/api/v1/services \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Vérifier les headers de réponse :
# Access-Control-Allow-Origin: http://localhost:5173
# Access-Control-Allow-Credentials: true
```

### **2. Test dans le Navigateur**

```javascript
// Console du navigateur (depuis http://localhost:5173)
fetch('http://localhost:8000/api/v1/services', {
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### **3. Vérifier les Headers**

Ouvrez les DevTools → Network → Sélectionnez une requête API :

**Request Headers** :
```
Origin: http://localhost:5173
```

**Response Headers** :
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: X-Total-Count, X-Page-Count, ...
```

---

## ⚠️ Problèmes Courants

### **1. Erreur CORS malgré la configuration**

**Problème** : `Access to fetch at 'http://localhost:8000/api/v1/...' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solutions** :
```bash
# 1. Vider le cache de configuration Laravel
php artisan config:clear
php artisan cache:clear

# 2. Vérifier que le middleware CORS est actif
# Dans app/Http/Kernel.php, vérifier :
\Fruitcake\Cors\HandleCors::class,

# 3. Redémarrer le serveur Laravel
php artisan serve
```

### **2. Credentials non envoyés**

**Problème** : Les cookies ne sont pas envoyés avec les requêtes

**Solution** :
```javascript
// Toujours utiliser withCredentials: true
axios.create({
  withCredentials: true
});

// Ou avec fetch
fetch(url, {
  credentials: 'include'
});
```

### **3. Preflight Request Failed**

**Problème** : La requête OPTIONS échoue

**Solution** :
```php
// Vérifier que 'allowed_methods' inclut OPTIONS
'allowed_methods' => ['*'],

// Ou explicitement
'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
```

---

## 📋 Checklist Configuration

**Backend Laravel** :
- [x] `config/cors.php` configuré
- [x] `http://localhost:5173` dans `allowed_origins`
- [x] `supports_credentials` = true
- [x] Middleware CORS actif
- [x] Routes API sous `/api/v1`

**Frontend React** :
- [ ] Axios configuré avec `withCredentials: true`
- [ ] `baseURL` pointe vers `http://localhost:8000/api/v1`
- [ ] Token stocké dans localStorage
- [ ] Intercepteur Axios pour ajouter le token
- [ ] Gestion des erreurs CORS

**Tests** :
- [ ] Requête GET fonctionne
- [ ] Requête POST fonctionne
- [ ] Authentification fonctionne
- [ ] Headers CORS présents dans les réponses
- [ ] Cookies envoyés correctement

---

## 🎯 Résumé

✅ **CORS déjà configuré pour localhost:5173**
✅ **Toutes les méthodes HTTP autorisées**
✅ **Credentials supportés (cookies + tokens)**
✅ **Headers de pagination exposés**
✅ **Prêt pour React + Vite**

**Votre frontend React peut maintenant communiquer avec le backend Laravel !** 🚀

### **Prochaines Étapes**

1. Créer le service API dans React (voir exemples ci-dessus)
2. Configurer Axios avec `withCredentials: true`
3. Implémenter l'authentification Sanctum
4. Tester les requêtes depuis React
5. Ajouter les domaines de production quand prêt
