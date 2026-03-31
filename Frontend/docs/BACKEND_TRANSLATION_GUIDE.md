# Guide de Traduction Backend Laravel - KAMLOG

## 📚 Vue d'ensemble

Ce guide explique comment le système de traduction fonctionne entre le frontend React et le backend Laravel pour gérer automatiquement les contenus multilingues (FR/EN).

---

## 🎯 Principe de Fonctionnement

### 1. Stockage des Données

Dans la base de données MySQL, chaque contenu traduisible est stocké avec des colonnes séparées pour chaque langue :

```sql
CREATE TABLE actualites (
    id BIGINT PRIMARY KEY,
    titre_fr VARCHAR(255),      -- Titre en français
    titre_en VARCHAR(255),      -- Titre en anglais
    contenu_fr TEXT,            -- Contenu en français
    contenu_en TEXT,            -- Contenu en anglais
    type ENUM('article', 'annonce', 'offre'),
    image VARCHAR(255),
    date_publication DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 2. Détection de la Langue

Le frontend React envoie automatiquement la langue active dans le header HTTP :

```javascript
// Frontend : src/services/apiClient.ts
const currentLanguage = localStorage.getItem('i18nextLng') || 'fr';
config.headers['Accept-Language'] = currentLanguage;
```

**Headers envoyés :**
- Si l'utilisateur est en français : `Accept-Language: fr`
- Si l'utilisateur est en anglais : `Accept-Language: en`

### 3. Traitement Côté Backend

Le contrôleur Laravel récupère le header et retourne les données dans la bonne langue :

**Fichier : `app/Http/Controllers/Api/ActualiteController.php`**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Actualite;
use Illuminate\Http\Request;

class ActualiteController extends Controller
{
    /**
     * Liste toutes les actualités dans la langue demandée
     */
    public function index(Request $request)
    {
        // 1. Récupérer la langue depuis le header
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'en']) ? $locale : 'fr';

        // 2. Récupérer les données depuis la base de données
        $actualites = Actualite::orderBy('date_publication', 'desc')
            ->get()
            ->map(function ($actualite) use ($locale) {
                // 3. Retourner les champs traduits selon la langue
                return [
                    'id' => $actualite->id,
                    'title' => $locale === 'en' ? $actualite->titre_en : $actualite->titre_fr,
                    'excerpt' => substr($locale === 'en' ? $actualite->contenu_en : $actualite->contenu_fr, 0, 150) . '...',
                    'content' => $locale === 'en' ? $actualite->contenu_en : $actualite->contenu_fr,
                    'type' => $actualite->type,
                    'image_url' => $actualite->image,
                    'published_at' => $actualite->date_publication,
                    'created_at' => $actualite->created_at,
                ];
            });

        return response()->json($actualites);
    }

    /**
     * Affiche une actualité spécifique dans la langue demandée
     */
    public function show(Request $request, $id)
    {
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'en']) ? $locale : 'fr';

        $actualite = Actualite::findOrFail($id);

        return [
            'id' => $actualite->id,
            'title' => $locale === 'en' ? $actualite->titre_en : $actualite->titre_fr,
            'content' => $locale === 'en' ? $actualite->contenu_en : $actualite->contenu_fr,
            'type' => $actualite->type,
            'image_url' => $actualite->image,
            'published_at' => $actualite->date_publication,
            'created_at' => $actualite->created_at,
        ];
    }
}
```

---

## 🔧 Appliquer le Même Système aux Autres Entités

### Services

**Fichier : `app/Http/Controllers/Api/ServiceController.php`**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'en']) ? $locale : 'fr';

        $services = Service::where('is_active', true)
            ->orderBy('display_order')
            ->get()
            ->map(function ($service) use ($locale) {
                return [
                    'id' => $service->id,
                    'name' => $locale === 'en' ? $service->nom_en : $service->nom_fr,
                    'description' => $locale === 'en' ? $service->description_en : $service->description_fr,
                    'icon' => $service->icon,
                    'display_order' => $service->display_order,
                ];
            });

        return response()->json($services);
    }
}
```

### Partenaires

**Fichier : `app/Http/Controllers/Api/PartnerController.php`**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'en']) ? $locale : 'fr';

        $partners = Partner::where('is_active', true)
            ->orderBy('display_order')
            ->get()
            ->map(function ($partner) use ($locale) {
                return [
                    'id' => $partner->id,
                    'name' => $locale === 'en' ? $partner->name_en : $partner->name_fr,
                    'description' => $locale === 'en' ? $partner->description_en : $partner->description_fr,
                    'logo_url' => $partner->logo_url,
                    'category' => $partner->category,
                    'website' => $partner->website,
                ];
            });

        return response()->json($partners);
    }
}
```

### Infrastructures

**Fichier : `app/Http/Controllers/Api/InfrastructureController.php`**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Infrastructure;
use Illuminate\Http\Request;

class InfrastructureController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'en']) ? $locale : 'fr';

        $infrastructures = Infrastructure::where('is_active', true)
            ->orderBy('display_order')
            ->get()
            ->map(function ($infra) use ($locale) {
                return [
                    'id' => $infra->id,
                    'name' => $locale === 'en' ? $infra->nom_en : $infra->nom_fr,
                    'description' => $locale === 'en' ? $infra->description_en : $infra->description_fr,
                    'surface' => $infra->surface,
                    'capacite' => $infra->capacite,
                    'image' => $infra->image,
                ];
            });

        return response()->json($infrastructures);
    }
}
```

### Annonces (Announcements)

**Fichier : `app/Http/Controllers/Api/AnnouncementController.php`**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'en']) ? $locale : 'fr';

        $announcements = Announcement::where('is_active', true)
            ->whereDate('start_date', '<=', now())
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', now());
            })
            ->orderByDesc('priority')
            ->get()
            ->map(function ($announcement) use ($locale) {
                return [
                    'id' => $announcement->id,
                    'title' => $locale === 'en' ? $announcement->title_en : $announcement->title_fr,
                    'content' => $locale === 'en' ? $announcement->content_en : $announcement->content_fr,
                    'priority' => $announcement->priority,
                    'start_date' => $announcement->start_date,
                    'end_date' => $announcement->end_date,
                ];
            });

        return response()->json($announcements);
    }
}
```

### Offres d'Emploi (Job Offers)

**Fichier : `app/Http/Controllers/Api/JobOfferController.php`**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobOffer;
use Illuminate\Http\Request;

class JobOfferController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'en']) ? $locale : 'fr';

        $jobOffers = JobOffer::where('is_active', true)
            ->whereDate('application_deadline', '>=', now())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($job) use ($locale) {
                return [
                    'id' => $job->id,
                    'title' => $locale === 'en' ? $job->title_en : $job->title_fr,
                    'description' => $locale === 'en' ? $job->description_en : $job->description_fr,
                    'requirements' => $locale === 'en' ? $job->requirements_en : $job->requirements_fr,
                    'contract_type' => $job->contract_type,
                    'location' => $job->location,
                    'experience_level' => $job->experience_level,
                    'salary_range' => $job->salary_range,
                    'application_deadline' => $job->application_deadline,
                ];
            });

        return response()->json($jobOffers);
    }

    public function show(Request $request, $id)
    {
        $locale = $request->header('Accept-Language', 'fr');
        $locale = in_array($locale, ['fr', 'en']) ? $locale : 'fr';

        $job = JobOffer::where('is_active', true)->findOrFail($id);

        return [
            'id' => $job->id,
            'title' => $locale === 'en' ? $job->title_en : $job->title_fr,
            'description' => $locale === 'en' ? $job->description_en : $job->description_fr,
            'requirements' => $locale === 'en' ? $job->requirements_en : $job->requirements_fr,
            'contract_type' => $job->contract_type,
            'location' => $job->location,
            'experience_level' => $job->experience_level,
            'salary_range' => $job->salary_range,
            'application_deadline' => $job->application_deadline,
        ];
    }
}
```

---

## 📝 Routes API à Configurer

**Fichier : `routes/api.php`**

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ActualiteController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\InfrastructureController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\JobOfferController;

// Routes publiques avec traduction automatique
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/actualites', [ActualiteController::class, 'index']);
Route::get('/actualites/{id}', [ActualiteController::class, 'show']);
Route::get('/partners', [PartnerController::class, 'index']);
Route::get('/infrastructures', [InfrastructureController::class, 'index']);
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/job-offers', [JobOfferController::class, 'index']);
Route::get('/job-offers/{id}', [JobOfferController::class, 'show']);
```

---

## ✅ Checklist de Vérification

### Côté Frontend (Déjà fait ✓)
- [x] Le header `Accept-Language` est envoyé automatiquement
- [x] La langue active est stockée dans `localStorage`
- [x] Le changement de langue via le composant `LanguageSwitcher` met à jour `i18next`

### Côté Backend (À faire)
- [ ] Créer les contrôleurs avec la logique de traduction
- [ ] Configurer les routes dans `routes/api.php`
- [ ] Tester les endpoints avec Postman en changeant le header `Accept-Language`

---

## 🧪 Tester la Traduction

### Avec cURL

```bash
# Tester en français
curl -H "Accept-Language: fr" http://localhost:8000/api/actualites

# Tester en anglais
curl -H "Accept-Language: en" http://localhost:8000/api/actualites
```

### Avec Postman

1. Créer une nouvelle requête GET vers `http://localhost:8000/api/actualites`
2. Ajouter un header : `Accept-Language` avec valeur `fr` ou `en`
3. Envoyer la requête
4. Vérifier que les champs `title` et `content` sont dans la langue demandée

---

## 🎉 Résultat Final

Quand l'utilisateur change de langue sur le site web :

1. Le frontend détecte le changement via `i18next`
2. La langue est sauvegardée dans `localStorage`
3. Toutes les requêtes API incluent automatiquement le header `Accept-Language`
4. Le backend Laravel retourne les données dans la langue demandée
5. L'interface s'affiche automatiquement dans la bonne langue

**Aucune action manuelle de l'utilisateur n'est nécessaire, tout est automatique !**

---

## 📚 Ressources

- [Documentation Laravel Localization](https://laravel.com/docs/10.x/localization)
- [Documentation i18next](https://www.i18next.com/)
- [HTTP Accept-Language Header](https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Accept-Language)
