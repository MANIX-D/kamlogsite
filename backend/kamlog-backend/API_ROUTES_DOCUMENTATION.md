# Documentation Routes API KAMLOG

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Routes Publiques](#routes-publiques)
3. [Routes Admin](#routes-admin)
4. [Authentification](#authentification)
5. [Rate Limiting](#rate-limiting)
6. [Exemples d'utilisation](#exemples-dutilisation)

---

## 🌐 Vue d'ensemble

**Base URL** : `http://localhost:8000/api/v1`

**Format** : JSON  
**Authentification** : Laravel Sanctum (Bearer Token)  
**Versioning** : v1

---

## 🔓 Routes Publiques

### **Services**

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/services` | Liste tous les services actifs | ❌ |
| GET | `/services/{id}` | Détails d'un service | ❌ |

**Paramètres de requête** :
- `per_page` (int, 1-100) - Nombre d'éléments par page (défaut: 15)

**Exemple** :
```bash
GET /api/v1/services?per_page=20
```

---

### **Actualités**

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/news` | Liste toutes les actualités publiées | ❌ |
| GET | `/news/{id}` | Détails d'une actualité | ❌ |
| GET | `/news/slug/{slug}` | Actualité par slug (SEO) | ❌ |

**Paramètres de requête** :
- `per_page` (int, 1-100) - Pagination (défaut: 12)
- `type` (string) - Filtrer par type : `article`, `communique`, `evenement`
- `is_featured` (boolean) - Actualités à la une
- `lang` (string) - Langue pour slug : `fr`, `en` (défaut: fr)

**Exemple** :
```bash
GET /api/v1/news?type=article&is_featured=true&per_page=6
GET /api/v1/news/slug/nouvelle-infrastructure?lang=fr
```

---

### **Partenaires**

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/partners` | Liste tous les partenaires actifs | ❌ |
| GET | `/partners/{id}` | Détails d'un partenaire | ❌ |

**Paramètres de requête** :
- `per_page` (int, 1-100) - Pagination (défaut: 20)
- `category` (string) - Filtrer par catégorie : `logistique`, `transport`, `technologie`, `financier`, `autre`
- `partnership_level` (string) - Niveau : `strategic`, `premium`, `standard`
- `is_featured` (boolean) - Partenaires mis en avant

**Exemple** :
```bash
GET /api/v1/partners?category=logistique&partnership_level=strategic
```

---

### **Infrastructures**

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/infrastructures` | Liste toutes les infrastructures actives | ❌ |
| GET | `/infrastructures/{id}` | Détails d'une infrastructure | ❌ |

**Paramètres de requête** :
- `per_page` (int, 1-100) - Pagination (défaut: 15)
- `type` (string) - Filtrer par type : `entrepot`, `bureau`, `plateforme`, `autre`
- `is_available` (boolean) - Disponibilité

**Exemple** :
```bash
GET /api/v1/infrastructures?type=entrepot&is_available=true
```

---

### **Offres d'Emploi**

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/jobs` | Liste toutes les offres actives | ❌ |
| GET | `/jobs/{id}` | Détails d'une offre | ❌ |

**Paramètres de requête** :
- `per_page` (int, 1-100) - Pagination (défaut: 15)
- `contract_type` (string) - Type : `CDI`, `CDD`, `stage`, `freelance`
- `experience_level` (string) - Niveau : `junior`, `intermediate`, `senior`, `expert`
- `location` (string) - Recherche par localisation
- `is_urgent` (boolean) - Offres urgentes

**Exemple** :
```bash
GET /api/v1/jobs?contract_type=CDI&experience_level=senior&location=Douala
```

---

### **Annonces**

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/announcements` | Liste toutes les annonces actives | ❌ |
| GET | `/announcements/{id}` | Détails d'une annonce | ❌ |

**Paramètres de requête** :
- `per_page` (int, 1-100) - Pagination (défaut: 10)
- `type` (string) - Type : `info`, `warning`, `success`, `error`
- `priority` (string) - Priorité : `low`, `medium`, `high`, `urgent`
- `is_popup` (boolean) - Annonces popup

**Exemple** :
```bash
GET /api/v1/announcements?priority=urgent&is_popup=true
```

---

### **Formulaires Publics**

#### **Contact**

| Méthode | Endpoint | Description | Rate Limit |
|---------|----------|-------------|------------|
| POST | `/contact` | Envoyer un message | 3/heure |

**Body** :
```json
{
  "nom": "John Doe",
  "email": "john@example.com",
  "telephone": "+237 6XX XX XX XX",
  "entreprise": "ACME Corp",
  "sujet": "Demande d'information",
  "message": "Bonjour, je souhaiterais..."
}
```

---

#### **Newsletter**

| Méthode | Endpoint | Description | Rate Limit |
|---------|----------|-------------|------------|
| POST | `/newsletter/subscribe` | S'inscrire à la newsletter | 5/jour |
| GET | `/newsletter/unsubscribe/{token}` | Se désinscrire | - |

**Body (subscribe)** :
```json
{
  "email": "john@example.com",
  "nom": "Doe",
  "prenom": "John",
  "entreprise": "ACME Corp"
}
```

---

#### **Demande de Visite**

| Méthode | Endpoint | Description | Rate Limit |
|---------|----------|-------------|------------|
| POST | `/visit-requests` | Demander une visite | 5/jour |

**Body** :
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+237 6XX XX XX XX",
  "company": "ACME Corp",
  "date": "2026-04-15",
  "heure": "14:30",
  "type_visite": "infrastructure",
  "infrastructure_id": 1,
  "message": "Je souhaite visiter..."
}
```

---

#### **Demande de Devis**

| Méthode | Endpoint | Description | Rate Limit |
|---------|----------|-------------|------------|
| POST | `/quote-requests` | Demander un devis | 3/jour |

**Body** :
```json
{
  "company_name": "ACME Corp",
  "contact_person": "John Doe",
  "email": "john@example.com",
  "phone": "+237 6XX XX XX XX",
  "address": "Douala, Cameroun",
  "service_type": "logistique_complete",
  "project_description": "Nous avons besoin de...",
  "requirements": ["stockage", "transport"],
  "budget_range": "10M - 50M FCFA",
  "desired_start_date": "2026-05-01",
  "desired_end_date": "2026-12-31"
}
```

---

## 🔐 Routes Admin

### **Authentification**

#### **Login**

| Méthode | Endpoint | Description | Rate Limit |
|---------|----------|-------------|------------|
| POST | `/admin/auth/login` | Connexion admin | 5/minute |

**Body** :
```json
{
  "email": "admin@kamlog.com",
  "password": "password"
}
```

**Réponse** :
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
      "phone": null
    },
    "token": "1|xxxxxxxxxxxxxxxxxxxxx",
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

#### **Routes Authentifiées**

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/admin/auth/logout` | Déconnexion | ✅ |
| POST | `/admin/auth/logout-all` | Déconnexion de tous les appareils | ✅ |
| GET | `/admin/auth/me` | Profil admin | ✅ |
| POST | `/admin/auth/refresh` | Rafraîchir le token | ✅ |

**Headers requis** :
```
Authorization: Bearer {token}
Accept: application/json
```

---

### **CRUD Admin (Super Admin & Admin)**

Toutes les routes suivantes nécessitent :
- ✅ Authentification Sanctum
- ✅ Rôle : `super_admin` ou `admin`

#### **Services**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/admin/services` | Créer un service |
| PUT | `/admin/services/{id}` | Modifier un service |
| DELETE | `/admin/services/{id}` | Supprimer (soft delete) |
| POST | `/admin/services/{id}/restore` | Restaurer |

---

#### **Actualités**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/admin/news` | Créer une actualité |
| PUT | `/admin/news/{id}` | Modifier une actualité |
| DELETE | `/admin/news/{id}` | Supprimer (soft delete) |
| POST | `/admin/news/{id}/restore` | Restaurer |

---

#### **Partenaires**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/admin/partners` | Créer un partenaire |
| PUT | `/admin/partners/{id}` | Modifier un partenaire |
| DELETE | `/admin/partners/{id}` | Supprimer (soft delete) |
| POST | `/admin/partners/{id}/restore` | Restaurer |

---

#### **Infrastructures**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/admin/infrastructures` | Créer une infrastructure |
| PUT | `/admin/infrastructures/{id}` | Modifier une infrastructure |
| DELETE | `/admin/infrastructures/{id}` | Supprimer (soft delete) |
| POST | `/admin/infrastructures/{id}/restore` | Restaurer |

---

#### **Offres d'Emploi**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/admin/jobs` | Créer une offre |
| PUT | `/admin/jobs/{id}` | Modifier une offre |
| DELETE | `/admin/jobs/{id}` | Supprimer (soft delete) |
| POST | `/admin/jobs/{id}/restore` | Restaurer |

---

#### **Annonces**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/admin/announcements` | Créer une annonce |
| PUT | `/admin/announcements/{id}` | Modifier une annonce |
| DELETE | `/admin/announcements/{id}` | Supprimer (soft delete) |
| POST | `/admin/announcements/{id}/restore` | Restaurer |

---

### **Gestion des Formulaires (Admin)**

#### **Messages de Contact**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/admin/contact-messages` | Liste tous les messages |
| GET | `/admin/contact-messages/{id}` | Détails d'un message |
| PUT | `/admin/contact-messages/{id}` | Mettre à jour (statut, réponse) |
| POST | `/admin/contact-messages/{id}/mark-read` | Marquer comme lu |
| DELETE | `/admin/contact-messages/{id}` | Supprimer |

**Paramètres GET** :
- `statut` : `nouveau`, `en_cours`, `traite`, `archive`
- `lu` : `true`, `false`

**Body PUT** :
```json
{
  "statut": "traite",
  "reponse": "Merci pour votre message...",
  "admin_user_id": 1
}
```

---

#### **Newsletter**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/admin/newsletter/subscribers` | Liste des abonnés |
| GET | `/admin/newsletter/subscribers/{id}` | Détails d'un abonné |
| DELETE | `/admin/newsletter/subscribers/{id}` | Supprimer un abonné |

**Paramètres GET** :
- `statut` : `actif`, `desinscrit`

---

#### **Demandes de Visite**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/admin/visit-requests` | Liste des demandes |
| GET | `/admin/visit-requests/{id}` | Détails d'une demande |
| PUT | `/admin/visit-requests/{id}` | Mettre à jour |
| POST | `/admin/visit-requests/{id}/confirm` | Confirmer |
| POST | `/admin/visit-requests/{id}/cancel` | Annuler |
| DELETE | `/admin/visit-requests/{id}` | Supprimer |

**Paramètres GET** :
- `status` : `en_attente`, `confirmee`, `annulee`, `terminee`
- `type_visite` : `infrastructure`, `bureau`, `general`
- `infrastructure_id` : ID de l'infrastructure
- `date_from` / `date_to` : Filtres de dates

**Body PUT** :
```json
{
  "status": "confirmee",
  "admin_user_id": 1,
  "notes": "Visite confirmée pour le 15/04"
}
```

---

#### **Demandes de Devis**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/admin/quote-requests` | Liste des demandes |
| GET | `/admin/quote-requests/{id}` | Détails d'une demande |
| PUT | `/admin/quote-requests/{id}` | Mettre à jour |
| DELETE | `/admin/quote-requests/{id}` | Supprimer |

**Paramètres GET** :
- `status` : `en_attente`, `en_cours`, `devis_envoye`, `accepte`, `refuse`, `annule`
- `service_type` : `stockage`, `transport`, `logistique_complete`, `autre`
- `date_from` / `date_to` : Filtres de dates

**Body PUT** :
```json
{
  "status": "devis_envoye",
  "admin_user_id": 1,
  "estimated_amount": 25000000,
  "notes": "Devis envoyé par email"
}
```

---

### **Métriques (Super Admin uniquement)**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/admin/metrics/auth/today` | Métriques d'authentification du jour |
| GET | `/admin/metrics/auth/period` | Métriques sur une période |

**Paramètres** :
- `days` (int, 1-30) - Nombre de jours (défaut: 7)

**Réponse** :
```json
{
  "success": true,
  "data": {
    "date": "2026-03-25",
    "metrics": {
      "login_success": 45,
      "login_failed": 3,
      "logout": 42,
      "token_refresh": 12,
      "access_denied": 1,
      "rate_limit_hit": 0,
      "suspicious_activity_detected": 0
    },
    "summary": {
      "total_logins": 48,
      "success_rate": 93.75
    }
  }
}
```

---

### **Lecture Seule (Tous les Admins)**

Les éditeurs (`editor`) ont accès en lecture seule aux routes admin :

| Endpoint | Description |
|----------|-------------|
| GET `/admin/services` | Liste des services |
| GET `/admin/news` | Liste des actualités |
| GET `/admin/partners` | Liste des partenaires |
| GET `/admin/infrastructures` | Liste des infrastructures |
| GET `/admin/jobs` | Liste des offres d'emploi |
| GET `/admin/announcements` | Liste des annonces |

---

## ⏱️ Rate Limiting

| Endpoint | Limite | Période |
|----------|--------|---------|
| **Login** | 5 tentatives | 1 minute |
| **Token Refresh** | 10 tentatives | 1 minute |
| **Contact** | 3 messages | 1 heure |
| **Newsletter** | 5 inscriptions | 1 jour |
| **Visite** | 5 demandes | 1 jour |
| **Devis** | 3 demandes | 1 jour |

**Réponse 429 (Too Many Requests)** :
```json
{
  "success": false,
  "message": "Trop de requêtes. Veuillez réessayer dans X secondes."
}
```

---

## 📝 Exemples d'utilisation

### **Frontend Public - Récupérer les services**

```javascript
// Axios
const response = await axios.get('http://localhost:8000/api/v1/services', {
  params: {
    per_page: 20
  }
});

console.log(response.data);
// {
//   success: true,
//   data: [...],
//   pagination: { total: 50, per_page: 20, ... }
// }
```

---

### **Frontend Public - Envoyer un message de contact**

```javascript
const response = await axios.post('http://localhost:8000/api/v1/contact', {
  nom: 'John Doe',
  email: 'john@example.com',
  telephone: '+237 6XX XX XX XX',
  entreprise: 'ACME Corp',
  sujet: 'Demande d\'information',
  message: 'Bonjour, je souhaiterais...'
});

console.log(response.data);
// {
//   success: true,
//   message: 'Votre message a été envoyé avec succès...'
// }
```

---

### **Admin Panel - Login**

```javascript
const response = await axios.post('http://localhost:8000/api/v1/admin/auth/login', {
  email: 'admin@kamlog.com',
  password: 'password'
});

const token = response.data.data.token;
localStorage.setItem('admin_token', token);
```

---

### **Admin Panel - Créer une actualité**

```javascript
const token = localStorage.getItem('admin_token');

const response = await axios.post('http://localhost:8000/api/v1/admin/news', {
  titre_fr: 'Nouvelle infrastructure',
  titre_en: 'New infrastructure',
  contenu_fr: 'Nous sommes heureux...',
  contenu_en: 'We are pleased...',
  slug_fr: 'nouvelle-infrastructure',
  slug_en: 'new-infrastructure',
  type: 'article',
  is_published: true,
  is_featured: false
}, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
});

console.log(response.data);
// {
//   success: true,
//   message: 'Actualité créée avec succès',
//   data: { id: 1, ... }
// }
```

---

### **Admin Panel - Gérer les messages de contact**

```javascript
const token = localStorage.getItem('admin_token');

// Liste des messages non lus
const response = await axios.get('http://localhost:8000/api/v1/admin/contact-messages', {
  params: {
    lu: false,
    statut: 'nouveau'
  },
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
});

// Marquer comme lu et répondre
await axios.put(`http://localhost:8000/api/v1/admin/contact-messages/${messageId}`, {
  statut: 'traite',
  reponse: 'Merci pour votre message...',
  admin_user_id: 1
}, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
});
```

---

## 🔒 Sécurité

### **Headers Requis**

Toutes les requêtes admin doivent inclure :
```
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

### **CORS**

Les domaines autorisés sont configurés dans `config/cors.php` :
- `http://localhost:5173` (Vite)
- `http://localhost:3000` (React)
- `http://127.0.0.1:8000` (Laravel)

### **Validation**

Toutes les entrées sont validées via FormRequests avec messages d'erreur en français.

### **Rate Limiting**

Protection anti-spam sur tous les formulaires publics et routes sensibles.

---

## 📊 Codes de Réponse HTTP

| Code | Signification |
|------|---------------|
| **200** | OK - Succès |
| **201** | Created - Ressource créée |
| **204** | No Content - Suppression réussie |
| **400** | Bad Request - Erreur de validation |
| **401** | Unauthorized - Non authentifié |
| **403** | Forbidden - Permissions insuffisantes |
| **404** | Not Found - Ressource non trouvée |
| **422** | Unprocessable Entity - Validation échouée |
| **429** | Too Many Requests - Rate limit dépassé |
| **500** | Internal Server Error - Erreur serveur |

---

## ✅ Checklist Intégration Frontend

- [ ] Configurer axios avec baseURL
- [ ] Implémenter intercepteur pour le token
- [ ] Gérer le refresh token
- [ ] Implémenter gestion des erreurs 401/403
- [ ] Ajouter loading states
- [ ] Implémenter retry logic pour 429
- [ ] Tester tous les endpoints
- [ ] Valider les formulaires côté client
- [ ] Gérer la pagination
- [ ] Implémenter le cache côté client

---

## 🎯 Résumé

L'API KAMLOG v1 fournit :

✅ **45+ endpoints** RESTful  
✅ **Routes publiques** pour le site web  
✅ **Routes admin** protégées par Sanctum  
✅ **CRUD complet** sur toutes les entités  
✅ **Rate limiting** sur formulaires  
✅ **Pagination** sur toutes les listes  
✅ **Validation** complète avec messages FR  
✅ **Rôles** : super_admin, admin, editor  
✅ **Cache** intelligent (15-60 min)  
✅ **Documentation** complète  

**Production ready** 🚀
