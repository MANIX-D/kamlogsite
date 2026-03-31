# Guide d'Optimisation Production - KAMLOG Backend

## 📊 Optimisations Appliquées

### 1. Index de Base de Données

Tous les index ont été ajoutés pour optimiser les requêtes fréquentes :

#### **Services**
- Index sur `is_active`, `display_order`
- Index composite : `(is_active, display_order)`

#### **News**
- Index sur `type`, `date_publication`, `is_published`, `is_featured`
- Index composites : 
  - `(is_published, date_publication)`
  - `(type, is_published)`

#### **Partners**
- Index sur `category`, `is_active`, `is_featured`, `display_order`, `partnership_level`
- Index composites :
  - `(is_active, display_order)`
  - `(category, is_active)`

#### **Infrastructures**
- Index sur `type`, `is_active`, `is_available`, `display_order`
- Index composites :
  - `(is_active, is_available)`
  - `(type, is_active)`

#### **Contact Messages**
- Index sur `email`, `statut`, `lu`, `created_at`
- Index composites :
  - `(statut, lu)`
  - `(statut, created_at)`

#### **Newsletter Subscribers**
- Index sur `statut`, `date_inscription`
- Index composite : `(statut, date_inscription)`

#### **Visit Requests**
- Index sur `email`, `date`, `status`, `type_visite`
- Index composites :
  - `(status, date)`
  - `(date, status)`

#### **Announcements**
- Index sur `is_active`, `priority`, `type`, `start_date`, `end_date`
- Index composites :
  - `(is_active, start_date, end_date)`
  - `(priority, is_active)`

#### **Job Offers**
- Index sur `is_active`, `is_urgent`, `contract_type`, `experience_level`, `location`, `application_deadline`
- Index composites :
  - `(is_active, application_deadline)`
  - `(contract_type, is_active)`
  - `(location, is_active)`

#### **Job Applications**
- Index sur `email`, `status`, `application_date`
- Index composites :
  - `(job_offer_id, status)`
  - `(status, application_date)`

#### **Quote Requests**
- Index sur `email`, `status`, `priority`, `service_type`, `created_at`
- Index composites :
  - `(status, priority)`
  - `(service_type, status)`
  - `(status, created_at)`

#### **Admin Users**
- Index sur `role`, `is_active`, `last_login_at`
- Index composite : `(is_active, role)`

---

## 🔧 Configuration MySQL Recommandée

### Fichier `my.cnf` ou `my.ini`

```ini
[mysqld]
# InnoDB Buffer Pool (75% de la RAM disponible pour MySQL)
innodb_buffer_pool_size = 2G

# Fichiers de log InnoDB
innodb_log_file_size = 512M
innodb_log_buffer_size = 16M

# Optimisation des connexions
max_connections = 200
max_allowed_packet = 64M

# Table Cache
table_open_cache = 4000
table_definition_cache = 2000

# Thread Cache
thread_cache_size = 50

# Optimisation InnoDB
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
innodb_file_per_table = 1

# Optimisation des lectures
read_buffer_size = 2M
read_rnd_buffer_size = 4M
sort_buffer_size = 4M
join_buffer_size = 4M

# Slow Query Log
slow_query_log = 1
long_query_time = 2
log_queries_not_using_indexes = 1
slow_query_log_file = /var/log/mysql/slow-query.log

# Character Set
character_set_server = utf8mb4
collation_server = utf8mb4_unicode_ci

# Timezone
default_time_zone = '+01:00'
```

---

## 🚀 Optimisations Laravel

### 1. Cache de Configuration

```bash
# En production, toujours mettre en cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### 2. Optimisation de l'Autoloader

```bash
composer install --optimize-autoloader --no-dev
```

### 3. Configuration `.env` Production

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kamlog
DB_USERNAME=kamlog_user
DB_PASSWORD=secure_password_here

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Logs
LOG_CHANNEL=daily
LOG_LEVEL=error
```

### 4. Eager Loading dans les Modèles

Toujours utiliser `with()` pour éviter le problème N+1 :

```php
// Bon
$news = News::with(['author', 'category'])->get();

// Mauvais
$news = News::all(); // N+1 queries
```

---

## 📈 Monitoring et Maintenance

### Commandes Utiles

#### Analyser les tables
```sql
ANALYZE TABLE services, news, partners, infrastructures, 
contact_messages, newsletter_subscribers, visit_requests, 
announcements, job_offers, job_applications, quote_requests, admin_users;
```

#### Vérifier la taille des tables
```sql
SELECT 
    table_name, 
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)" 
FROM information_schema.TABLES 
WHERE table_schema = "kamlog" 
ORDER BY (data_length + index_length) DESC;
```

#### Vérifier les index non utilisés
```sql
SELECT * FROM sys.schema_unused_indexes 
WHERE object_schema = "kamlog";
```

#### Vérifier les requêtes lentes
```sql
SELECT * FROM mysql.slow_log 
ORDER BY query_time DESC 
LIMIT 20;
```

### Plan de Maintenance

#### **Quotidien**
- ✅ Vérifier les logs de requêtes lentes
- ✅ Monitorer l'utilisation du buffer pool
- ✅ Vérifier les erreurs dans les logs Laravel

#### **Hebdomadaire**
- ✅ Exécuter `ANALYZE TABLE` pour mettre à jour les statistiques
- ✅ Vérifier la fragmentation des tables
- ✅ Nettoyer les sessions expirées
- ✅ Vérifier l'espace disque

#### **Mensuel**
- ✅ Exécuter `OPTIMIZE TABLE` pour défragmenter
- ✅ Réviser les index non utilisés
- ✅ Analyser les performances des requêtes
- ✅ Backup complet de la base de données
- ✅ Tester la restauration des backups

---

## 🔒 Sécurité en Production

### 1. Permissions Fichiers

```bash
# Propriétaire des fichiers
chown -R www-data:www-data /path/to/kamlog-backend

# Permissions
find /path/to/kamlog-backend -type f -exec chmod 644 {} \;
find /path/to/kamlog-backend -type d -exec chmod 755 {} \;

# Storage et cache
chmod -R 775 storage bootstrap/cache
```

### 2. Configuration Serveur Web

#### Nginx
```nginx
server {
    listen 80;
    server_name api.kamlog.com;
    root /var/www/kamlog-backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php;

    charset utf8mb4;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 3. Rate Limiting

Dans `app/Http/Kernel.php` :

```php
protected $middlewareGroups = [
    'api' => [
        'throttle:60,1', // 60 requêtes par minute pour API publique
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];

protected $middlewareAliases = [
    'throttle.admin' => \Illuminate\Routing\Middleware\ThrottleRequests::class.':120,1',
];
```

---

## 📊 Métriques de Performance

### Objectifs

- ✅ Temps de réponse API < 200ms
- ✅ Requêtes SQL < 50ms
- ✅ Taux d'erreur < 0.1%
- ✅ Disponibilité > 99.9%

### Outils de Monitoring

1. **Laravel Telescope** (développement)
2. **New Relic** ou **DataDog** (production)
3. **MySQL Slow Query Log**
4. **Laravel Horizon** (pour les queues)

---

## 🔄 Backups

### Script de Backup Automatique

```bash
#!/bin/bash
# /usr/local/bin/backup-kamlog.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/kamlog"
DB_NAME="kamlog"
DB_USER="kamlog_user"
DB_PASS="secure_password"

# Créer le répertoire de backup
mkdir -p $BACKUP_DIR

# Backup de la base de données
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup des fichiers uploadés
tar -czf $BACKUP_DIR/storage_$DATE.tar.gz /var/www/kamlog-backend/storage/app

# Supprimer les backups de plus de 30 jours
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

### Crontab

```cron
# Backup quotidien à 2h du matin
0 2 * * * /usr/local/bin/backup-kamlog.sh >> /var/log/kamlog-backup.log 2>&1
```

---

## ✅ Checklist de Déploiement

- [ ] Migrations exécutées
- [ ] Seeders exécutés (données de test)
- [ ] Cache de configuration créé
- [ ] Cache de routes créé
- [ ] Autoloader optimisé
- [ ] Variables d'environnement configurées
- [ ] SSL/TLS configuré
- [ ] CORS configuré
- [ ] Rate limiting activé
- [ ] Logs configurés
- [ ] Monitoring activé
- [ ] Backups configurés
- [ ] Tests de charge effectués

---

## 📚 Ressources

- [Laravel Performance](https://laravel.com/docs/deployment#optimization)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [Nginx Configuration](https://www.nginx.com/resources/wiki/start/)
