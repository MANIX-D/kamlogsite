# Documentation des Modèles Laravel - KAMLOG

## 📋 Vue d'ensemble

Tous les modèles Eloquent ont été créés avec les fonctionnalités suivantes :
- ✅ Champs `fillable` pour la protection contre l'assignation de masse
- ✅ Relations `hasMany` et `belongsTo` appropriées
- ✅ Casts pour les types de données (JSON, dates, boolean)
- ✅ Soft Deletes pour la suppression logique
- ✅ Scopes pour les requêtes courantes
- ✅ Méthodes utilitaires

---

## 🗂️ Liste des Modèles

### 1. Service
**Fichier**: `app/Models/Service.php`

**Champs fillable**:
- `nom_fr`, `nom_en`
- `description_fr`, `description_en`
- `icon`, `image`
- `display_order`, `is_active`

**Casts**:
- `is_active` → boolean
- `display_order` → integer
- Dates automatiques

**Scopes**:
- `active()` - Services actifs
- `ordered()` - Triés par ordre d'affichage

**Relations**: Aucune

---

### 2. News
**Fichier**: `app/Models/News.php`

**Champs fillable**:
- `titre_fr`, `titre_en`
- `contenu_fr`, `contenu_en`
- `slug_fr`, `slug_en`
- `type`, `image`, `image_alt_fr`, `image_alt_en`
- `date_publication`, `is_published`, `is_featured`, `views`

**Casts**:
- `date_publication` → date
- `is_published`, `is_featured` → boolean
- `views` → integer

**Scopes**:
- `published()` - Actualités publiées
- `featured()` - Actualités en vedette
- `ofType($type)` - Filtrer par type
- `latest()` - Triées par date de publication

**Méthodes**:
- `incrementViews()` - Incrémenter les vues

**Relations**: Aucune

---

### 3. Partner
**Fichier**: `app/Models/Partner.php`

**Champs fillable**:
- `name_fr`, `name_en`
- `logo_url`, `description_fr`, `description_en`
- `category`, `website`, `email`, `phone`, `address`
- `partnership_level`, `display_order`, `is_active`, `is_featured`

**Casts**:
- `is_active`, `is_featured` → boolean
- `display_order` → integer

**Scopes**:
- `active()` - Partenaires actifs
- `featured()` - Partenaires en vedette
- `ofCategory($category)` - Filtrer par catégorie
- `ofLevel($level)` - Filtrer par niveau de partenariat
- `ordered()` - Triés par ordre d'affichage

**Relations**: Aucune

---

### 4. Infrastructure
**Fichier**: `app/Models/Infrastructure.php`

**Champs fillable**:
- `nom_fr`, `nom_en`
- `description_fr`, `description_en`
- `surface`, `capacite`, `image`, `image_alt_fr`, `image_alt_en`
- `type`, `equipements`, `specifications_techniques`
- `display_order`, `is_active`, `is_available`

**Casts**:
- `equipements` → array (JSON)
- `specifications_techniques` → array (JSON)
- `is_active`, `is_available` → boolean
- `display_order` → integer

**Scopes**:
- `active()` - Infrastructures actives
- `available()` - Infrastructures disponibles
- `ofType($type)` - Filtrer par type
- `ordered()` - Triées par ordre d'affichage

**Relations**:
- `visitRequests()` → hasMany(VisitRequest)

---

### 5. ContactMessage
**Fichier**: `app/Models/ContactMessage.php`

**Champs fillable**:
- `nom`, `email`, `telephone`, `entreprise`
- `sujet`, `message`, `statut`, `lu`
- `reponse`, `date_reponse`, `admin_user_id`

**Casts**:
- `lu` → boolean
- `date_reponse` → datetime

**Scopes**:
- `unread()` - Messages non lus
- `ofStatus($status)` - Filtrer par statut
- `new()` - Nouveaux messages

**Méthodes**:
- `markAsRead()` - Marquer comme lu
- `markAsUnread()` - Marquer comme non lu

**Relations**:
- `adminUser()` → belongsTo(AdminUser)

---

### 6. NewsletterSubscriber
**Fichier**: `app/Models/NewsletterSubscriber.php`

**Champs fillable**:
- `email`, `nom`, `prenom`, `entreprise`
- `statut`, `token_desinscription`
- `date_inscription`, `date_desinscription`, `ip_address`

**Casts**:
- `date_inscription`, `date_desinscription` → datetime

**Scopes**:
- `active()` - Abonnés actifs
- `unsubscribed()` - Désinscrits

**Méthodes**:
- `unsubscribe()` - Désinscrire
- `resubscribe()` - Réinscrire

**Boot**:
- Génération automatique du token de désinscription
- Date d'inscription automatique

**Relations**: Aucune

---

### 7. VisitRequest
**Fichier**: `app/Models/VisitRequest.php`

**Champs fillable**:
- `name`, `email`, `phone`, `company`
- `date`, `heure`, `type_visite`, `message`
- `status`, `notes_admin`
- `infrastructure_id`, `admin_user_id`

**Casts**:
- `date` → date
- `heure` → datetime

**Scopes**:
- `ofStatus($status)` - Filtrer par statut
- `pending()` - Demandes en attente
- `confirmed()` - Demandes confirmées
- `forDate($date)` - Filtrer par date

**Méthodes**:
- `confirm()` - Confirmer la demande
- `cancel()` - Annuler la demande
- `complete()` - Marquer comme complétée

**Relations**:
- `infrastructure()` → belongsTo(Infrastructure)
- `adminUser()` → belongsTo(AdminUser)

---

### 8. Announcement
**Fichier**: `app/Models/Announcement.php`

**Champs fillable**:
- `title_fr`, `title_en`
- `content_fr`, `content_en`
- `priority`, `type`, `is_active`, `is_popup`
- `start_date`, `end_date`
- `background_color`, `text_color`, `icon`
- `button_text_fr`, `button_text_en`, `button_url`

**Casts**:
- `is_active`, `is_popup` → boolean
- `start_date`, `end_date` → date

**Scopes**:
- `active()` - Annonces actives
- `current()` - Annonces en cours (dans la période)
- `popup()` - Annonces popup
- `ofPriority($priority)` - Filtrer par priorité
- `ofType($type)` - Filtrer par type
- `orderedByPriority()` - Triées par priorité

**Relations**: Aucune

---

### 9. JobOffer
**Fichier**: `app/Models/JobOffer.php`

**Champs fillable**:
- `title_fr`, `title_en`
- `description_fr`, `description_en`
- `requirements_fr`, `requirements_en`
- `benefits_fr`, `benefits_en`
- `contract_type`, `location`, `experience_level`
- `salary_range`, `department`, `application_deadline`
- `is_active`, `is_urgent`, `applications_count`

**Casts**:
- `application_deadline` → date
- `is_active`, `is_urgent` → boolean
- `applications_count` → integer

**Scopes**:
- `active()` - Offres actives
- `urgent()` - Offres urgentes
- `notExpired()` - Offres non expirées
- `ofContractType($type)` - Filtrer par type de contrat
- `ofExperienceLevel($level)` - Filtrer par niveau d'expérience
- `atLocation($location)` - Filtrer par localisation

**Méthodes**:
- `incrementApplicationsCount()` - Incrémenter le compteur
- `decrementApplicationsCount()` - Décrémenter le compteur

**Relations**:
- `jobApplications()` → hasMany(JobApplication)

---

### 10. JobApplication
**Fichier**: `app/Models/JobApplication.php`

**Champs fillable**:
- `job_offer_id`, `first_name`, `last_name`
- `email`, `phone`, `address`, `birth_date`
- `linkedin_url`, `portfolio_url`, `cover_letter`, `cv_path`
- `status`, `notes_admin`, `application_date`, `admin_user_id`

**Casts**:
- `birth_date` → date
- `application_date` → datetime

**Scopes**:
- `ofStatus($status)` - Filtrer par statut
- `pending()` - Candidatures en attente
- `inProgress()` - Candidatures en cours
- `accepted()` - Candidatures acceptées
- `rejected()` - Candidatures refusées

**Attributs calculés**:
- `full_name` - Nom complet

**Boot**:
- Date de candidature automatique
- Incrémentation/décrémentation du compteur de l'offre

**Relations**:
- `jobOffer()` → belongsTo(JobOffer)
- `adminUser()` → belongsTo(AdminUser)

---

### 11. QuoteRequest
**Fichier**: `app/Models/QuoteRequest.php`

**Champs fillable**:
- `company_name`, `contact_person`, `email`, `phone`, `address`
- `service_type`, `project_description`, `requirements`
- `budget_range`, `desired_start_date`, `desired_end_date`
- `priority`, `status`, `estimated_amount`
- `notes_admin`, `quote_document_path`, `admin_user_id`

**Casts**:
- `requirements` → array (JSON)
- `desired_start_date`, `desired_end_date` → date
- `estimated_amount` → decimal:2

**Scopes**:
- `ofStatus($status)` - Filtrer par statut
- `new()` - Nouvelles demandes
- `inProgress()` - Demandes en cours
- `ofPriority($priority)` - Filtrer par priorité
- `ofServiceType($type)` - Filtrer par type de service
- `orderedByPriority()` - Triées par priorité

**Relations**:
- `adminUser()` → belongsTo(AdminUser)

---

### 12. AdminUser
**Fichier**: `app/Models/AdminUser.php`

**Type**: Authenticatable (extends User)

**Traits**:
- `HasApiTokens` (Sanctum)
- `HasFactory`
- `Notifiable`
- `SoftDeletes`

**Champs fillable**:
- `name`, `email`, `password`
- `role`, `avatar`, `phone`
- `is_active`, `last_login_at`, `last_login_ip`

**Champs cachés**:
- `password`, `remember_token`

**Casts**:
- `email_verified_at`, `last_login_at` → datetime
- `is_active` → boolean
- `password` → hashed

**Scopes**:
- `active()` - Admins actifs
- `ofRole($role)` - Filtrer par rôle
- `superAdmins()` - Super admins uniquement

**Méthodes**:
- `isSuperAdmin()` - Vérifier si super admin
- `isAdmin()` - Vérifier si admin
- `isEditor()` - Vérifier si éditeur
- `updateLastLogin($ipAddress)` - Mettre à jour la dernière connexion

**Relations**:
- `contactMessages()` → hasMany(ContactMessage)
- `visitRequests()` → hasMany(VisitRequest)
- `jobApplications()` → hasMany(JobApplication)
- `quoteRequests()` → hasMany(QuoteRequest)

---

## 🔗 Diagramme des Relations

```
AdminUser
├── hasMany → ContactMessage
├── hasMany → VisitRequest
├── hasMany → JobApplication
└── hasMany → QuoteRequest

Infrastructure
└── hasMany → VisitRequest

JobOffer
└── hasMany → JobApplication

VisitRequest
├── belongsTo → Infrastructure
└── belongsTo → AdminUser

JobApplication
├── belongsTo → JobOffer
└── belongsTo → AdminUser

ContactMessage
└── belongsTo → AdminUser

QuoteRequest
└── belongsTo → AdminUser
```

---

## 📊 Utilisation des Scopes

### Exemples de requêtes courantes

```php
// Services actifs triés par ordre
$services = Service::active()->ordered()->get();

// Actualités publiées récentes
$news = News::published()->latest()->take(10)->get();

// Partenaires stratégiques actifs
$partners = Partner::active()->ofLevel('strategic')->get();

// Infrastructures disponibles de type entrepôt
$warehouses = Infrastructure::available()->ofType('entrepot')->get();

// Messages non lus
$unreadMessages = ContactMessage::unread()->get();

// Annonces actives en cours
$announcements = Announcement::active()->current()->orderedByPriority()->get();

// Offres d'emploi actives non expirées
$jobs = JobOffer::active()->notExpired()->get();

// Candidatures en attente pour une offre
$applications = JobApplication::where('job_offer_id', $id)->pending()->get();

// Demandes de devis urgentes
$quotes = QuoteRequest::ofPriority('urgente')->new()->get();
```

---

## ✅ Checklist de Validation

- [x] Tous les modèles créés (12 modèles)
- [x] Champs fillable définis
- [x] Relations configurées
- [x] Casts appropriés (JSON, dates, boolean)
- [x] Soft Deletes activés
- [x] Scopes utiles ajoutés
- [x] Méthodes utilitaires implémentées
- [x] Boot methods pour logique automatique
- [x] Protection contre l'assignation de masse
- [x] Documentation complète

---

## 🚀 Prochaines Étapes

1. Créer les contrôleurs API
2. Définir les routes
3. Implémenter la validation (FormRequests)
4. Configurer l'authentification Sanctum
5. Tester les endpoints
