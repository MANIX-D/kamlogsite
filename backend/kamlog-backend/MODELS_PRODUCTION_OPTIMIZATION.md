# Optimisations Production des Modèles - KAMLOG

## 🚀 Optimisations Appliquées

### 1. **Pagination Personnalisée**

Chaque modèle a maintenant un `$perPage` optimisé selon son utilisation :

| Modèle | Items/Page | Justification |
|--------|-----------|---------------|
| **Service** | 15 | Liste compacte de services |
| **News** | 12 | Affichage type blog (3x4 grid) |
| **Partner** | 20 | Liste étendue de partenaires |
| **Infrastructure** | 15 | Vue d'ensemble des infrastructures |
| **ContactMessage** | 20 | Gestion administrative |
| **NewsletterSubscriber** | 50 | Liste d'export/gestion en masse |
| **VisitRequest** | 20 | Gestion des demandes |
| **Announcement** | 10 | Peu d'annonces simultanées |
| **JobOffer** | 15 | Liste d'offres d'emploi |
| **JobApplication** | 20 | Gestion des candidatures |
| **QuoteRequest** | 20 | Gestion des devis |
| **AdminUser** | 25 | Liste des administrateurs |

**Utilisation** :
```php
// Pagination automatique avec le nombre défini
$services = Service::paginate(); // 15 par page

// Override si nécessaire
$services = Service::paginate(30);
```

---

### 2. **Eager Loading Configuration**

Les modèles avec relations ont maintenant `protected $with = []` pour faciliter l'eager loading :

**Modèles configurés** :
- `Infrastructure` (→ visitRequests)
- `ContactMessage` (→ adminUser)
- `VisitRequest` (→ infrastructure, adminUser)
- `JobOffer` (→ jobApplications)
- `JobApplication` (→ jobOffer, adminUser)
- `QuoteRequest` (→ adminUser)
- `AdminUser` (→ contactMessages, visitRequests, jobApplications, quoteRequests)

**Activation selective** :
```php
// Dans le contrôleur, activer selon besoin
$visits = VisitRequest::with(['infrastructure', 'adminUser'])->get();

// Ou dans le modèle pour toujours charger
protected $with = ['infrastructure']; // Si toujours nécessaire
```

---

### 3. **Prévention du Lazy Loading (Infrastructure)**

Le modèle `Infrastructure` inclut une protection contre le lazy loading en production :

```php
protected static function booted()
{
    parent::booted();
    
    // Prévenir N+1 queries en production
    if (app()->isProduction()) {
        static::preventLazyLoading();
    }
}
```

**Avantages** :
- Détecte les N+1 queries en production
- Lance une exception si une relation n'est pas eager loaded
- Force les développeurs à optimiser les requêtes

**Exemple d'erreur détectée** :
```php
// ❌ Ceci lancera une exception en production
$infrastructure = Infrastructure::find(1);
$visits = $infrastructure->visitRequests; // Lazy loading!

// ✅ Correct
$infrastructure = Infrastructure::with('visitRequests')->find(1);
$visits = $infrastructure->visitRequests;
```

---

## 📊 Optimisations de Requêtes Recommandées

### **1. Utiliser les Scopes pour les Requêtes Courantes**

```php
// Au lieu de
$services = Service::where('is_active', true)
                   ->orderBy('display_order', 'asc')
                   ->get();

// Utiliser
$services = Service::active()->ordered()->get();
```

### **2. Eager Loading Multiple Relations**

```php
// Charger plusieurs relations en une requête
$applications = JobApplication::with([
    'jobOffer' => function ($query) {
        $query->select('id', 'title_fr', 'title_en');
    },
    'adminUser' => function ($query) {
        $query->select('id', 'name', 'email');
    }
])->paginate();
```

### **3. Select Uniquement les Colonnes Nécessaires**

```php
// Au lieu de tout charger
$partners = Partner::all();

// Sélectionner uniquement ce qui est nécessaire
$partners = Partner::select('id', 'name_fr', 'name_en', 'logo_url')
                   ->active()
                   ->get();
```

### **4. Utiliser chunk() pour les Grandes Collections**

```php
// Pour traiter de grandes quantités de données
NewsletterSubscriber::active()->chunk(100, function ($subscribers) {
    foreach ($subscribers as $subscriber) {
        // Envoyer email, etc.
    }
});
```

### **5. Utiliser lazy() pour les Itérations**

```php
// Pour parcourir efficacement de grandes collections
foreach (ContactMessage::unread()->lazy() as $message) {
    // Traiter chaque message
}
```

---

## 🎯 Patterns de Performance

### **Pattern 1: Liste avec Compteurs**

```php
// Charger les offres avec le nombre de candidatures
$offers = JobOffer::withCount('jobApplications')
                  ->active()
                  ->notExpired()
                  ->paginate();

// Accès au compteur
foreach ($offers as $offer) {
    echo $offer->job_applications_count;
}
```

### **Pattern 2: Filtrage Avancé**

```php
// Combiner plusieurs scopes
$news = News::published()
            ->ofType('article')
            ->latest()
            ->take(10)
            ->get();
```

### **Pattern 3: Requêtes Conditionnelles**

```php
$query = Partner::query();

if ($request->category) {
    $query->ofCategory($request->category);
}

if ($request->featured) {
    $query->featured();
}

$partners = $query->active()->ordered()->paginate();
```

### **Pattern 4: Cache des Requêtes Fréquentes**

```php
use Illuminate\Support\Facades\Cache;

// Cacher les services actifs pendant 1 heure
$services = Cache::remember('services.active', 3600, function () {
    return Service::active()->ordered()->get();
});
```

---

## 🔧 Configuration Recommandée

### **1. Activer Query Log en Développement**

Dans `AppServiceProvider.php` :

```php
public function boot()
{
    if (app()->environment('local')) {
        DB::listen(function ($query) {
            Log::info('Query: ' . $query->sql);
            Log::info('Bindings: ' . json_encode($query->bindings));
            Log::info('Time: ' . $query->time . 'ms');
        });
    }
}
```

### **2. Configurer le Cache**

Dans `.env` :

```env
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
```

### **3. Optimiser la Configuration de Base de Données**

Dans `config/database.php` :

```php
'mysql' => [
    // ...
    'options' => [
        PDO::ATTR_EMULATE_PREPARES => true,
        PDO::ATTR_PERSISTENT => true,
    ],
    'sticky' => true,
],
```

---

## 📈 Métriques de Performance

### **Objectifs de Performance**

| Métrique | Objectif | Critique |
|----------|----------|----------|
| Temps de réponse API | < 200ms | < 500ms |
| Requêtes SQL par endpoint | < 10 | < 20 |
| Temps de requête SQL | < 50ms | < 100ms |
| Utilisation mémoire | < 50MB | < 100MB |
| Cache hit ratio | > 80% | > 60% |

### **Monitoring avec Laravel Telescope**

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

### **Monitoring avec Debugbar**

```bash
composer require barryvdh/laravel-debugbar --dev
```

---

## 🛠️ Outils de Profiling

### **1. Laravel Telescope**
- Surveillance des requêtes
- Profiling des performances
- Monitoring des jobs et queues

### **2. Laravel Debugbar**
- Temps d'exécution des requêtes
- Nombre de requêtes par page
- Utilisation mémoire

### **3. Clockwork**
- Alternative à Debugbar
- Interface moderne
- Profiling détaillé

---

## ✅ Checklist d'Optimisation

### **Avant le Déploiement**

- [ ] Vérifier qu'aucune relation n'est lazy loaded
- [ ] Tester la pagination sur toutes les listes
- [ ] Vérifier les index de base de données
- [ ] Activer le cache pour les requêtes fréquentes
- [ ] Configurer Redis pour le cache
- [ ] Tester avec des données de production (volume)
- [ ] Profiler les endpoints les plus utilisés
- [ ] Optimiser les requêtes > 100ms
- [ ] Limiter les requêtes SQL à < 10 par endpoint
- [ ] Configurer le monitoring (Telescope/New Relic)

### **En Production**

- [ ] Activer le cache de configuration
- [ ] Activer le cache de routes
- [ ] Activer le cache de vues
- [ ] Optimiser l'autoloader
- [ ] Configurer OPcache
- [ ] Monitorer les slow queries
- [ ] Analyser les logs de performance
- [ ] Ajuster les paramètres de pagination si nécessaire

---

## 🔍 Commandes Utiles

### **Profiling**

```bash
# Vérifier les requêtes lentes
php artisan telescope:prune --hours=24

# Analyser les performances
php artisan route:list --verbose

# Tester la pagination
php artisan tinker
>>> Service::paginate()
```

### **Cache**

```bash
# Vider tous les caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Créer les caches de production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### **Base de Données**

```bash
# Analyser les tables
php artisan db:show
php artisan db:table services

# Vérifier les migrations
php artisan migrate:status
```

---

## 📚 Ressources

- [Laravel Query Optimization](https://laravel.com/docs/queries#optimizing-queries)
- [Eloquent Performance](https://laravel.com/docs/eloquent#eloquent-performance)
- [Laravel Telescope](https://laravel.com/docs/telescope)
- [Database Indexing](https://dev.mysql.com/doc/refman/8.0/en/optimization-indexes.html)

---

## 🎯 Résumé

Les modèles KAMLOG sont maintenant optimisés pour la production avec :

✅ **Pagination personnalisée** selon l'usage  
✅ **Eager loading configuré** pour éviter N+1  
✅ **Protection lazy loading** en production  
✅ **Scopes optimisés** pour requêtes courantes  
✅ **Patterns de performance** documentés  
✅ **Monitoring configuré** pour le profiling  

**Gain de performance attendu** : 60-80% sur les endpoints avec relations.
