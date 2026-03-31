# API KAMLOG — Documentation

**Base URL** : `https://votre-domaine.com/api/v1`  
**Format** : JSON  
**Authentification** : Bearer Token (Laravel Sanctum)  
**Rate Limiting** : 60 req/min (public), 120 req/min (admin)

---

## Table des matières

1. [Authentification](#1-authentification)
2. [Services (Public)](#2-services)
3. [Actualités (Public)](#3-actualités)
4. [Partenaires (Public)](#4-partenaires)
5. [Infrastructures (Public)](#5-infrastructures)
6. [Offres d'emploi (Public)](#6-offres-demploi)
7. [Annonces (Public)](#7-annonces)
8. [Formulaires publics](#8-formulaires-publics)
9. [Admin — CRUD Contenu](#9-admin--crud-contenu)
10. [Admin — Gestion](#10-admin--gestion)
11. [Admin — Fichiers & Stockage](#11-admin--fichiers--stockage)
12. [Admin — Tableau de bord](#12-admin--tableau-de-bord)
13. [Codes d'erreur](#13-codes-derreur)

---

## Format des réponses

Toutes les réponses suivent ce format standardisé :

**Succès :**
```json
{
  "success": true,
  "message": "Message optionnel",
  "data": { }
}
```

**Succès paginé :**
```json
{
  "success": true,
  "data": [ ],
  "pagination": {
    "total": 50,
    "per_page": 15,
    "current_page": 1,
    "last_page": 4,
    "from": 1,
    "to": 15
  }
}
```

**Erreur :**
```json
{
  "success": false,
  "message": "Description de l'erreur"
}
```

**Erreur de validation (422) :**
```json
{
  "success": false,
  "message": "Erreur de validation",
  "errors": {
    "champ": ["Le champ est requis."]
  }
}
```

---

## 1. Authentification

### `POST /admin/auth/login`

Connexion administrateur. Rate limit : 5/min par email+IP, 15/h par IP.

**Requête :**
```json
{
  "email": "admin@kamlog.com",
  "password": "motdepasse"
}
```

**Réponse 200 :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "admin": {
      "id": 1,
      "name": "Admin KAMLOG",
      "email": "admin@kamlog.com",
      "role": "super_admin",
      "avatar": null,
      "phone": "+237 6XX XXX XXX"
    },
    "token": "1|abc123...",
    "abilities": ["admin:*", "users:*", "content:*", "settings:*"]
  }
}
```

### `POST /admin/auth/logout` 🔒

Déconnexion (révoque le token courant).

**Headers :** `Authorization: Bearer {token}`

**Réponse 200 :**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

### `POST /admin/auth/logout-all` 🔒

Révoque tous les tokens de l'utilisateur.

**Réponse 200 :**
```json
{
  "success": true,
  "message": "Tous les tokens ont été révoqués"
}
```

### `GET /admin/auth/me` 🔒

Informations de l'utilisateur connecté.

**Réponse 200 :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin KAMLOG",
    "email": "admin@kamlog.com",
    "role": "super_admin",
    "avatar": null,
    "phone": "+237 6XX XXX XXX",
    "is_active": true,
    "last_login_at": "2026-03-30T12:00:00.000000Z",
    "created_at": "2026-01-01T00:00:00.000000Z"
  }
}
```

### `POST /admin/auth/refresh` 🔒

Rafraîchit le token (rate limit : 10/min).

**Réponse 200 :**
```json
{
  "success": true,
  "message": "Token rafraîchi",
  "data": {
    "token": "2|xyz789...",
    "abilities": ["admin:*", "users:*", "content:*", "settings:*"]
  }
}
```

---

## 2. Services

### `GET /services`

Liste des services actifs (public).

| Paramètre | Type | Description |
|-----------|------|-------------|
| `per_page` | int | Éléments par page (1-100, défaut: 15) |
| `is_active` | bool | Filtrer par statut actif |

**Réponse 200 :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nom_fr": "Transport routier",
      "nom_en": "Road Transport",
      "description_fr": "Service de transport routier national et international",
      "description_en": "National and international road transport service",
      "icon": "truck",
      "image": "services/transport.jpg",
      "display_order": 1,
      "is_active": true,
      "created_at": "2026-01-15T10:00:00.000000Z",
      "updated_at": "2026-01-15T10:00:00.000000Z"
    }
  ],
  "pagination": { "total": 8, "per_page": 15, "current_page": 1, "last_page": 1, "from": 1, "to": 8 }
}
```

### `GET /services/{id}`

Détail d'un service.

**Réponse 200 :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nom_fr": "Transport routier",
    "nom_en": "Road Transport",
    "description_fr": "Service de transport routier...",
    "description_en": "Road transport service...",
    "icon": "truck",
    "image": "services/transport.jpg",
    "display_order": 1,
    "is_active": true
  }
}
```

---

## 3. Actualités

### `GET /news`

Liste des actualités publiées.

| Paramètre | Type | Description |
|-----------|------|-------------|
| `per_page` | int | Éléments par page (1-100, défaut: 12) |
| `type` | string | `article`, `annonce`, `offre` |
| `is_featured` | bool | Uniquement les articles en vedette |
| `is_published` | bool | Filtrer par statut de publication |

**Réponse 200 :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titre_fr": "Nouveau service de stockage",
      "titre_en": "New Storage Service",
      "contenu_fr": "Nous sommes heureux d'annoncer...",
      "contenu_en": "We are pleased to announce...",
      "slug_fr": "nouveau-service-de-stockage",
      "slug_en": "new-storage-service",
      "type": "article",
      "image": "news/stockage.jpg",
      "image_alt_fr": "Entrepôt de stockage",
      "image_alt_en": "Storage warehouse",
      "date_publication": "2026-03-20",
      "is_published": true,
      "is_featured": false,
      "views": 142
    }
  ],
  "pagination": { "total": 25, "per_page": 12, "current_page": 1, "last_page": 3, "from": 1, "to": 12 }
}
```

### `GET /news/{id}`

Détail d'une actualité (incrémente le compteur de vues).

### `GET /news/slug/{slug}?lang=fr`

Recherche d'une actualité par slug. Paramètre `lang` : `fr` (défaut) ou `en`.

---

## 4. Partenaires

### `GET /partners`

Liste des partenaires actifs.

| Paramètre | Type | Description |
|-----------|------|-------------|
| `per_page` | int | Éléments par page (1-100, défaut: 20) |
| `category` | string | `logistique`, `transport`, `technologie`, `financier`, `autre` |
| `partnership_level` | string | `strategic`, `premium`, `standard`, `basic` |
| `is_featured` | bool | Uniquement les partenaires en vedette |

**Réponse 200 :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name_fr": "Bolloré Transport",
      "name_en": "Bolloré Transport",
      "logo_url": "partners/bollore.png",
      "description_fr": "Partenaire logistique stratégique",
      "description_en": "Strategic logistics partner",
      "category": "logistique",
      "website": "https://bollore.com",
      "email": "contact@bollore.com",
      "phone": "+237 6XX XXX XXX",
      "address": "Douala, Cameroun",
      "partnership_level": "strategic",
      "display_order": 1,
      "is_active": true,
      "is_featured": true
    }
  ],
  "pagination": { }
}
```

### `GET /partners/{id}`

Détail d'un partenaire.

---

## 5. Infrastructures

### `GET /infrastructures`

Liste des infrastructures actives.

| Paramètre | Type | Description |
|-----------|------|-------------|
| `per_page` | int | Éléments par page (1-100, défaut: 15) |
| `type` | string | `entrepot`, `bureau`, `atelier`, `showroom`, `autre` |
| `is_available` | bool | Uniquement les infrastructures disponibles |

**Réponse 200 :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nom_fr": "Entrepôt Principal",
      "nom_en": "Main Warehouse",
      "description_fr": "Entrepôt de 5000m² équipé...",
      "description_en": "5000m² equipped warehouse...",
      "surface": "5000 m²",
      "capacite": "10000 palettes",
      "image": "infrastructures/entrepot.jpg",
      "type": "entrepot",
      "equipements": ["quais", "chariots", "racks"],
      "specifications_techniques": {"hauteur": "12m", "temperature": "contrôlée"},
      "display_order": 1,
      "is_active": true,
      "is_available": true
    }
  ],
  "pagination": { }
}
```

### `GET /infrastructures/{id}`

Détail d'une infrastructure.

---

## 6. Offres d'emploi

### `GET /jobs`

Liste des offres d'emploi actives et non expirées.

| Paramètre | Type | Description |
|-----------|------|-------------|
| `per_page` | int | Éléments par page (1-100, défaut: 15) |
| `contract_type` | string | `CDI`, `CDD`, `Stage`, `Freelance`, `Alternance` |
| `experience_level` | string | `junior`, `confirme`, `senior`, `expert` |
| `location` | string | Recherche partielle sur la localisation |
| `is_urgent` | bool | Uniquement les offres urgentes |

**Réponse 200 :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title_fr": "Responsable Logistique",
      "title_en": "Logistics Manager",
      "description_fr": "Nous recherchons un responsable...",
      "description_en": "We are looking for a logistics...",
      "requirements_fr": "Bac+5 en logistique...",
      "requirements_en": "Master's in logistics...",
      "benefits_fr": "Assurance santé, transport...",
      "benefits_en": "Health insurance, transport...",
      "contract_type": "CDI",
      "location": "Douala, Cameroun",
      "experience_level": "senior",
      "salary_range": "500 000 - 800 000 FCFA",
      "department": "Opérations",
      "application_deadline": "2026-06-30",
      "is_active": true,
      "is_urgent": false,
      "job_applications_count": 12
    }
  ],
  "pagination": { }
}
```

### `GET /jobs/{id}`

Détail d'une offre d'emploi (inclut `job_applications_count`).

---

## 7. Annonces

### `GET /announcements`

Liste des annonces actives et en cours de validité.

| Paramètre | Type | Description |
|-----------|------|-------------|
| `per_page` | int | Éléments par page (1-100, défaut: 10) |
| `type` | string | `info`, `alerte`, `maintenance`, `promotion` |
| `priority` | string | `low`, `normal`, `high`, `urgent` |
| `is_popup` | bool | Uniquement les annonces popup |

**Réponse 200 :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title_fr": "Maintenance prévue",
      "title_en": "Scheduled Maintenance",
      "content_fr": "Une maintenance est prévue le...",
      "content_en": "A maintenance is scheduled for...",
      "priority": "high",
      "type": "maintenance",
      "is_active": true,
      "is_popup": false,
      "start_date": "2026-04-01",
      "end_date": "2026-04-02"
    }
  ],
  "pagination": { }
}
```

### `GET /announcements/{id}`

Détail d'une annonce.

---

## 8. Formulaires publics

> Rate limit : 3 soumissions/heure et 10/jour par IP.

### `POST /contact`

Envoi d'un message de contact.

**Requête :**
```json
{
  "nom": "Jean Dupont",
  "email": "jean.dupont@email.com",
  "telephone": "+237 6XX XXX XXX",
  "entreprise": "Ma Société SARL",
  "sujet": "Demande d'information",
  "message": "Bonjour, je souhaite en savoir plus sur vos services de transport."
}
```

| Champ | Requis | Type | Contraintes |
|-------|--------|------|-------------|
| `nom` | ✅ | string | max: 255 |
| `email` | ✅ | email | max: 255 |
| `telephone` | ❌ | string | max: 50 |
| `entreprise` | ❌ | string | max: 255 |
| `sujet` | ✅ | string | max: 255 |
| `message` | ✅ | string | — |

**Réponse 201 :**
```json
{
  "success": true,
  "message": "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
  "data": {
    "id": 1,
    "nom": "Jean Dupont",
    "email": "jean.dupont@email.com",
    "sujet": "Demande d'information",
    "statut": "nouveau",
    "created_at": "2026-03-30T12:00:00.000000Z"
  }
}
```

### `POST /newsletter/subscribe`

Inscription à la newsletter.

**Requête :**
```json
{
  "email": "jean.dupont@email.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "entreprise": "Ma Société"
}
```

| Champ | Requis | Type | Contraintes |
|-------|--------|------|-------------|
| `email` | ✅ | email | max: 255, unique |
| `nom` | ❌ | string | max: 255 |
| `prenom` | ❌ | string | max: 255 |
| `entreprise` | ❌ | string | max: 255 |

**Réponse 201 :**
```json
{
  "success": true,
  "message": "Vous êtes maintenant inscrit à notre newsletter !",
  "data": {
    "email": "jean.dupont@email.com",
    "date_inscription": "2026-03-30"
  }
}
```

### `GET /newsletter/unsubscribe/{token}`

Désinscription de la newsletter via token unique.

**Réponse 200 :**
```json
{
  "success": true,
  "message": "Vous avez été désinscrit de la newsletter avec succès"
}
```

### `POST /visit-requests`

Demande de visite d'infrastructure.

**Requête :**
```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@email.com",
  "phone": "+237 6XX XXX XXX",
  "company": "Ma Société SARL",
  "date": "2026-05-15",
  "heure": "10:00",
  "type_visite": "guidee",
  "message": "Nous souhaitons visiter l'entrepôt principal.",
  "infrastructure_id": 1
}
```

| Champ | Requis | Type | Contraintes |
|-------|--------|------|-------------|
| `name` | ✅ | string | max: 255 |
| `email` | ✅ | email | max: 255 |
| `phone` | ✅ | string | max: 50 |
| `company` | ❌ | string | max: 255 |
| `date` | ✅ | date | doit être dans le futur |
| `heure` | ✅ | string | format HH:MM |
| `type_visite` | ✅ | string | `guidee`, `autonome`, `virtuelle`, `rencontre` |
| `message` | ❌ | string | — |
| `infrastructure_id` | ❌ | int | doit exister dans la table infrastructures |

**Réponse 201 :**
```json
{
  "success": true,
  "message": "Votre demande de visite a été enregistrée avec succès. Nous vous contacterons bientôt.",
  "data": { "id": 1, "status": "pending", "..." : "..." }
}
```

### `POST /quote-requests`

Demande de devis.

**Requête :**
```json
{
  "company_name": "Ma Société SARL",
  "contact_person": "Jean Dupont",
  "email": "jean.dupont@email.com",
  "phone": "+237 6XX XXX XXX",
  "address": "Douala, Cameroun",
  "service_type": "logistique",
  "project_description": "Nous avons besoin d'un service de stockage pour 500 palettes.",
  "requirements": ["température contrôlée", "accès 24h"],
  "budget_range": "1 000 000 - 3 000 000 FCFA",
  "desired_start_date": "2026-06-01",
  "desired_end_date": "2026-12-31"
}
```

| Champ | Requis | Type | Contraintes |
|-------|--------|------|-------------|
| `company_name` | ✅ | string | max: 255 |
| `contact_person` | ✅ | string | max: 255 |
| `email` | ✅ | email | max: 255 |
| `phone` | ✅ | string | max: 50 |
| `address` | ❌ | string | max: 500 |
| `service_type` | ✅ | string | `logistique`, `stockage`, `transport`, `personnalise` |
| `project_description` | ✅ | string | — |
| `requirements` | ❌ | array | — |
| `budget_range` | ❌ | string | max: 100 |
| `desired_start_date` | ❌ | date | doit être dans le futur |
| `desired_end_date` | ❌ | date | doit être après `desired_start_date` |

**Réponse 201 :**
```json
{
  "success": true,
  "message": "Votre demande de devis a été enregistrée avec succès. Nous vous contacterons dans les plus brefs délais.",
  "data": { "id": 1, "status": "nouveau", "..." : "..." }
}
```

### `POST /upload/cv`

Upload de CV pour candidature (rate limit: 5/jour par IP).

**Requête :** `multipart/form-data` avec champ `cv` (PDF, DOC, DOCX).

---

## 9. Admin — CRUD Contenu

> 🔒 Toutes les routes nécessitent `Authorization: Bearer {token}` + rôle `admin` ou `super_admin`.  
> Rate limit écriture : 60/min (admin), 200/min (super_admin).

Le pattern est identique pour chaque entité :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/admin/{entité}` | Créer |
| `PUT` | `/admin/{entité}/{id}` | Modifier |
| `DELETE` | `/admin/{entité}/{id}` | Supprimer (soft delete) |
| `POST` | `/admin/{entité}/{id}/restore` | Restaurer |

### Services (`/admin/services`)

**`POST /admin/services`** — Créer un service

```json
{
  "nom_fr": "Entreposage",
  "nom_en": "Warehousing",
  "description_fr": "Service d'entreposage sécurisé",
  "description_en": "Secure warehousing service",
  "icon": "warehouse",
  "image": "services/entreposage.jpg",
  "display_order": 5,
  "is_active": true
}
```

**Réponse 201 :**
```json
{
  "success": true,
  "message": "Service créé avec succès",
  "data": { "id": 9, "nom_fr": "Entreposage", "..." : "..." }
}
```

### Actualités (`/admin/news`)

**`POST /admin/news`**

```json
{
  "titre_fr": "Ouverture d'un nouvel entrepôt",
  "titre_en": "New Warehouse Opening",
  "contenu_fr": "Nous avons le plaisir d'annoncer...",
  "contenu_en": "We are pleased to announce...",
  "slug_fr": "ouverture-nouvel-entrepot",
  "slug_en": "new-warehouse-opening",
  "type": "article",
  "image": "news/entrepot.jpg",
  "date_publication": "2026-04-01",
  "is_published": true,
  "is_featured": false
}
```

> **Valeurs `type`** : `article`, `annonce`, `offre`

### Partenaires (`/admin/partners`)

**`POST /admin/partners`**

```json
{
  "name_fr": "DHL Express",
  "name_en": "DHL Express",
  "logo_url": "partners/dhl.png",
  "description_fr": "Partenaire de livraison express",
  "description_en": "Express delivery partner",
  "category": "transport",
  "website": "https://dhl.com",
  "email": "contact@dhl.com",
  "phone": "+237 6XX XXX XXX",
  "partnership_level": "premium",
  "is_active": true,
  "is_featured": false
}
```

> **Valeurs `category`** : `logistique`, `transport`, `technologie`, `financier`, `autre`  
> **Valeurs `partnership_level`** : `strategic`, `premium`, `standard`, `basic`

### Infrastructures (`/admin/infrastructures`)

**`POST /admin/infrastructures`**

```json
{
  "nom_fr": "Atelier de réparation",
  "nom_en": "Repair Workshop",
  "description_fr": "Atelier équipé pour la maintenance...",
  "description_en": "Equipped workshop for maintenance...",
  "surface": "800 m²",
  "capacite": "20 véhicules",
  "type": "atelier",
  "equipements": ["pont élévateur", "outillage"],
  "specifications_techniques": {"hauteur": "6m"},
  "is_active": true,
  "is_available": true
}
```

> **Valeurs `type`** : `entrepot`, `bureau`, `atelier`, `showroom`, `autre`

### Offres d'emploi (`/admin/jobs`)

**`POST /admin/jobs`**

```json
{
  "title_fr": "Chauffeur Poids Lourd",
  "title_en": "Heavy Truck Driver",
  "description_fr": "Nous recrutons un chauffeur...",
  "description_en": "We are hiring a driver...",
  "requirements_fr": "Permis C, 3 ans d'expérience",
  "requirements_en": "Class C license, 3 years experience",
  "benefits_fr": "Assurance, prime de transport",
  "benefits_en": "Insurance, transport allowance",
  "contract_type": "CDI",
  "location": "Douala, Cameroun",
  "experience_level": "confirme",
  "salary_range": "300 000 - 500 000 FCFA",
  "department": "Transport",
  "application_deadline": "2026-06-30",
  "is_active": true,
  "is_urgent": true
}
```

> **Valeurs `contract_type`** : `CDI`, `CDD`, `Stage`, `Freelance`, `Alternance`  
> **Valeurs `experience_level`** : `junior`, `confirme`, `senior`, `expert`

### Annonces (`/admin/announcements`)

**`POST /admin/announcements`**

```json
{
  "title_fr": "Promotion de fin d'année",
  "title_en": "End of Year Promotion",
  "content_fr": "Profitez de 20% de réduction...",
  "content_en": "Enjoy 20% off on...",
  "priority": "normal",
  "type": "promotion",
  "is_active": true,
  "is_popup": true,
  "start_date": "2026-12-01",
  "end_date": "2026-12-31"
}
```

> **Valeurs `priority`** : `low`, `normal`, `high`, `urgent`  
> **Valeurs `type`** : `info`, `alerte`, `maintenance`, `promotion`

---

## 10. Admin — Gestion

> 🔒 Rôle `admin` ou `super_admin` requis.

### Messages de contact

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/admin/contact-messages` | Lister (filtres: `statut`, `lu`) |
| `GET` | `/admin/contact-messages/{id}` | Détail (marque comme lu automatiquement) |
| `PUT` | `/admin/contact-messages/{id}` | Modifier statut/réponse |
| `POST` | `/admin/contact-messages/{id}/mark-read` | Marquer comme lu |
| `DELETE` | `/admin/contact-messages/{id}` | Supprimer |

**`PUT /admin/contact-messages/{id}`**

```json
{
  "statut": "traite",
  "reponse": "Merci pour votre message, nous avons bien pris en compte votre demande.",
  "user_id": 1
}
```

> **Valeurs `statut`** : `nouveau`, `en_cours`, `traite`, `archive`

### Abonnés newsletter

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/admin/newsletter/subscribers` | Lister (filtre: `statut`) |
| `GET` | `/admin/newsletter/subscribers/{id}` | Détail |
| `DELETE` | `/admin/newsletter/subscribers/{id}` | Supprimer |

### Demandes de visite

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/admin/visit-requests` | Lister (filtres: `status`, `type_visite`, `infrastructure_id`, `date_from`, `date_to`) |
| `GET` | `/admin/visit-requests/{id}` | Détail (avec relations infrastructure et user) |
| `PUT` | `/admin/visit-requests/{id}` | Modifier |
| `POST` | `/admin/visit-requests/{id}/confirm` | Confirmer |
| `POST` | `/admin/visit-requests/{id}/cancel` | Annuler |
| `DELETE` | `/admin/visit-requests/{id}` | Supprimer |

**`PUT /admin/visit-requests/{id}`**

```json
{
  "status": "confirmed",
  "user_id": 1,
  "notes_admin": "Visite confirmée pour 10h avec M. Kamga."
}
```

> **Valeurs `status`** : `pending`, `confirmed`, `cancelled`, `completed`

### Demandes de devis

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/admin/quote-requests` | Lister (filtres: `status`, `service_type`, `date_from`, `date_to`) |
| `GET` | `/admin/quote-requests/{id}` | Détail (avec relation user) |
| `PUT` | `/admin/quote-requests/{id}` | Modifier |
| `DELETE` | `/admin/quote-requests/{id}` | Supprimer |

**`PUT /admin/quote-requests/{id}`**

```json
{
  "status": "envoyé",
  "user_id": 1,
  "estimated_amount": 2500000,
  "notes_admin": "Devis envoyé par email le 30/03/2026."
}
```

> **Valeurs `status`** : `nouveau`, `en_cours`, `envoyé`, `accepte`, `refuse`

---

## 11. Admin — Fichiers & Stockage

> 🔒 Rôle `admin` ou `super_admin` requis.

### Fichiers

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/admin/files/images/upload` | Upload d'image (rate limit: uploads) |
| `DELETE` | `/admin/files/images` | Supprimer une image |
| `GET` | `/admin/files/images/info` | Informations sur une image |
| `GET` | `/admin/files/cvs/download` | Télécharger un CV |
| `DELETE` | `/admin/files/cvs` | Supprimer un CV |

### Stockage

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/admin/storage/stats` | Statistiques de stockage |
| `GET` | `/admin/storage/stats/all` | Statistiques complètes |
| `GET` | `/admin/storage/folder-size` | Taille d'un dossier |
| `GET` | `/admin/storage/health` | Santé du stockage |

---

## 12. Admin — Tableau de bord

> 🔒 Rôle `admin` ou `super_admin` requis.

### `GET /admin/dashboard/stats`

Statistiques globales (cache 5 minutes).

**Réponse 200 :**
```json
{
  "success": true,
  "message": "Statistiques du tableau de bord",
  "data": {
    "total_services": 8,
    "total_news": 25,
    "total_messages": 142,
    "total_users": 5,
    "unread_messages": 12,
    "active_services": 7,
    "published_news": 20,
    "active_users": 4
  }
}
```

### Métriques (Super Admin uniquement)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/admin/metrics/auth/today` | Métriques d'authentification du jour |
| `GET` | `/admin/metrics/auth/period` | Métriques sur une période |

---

## 13. Codes d'erreur

| Code | Signification | Exemple |
|------|--------------|---------|
| `200` | Succès | Opération réussie |
| `201` | Créé | Ressource créée avec succès |
| `304` | Non modifié | Contenu identique (ETag match) |
| `400` | Requête invalide | Tentative de restauration d'un élément non supprimé |
| `401` | Non authentifié | Token manquant ou expiré |
| `403` | Interdit | Rôle insuffisant pour cette action |
| `404` | Non trouvé | Ressource inexistante |
| `422` | Erreur de validation | Champs requis manquants ou invalides |
| `429` | Trop de requêtes | Rate limit dépassé |
| `500` | Erreur serveur | Erreur interne (message générique en production) |

### Rôles et permissions

| Rôle | Lecture admin | Écriture CRUD | Gestion utilisateurs | Métriques |
|------|-------------|---------------|---------------------|-----------|
| `editor` | ✅ | ❌ | ❌ | ❌ |
| `admin` | ✅ | ✅ | ✅ | ❌ |
| `super_admin` | ✅ | ✅ | ✅ | ✅ |

### Headers de sécurité

Toutes les réponses incluent automatiquement :
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000` (HTTPS uniquement)

### Cache HTTP

Les réponses GET publiques incluent des headers `Cache-Control`, `ETag` et compression `gzip` automatique pour les réponses > 1 Ko.

| Endpoints | Durée cache |
|-----------|-------------|
| Services, Partenaires, Infrastructures | 1 heure |
| Offres d'emploi, Annonces | 30 minutes |
| Actualités | 15 minutes |
| Routes admin | Pas de cache |
