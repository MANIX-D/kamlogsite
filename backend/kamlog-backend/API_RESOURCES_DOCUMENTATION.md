# Documentation - API Resources KAMLOG

## 📋 Vue d'ensemble

Système complet d'API Resources Laravel avec **22 Resources** et **11 Collections** pour formater les réponses JSON de manière standardisée.

### **Format de Réponse Standardisé**

Toutes les réponses API suivent ce format :

```json
{
  "success": true,
  "message": "Message descriptif",
  "data": { ... },
  "pagination": { ... }
}
```

---

## 📦 Resources Créées

### **Classes de Base** (2)

1. **BaseResource** - Classe parente pour toutes les resources
2. **BaseResourceCollection** - Classe parente pour toutes les collections

### **Resources par Modèle** (11 x 2 = 22)

| Modèle | Resource | Collection |
|--------|----------|------------|
| Service | `ServiceResource` | `ServiceCollection` |
| News | `NewsResource` | `NewsCollection` |
| Partner | `PartnerResource` | `PartnerCollection` |
| Infrastructure | `InfrastructureResource` | `InfrastructureCollection` |
| JobOffer | `JobOfferResource` | `JobOfferCollection` |
| Announcement | `AnnouncementResource` | `AnnouncementCollection` |
| ContactMessage | `ContactMessageResource` | `ContactMessageCollection` |
| NewsletterSubscriber | `NewsletterSubscriberResource` | `NewsletterSubscriberCollection` |
| VisitRequest | `VisitRequestResource` | `VisitRequestCollection` |
| QuoteRequest | `QuoteRequestResource` | `QuoteRequestCollection` |
| User | `UserResource` | `UserCollection` |

---

## 🎯 BaseResource

### **Fonctionnalités**

```php
abstract class BaseResource extends JsonResource
{
    // Wrapper de réponse standardisé
    public function with(Request $request): array;
    
    // Message personnalisable
    protected function getMessage(): string;
    
    // Helpers de formatage
    protected function formatDate($date): ?string;
    protected function formatDateOnly($date): ?string;
    protected function formatBoolean($value): bool;
}
```

### **Méthodes Utilitaires**

**formatDate()** - Format complet avec heure
```php
$this->formatDate($this->created_at)
// "2026-03-25 13:04:00"
```

**formatDateOnly()** - Date uniquement
```php
$this->formatDateOnly($this->date_publication)
// "2026-03-25"
```

**formatBoolean()** - Conversion booléenne
```php
$this->formatBoolean($this->actif)
// true ou false (jamais 1 ou 0)
```

---

## 📚 BaseResourceCollection

### **Fonctionnalités**

```php
abstract class BaseResourceCollection extends ResourceCollection
{
    // Wrapper de collection
    public function toArray(Request $request): array;
    
    // Wrapper avec pagination
    public function with(Request $request): array;
    
    // Message personnalisable
    protected function getMessage(): string;
}
```

### **Pagination Automatique**

Si la collection est paginée, ajoute automatiquement :

```json
{
  "pagination": {
    "total": 150,
    "count": 12,
    "per_page": 12,
    "current_page": 1,
    "total_pages": 13,
    "from": 1,
    "to": 12
  }
}
```

---

## 💡 Exemples d'Utilisation

### **1. Resource Simple (Item Unique)**

**Dans le Contrôleur** :
```php
use App\Http\Resources\ServiceResource;

public function show($id)
{
    $service = Service::findOrFail($id);
    return new ServiceResource($service);
}
```

**Réponse JSON** :
```json
{
  "success": true,
  "message": "Service récupéré avec succès",
  "data": {
    "id": 1,
    "titre": "Transport Maritime",
    "slug": "transport-maritime",
    "description": "Service de transport maritime international",
    "icone": "ship",
    "image_url": "https://example.com/images/maritime.jpg",
    "ordre": 1,
    "actif": true,
    "created_at": "2026-03-25 10:00:00",
    "updated_at": "2026-03-25 12:00:00"
  }
}
```

---

### **2. Collection Simple (Liste)**

**Dans le Contrôleur** :
```php
use App\Http\Resources\ServiceCollection;

public function index()
{
    $services = Service::where('actif', true)->get();
    return new ServiceCollection($services);
}
```

**Réponse JSON** :
```json
{
  "success": true,
  "message": "Liste des services récupérée avec succès",
  "data": [
    {
      "id": 1,
      "titre": "Transport Maritime",
      "slug": "transport-maritime",
      "actif": true,
      ...
    },
    {
      "id": 2,
      "titre": "Transport Aérien",
      "slug": "transport-aerien",
      "actif": true,
      ...
    }
  ]
}
```

---

### **3. Collection Paginée**

**Dans le Contrôleur** :
```php
use App\Http\Resources\NewsCollection;

public function index(Request $request)
{
    $perPage = $request->input('per_page', 12);
    $news = News::published()->latest()->paginate($perPage);
    
    return new NewsCollection($news);
}
```

**Réponse JSON** :
```json
{
  "success": true,
  "message": "Liste des actualités récupérée avec succès",
  "data": [
    {
      "id": 1,
      "titre": "Nouvelle infrastructure à Douala",
      "slug": "nouvelle-infrastructure-douala",
      "contenu": "...",
      "type": "actualite",
      "vues": 150,
      "is_featured": true,
      "is_published": true,
      ...
    }
  ],
  "pagination": {
    "total": 150,
    "count": 12,
    "per_page": 12,
    "current_page": 1,
    "total_pages": 13,
    "from": 1,
    "to": 12
  }
}
```

---

### **4. Resource avec Relations**

**Ajouter des relations dans la Resource** :
```php
class NewsResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            // ... autres champs
            
            // Relation conditionnelle
            'auteur_details' => $this->when($this->relationLoaded('auteur'), function () {
                return new UserResource($this->auteur);
            }),
            
            // Relation toujours chargée
            'commentaires' => CommentResource::collection($this->whenLoaded('commentaires')),
        ];
    }
}
```

**Dans le Contrôleur** :
```php
public function show($id)
{
    $news = News::with(['auteur', 'commentaires'])->findOrFail($id);
    return new NewsResource($news);
}
```

---

### **5. Personnaliser le Message**

**Méthode 1 : Override dans la Resource**
```php
class ServiceResource extends BaseResource
{
    protected function getMessage(): string
    {
        return 'Service récupéré avec succès';
    }
}
```

**Méthode 2 : Message dynamique**
```php
class ServiceResource extends BaseResource
{
    protected function getMessage(): string
    {
        return $this->actif 
            ? 'Service actif récupéré' 
            : 'Service inactif récupéré';
    }
}
```

---

### **6. Champs Conditionnels**

```php
class UserResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'email' => $this->email,
            
            // Afficher seulement si admin
            'role' => $this->when(
                $request->user()?->role === 'super_admin',
                $this->role
            ),
            
            // Afficher seulement si c'est l'utilisateur lui-même
            'email_verified_at' => $this->when(
                $request->user()?->id === $this->id,
                $this->formatDate($this->email_verified_at)
            ),
        ];
    }
}
```

---

### **7. Merge de Données**

```php
class NewsResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'id' => $this->id,
            'titre' => $this->titre,
            // ...
            
            // Ajouter des champs calculés
            'is_recent' => $this->created_at->isAfter(now()->subDays(7)),
            'reading_time' => ceil(str_word_count(strip_tags($this->contenu)) / 200),
        ]);
    }
}
```

---

## 🎨 Exemples par Modèle

### **Services**

```php
// Liste tous les services actifs
GET /api/v1/services
```

```json
{
  "success": true,
  "message": "Liste des services récupérée avec succès",
  "data": [
    {
      "id": 1,
      "titre": "Transport Maritime",
      "slug": "transport-maritime",
      "description": "Service de transport maritime international",
      "icone": "ship",
      "image_url": "https://cdn.kamlog.com/images/maritime.jpg",
      "ordre": 1,
      "actif": true,
      "created_at": "2026-01-15 10:00:00",
      "updated_at": "2026-03-20 14:30:00"
    }
  ]
}
```

---

### **News (Actualités)**

```php
// Liste paginée des actualités publiées
GET /api/v1/news?per_page=12&page=1
```

```json
{
  "success": true,
  "message": "Liste des actualités récupérée avec succès",
  "data": [
    {
      "id": 1,
      "titre": "KAMLOG ouvre une nouvelle plateforme logistique",
      "slug": "kamlog-nouvelle-plateforme-logistique",
      "contenu": "<p>Contenu complet de l'actualité...</p>",
      "extrait": "KAMLOG annonce l'ouverture d'une nouvelle plateforme...",
      "image_url": "https://cdn.kamlog.com/news/plateforme-2026.jpg",
      "type": "actualite",
      "auteur": "Jean Dupont",
      "date_publication": "2026-03-25 09:00:00",
      "vues": 1250,
      "is_featured": true,
      "is_published": true,
      "meta_description": "KAMLOG renforce sa présence avec une nouvelle plateforme",
      "meta_keywords": "kamlog, logistique, plateforme, cameroun",
      "created_at": "2026-03-24 15:00:00",
      "updated_at": "2026-03-25 08:00:00",
      "deleted_at": null
    }
  ],
  "pagination": {
    "total": 45,
    "count": 12,
    "per_page": 12,
    "current_page": 1,
    "total_pages": 4,
    "from": 1,
    "to": 12
  }
}
```

---

### **Partners (Partenaires)**

```php
// Un partenaire spécifique
GET /api/v1/partners/3
```

```json
{
  "success": true,
  "message": "Partenaire récupéré avec succès",
  "data": {
    "id": 3,
    "nom": "Maersk Line",
    "logo_url": "https://cdn.kamlog.com/partners/maersk.png",
    "site_web": "https://www.maersk.com",
    "description": "Leader mondial du transport maritime conteneurisé",
    "type": "strategique",
    "ordre": 1,
    "actif": true,
    "created_at": "2025-06-10 12:00:00",
    "updated_at": "2026-02-15 10:30:00"
  }
}
```

---

### **Infrastructures**

```php
// Liste des infrastructures
GET /api/v1/infrastructures
```

```json
{
  "success": true,
  "message": "Liste des infrastructures récupérée avec succès",
  "data": [
    {
      "id": 1,
      "nom": "Plateforme Logistique de Douala",
      "type": "plateforme",
      "adresse": "Zone Industrielle Bonabéri",
      "ville": "Douala",
      "pays": "Cameroun",
      "superficie": 15000,
      "capacite": "50000 palettes",
      "description": "Plateforme moderne équipée...",
      "image_url": "https://cdn.kamlog.com/infra/douala.jpg",
      "latitude": 4.0511,
      "longitude": 9.7679,
      "actif": true,
      "created_at": "2025-01-20 09:00:00",
      "updated_at": "2026-03-10 16:00:00"
    }
  ]
}
```

---

### **Job Offers (Offres d'Emploi)**

```php
// Offres d'emploi actives
GET /api/v1/job-offers?actif=1
```

```json
{
  "success": true,
  "message": "Liste des offres d'emploi récupérée avec succès",
  "data": [
    {
      "id": 5,
      "titre": "Responsable Logistique",
      "description": "Nous recherchons un responsable logistique expérimenté...",
      "type_contrat": "CDI",
      "localisation": "Douala, Cameroun",
      "salaire": "À négocier selon profil",
      "experience_requise": "5 ans minimum",
      "niveau_etude": "Bac+5 en Logistique/Supply Chain",
      "competences": "Gestion d'équipe, SAP, Anglais courant",
      "date_limite": "2026-04-30 23:59:59",
      "actif": true,
      "created_at": "2026-03-15 10:00:00",
      "updated_at": "2026-03-20 14:00:00"
    }
  ]
}
```

---

### **Contact Messages**

```php
// Messages de contact (admin)
GET /api/v1/admin/contact-messages?statut=nouveau
```

```json
{
  "success": true,
  "message": "Liste des messages de contact récupérée avec succès",
  "data": [
    {
      "id": 12,
      "nom": "Marie Kouam",
      "email": "marie.kouam@example.com",
      "telephone": "+237 6 XX XX XX XX",
      "sujet": "Demande d'information transport",
      "message": "Bonjour, je souhaiterais obtenir des informations...",
      "statut": "nouveau",
      "reponse": null,
      "date_reponse": null,
      "created_at": "2026-03-25 11:30:00",
      "updated_at": "2026-03-25 11:30:00"
    }
  ]
}
```

---

## 🔧 Utilisation Avancée

### **1. Réponse Personnalisée**

```php
// Créer une réponse custom
return (new ServiceResource($service))
    ->additional([
        'meta' => [
            'version' => '1.0',
            'generated_at' => now()->toIso8601String(),
        ]
    ]);
```

**Résultat** :
```json
{
  "success": true,
  "message": "Service récupéré avec succès",
  "data": { ... },
  "meta": {
    "version": "1.0",
    "generated_at": "2026-03-25T13:04:00+01:00"
  }
}
```

---

### **2. Cacher des Champs**

```php
class UserResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'email' => $this->email,
            
            // Ne jamais exposer le mot de passe
            // 'password' => JAMAIS !
            
            // Exposer seulement aux admins
            $this->mergeWhen($request->user()?->isAdmin(), [
                'role' => $this->role,
                'created_at' => $this->formatDate($this->created_at),
            ]),
        ];
    }
}
```

---

### **3. Transformer les Valeurs**

```php
class NewsResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            
            // Transformer le type avec l'enum
            'type' => [
                'value' => $this->type,
                'label' => \App\Enums\NewsType::from($this->type)->label(),
            ],
            
            // Formater le contenu
            'contenu' => strip_tags($this->contenu),
            'contenu_html' => $this->contenu,
            
            // Calculer des métriques
            'stats' => [
                'vues' => $this->vues,
                'popularite' => $this->vues > 1000 ? 'haute' : 'normale',
            ],
        ];
    }
}
```

---

## ✅ Checklist Utilisation

**Dans les Contrôleurs** :
- [ ] Utiliser `ServiceResource` pour un item unique
- [ ] Utiliser `ServiceCollection` pour une liste
- [ ] Paginer les collections avec `paginate()`
- [ ] Charger les relations avec `with()` si nécessaire

**Bonnes Pratiques** :
- [ ] Ne jamais exposer de données sensibles (password, tokens)
- [ ] Utiliser `when()` pour les champs conditionnels
- [ ] Formater les dates avec `formatDate()`
- [ ] Formater les booléens avec `formatBoolean()`
- [ ] Personnaliser les messages avec `getMessage()`

**Performance** :
- [ ] Éviter le N+1 problem (utiliser `with()`)
- [ ] Paginer les grandes collections
- [ ] Cacher les resources si nécessaire

---

## 🎯 Résumé

Le système d'API Resources KAMLOG est maintenant **complet et standardisé** avec :

✅ **24 Resources** - Toutes les entités couvertes  
✅ **Format standardisé** - success, message, data, pagination  
✅ **BaseResource** - Classe parente avec helpers  
✅ **BaseResourceCollection** - Pagination automatique  
✅ **Messages personnalisés** - Par resource  
✅ **Formatage dates** - Cohérent partout  
✅ **Formatage booléens** - true/false (pas 1/0)  
✅ **Champs conditionnels** - Sécurité renforcée  
✅ **Relations** - Support complet  
✅ **Production ready** - Déploiement immédiat  

**Les API Resources sont prêtes pour la production !** 🚀
