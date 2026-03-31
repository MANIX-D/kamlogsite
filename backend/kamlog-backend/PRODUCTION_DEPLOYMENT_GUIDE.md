# Guide de Déploiement Production - KAMLOG Backend

## 🚀 Guide Complet de Déploiement

### **Version** : 1.0.0
### **Date** : 25 Mars 2026
### **Statut** : Production Ready ✅

---

## 📋 Prérequis Serveur

### **Serveur Web**
- **OS** : Ubuntu 22.04 LTS (recommandé) ou CentOS 8+
- **CPU** : 2 vCPU minimum (4 vCPU recommandé)
- **RAM** : 4 GB minimum (8 GB recommandé)
- **Disque** : 50 GB SSD minimum
- **Bande passante** : 100 Mbps minimum

### **Stack Technique**
```bash
# PHP 8.2+
php -v  # >= 8.2

# Composer 2.x
composer --version

# MySQL 8.0+ ou MariaDB 10.6+
mysql --version

# Redis 7.0+
redis-cli --version

# Nginx 1.24+ ou Apache 2.4+
nginx -v

# Node.js 18+ (pour assets si nécessaire)
node -v
```

### **Extensions PHP Requises**
```bash
php -m | grep -E 'pdo|mysql|mbstring|xml|bcmath|json|tokenizer|openssl|fileinfo|gd|redis|zip'
```

Extensions nécessaires :
- ✅ PDO
- ✅ pdo_mysql
- ✅ mbstring
- ✅ xml
- ✅ bcmath
- ✅ json
- ✅ tokenizer
- ✅ openssl
- ✅ fileinfo
- ✅ gd
- ✅ redis
- ✅ zip
- ✅ curl

---

## 🔧 Configuration Serveur

### **1. Installation PHP 8.2**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-mbstring \
  php8.2-xml php8.2-bcmath php8.2-curl php8.2-gd php8.2-zip \
  php8.2-redis php8.2-intl php8.2-opcache

# Vérifier
php -v
```

### **2. Installation MySQL 8.0**

```bash
# Ubuntu/Debian
sudo apt install -y mysql-server mysql-client

# Sécuriser MySQL
sudo mysql_secure_installation

# Créer la base de données
sudo mysql -u root -p
```

```sql
CREATE DATABASE kamlog_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'kamlog_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON kamlog_prod.* TO 'kamlog_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### **3. Installation Redis**

```bash
# Ubuntu/Debian
sudo apt install -y redis-server

# Configurer Redis
sudo nano /etc/redis/redis.conf
# Modifier :
# maxmemory 256mb
# maxmemory-policy allkeys-lru

# Redémarrer
sudo systemctl restart redis-server
sudo systemctl enable redis-server

# Tester
redis-cli ping  # Doit retourner PONG
```

### **4. Installation Nginx**

```bash
# Ubuntu/Debian
sudo apt install -y nginx

# Démarrer
sudo systemctl start nginx
sudo systemctl enable nginx
```

**Configuration Nginx** (`/etc/nginx/sites-available/kamlog-api`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.kamlog.cm;
    
    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.kamlog.cm;
    
    root /var/www/kamlog-backend/public;
    index index.php;
    
    # SSL Certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.kamlog.cm/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.kamlog.cm/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Logs
    access_log /var/log/nginx/kamlog-api-access.log;
    error_log /var/log/nginx/kamlog-api-error.log;
    
    # Client max body size (pour uploads)
    client_max_body_size 20M;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
        
        # Timeouts
        fastcgi_read_timeout 300;
        fastcgi_send_timeout 300;
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
    
    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/kamlog-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **5. SSL avec Let's Encrypt**

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d api.kamlog.cm

# Auto-renouvellement
sudo certbot renew --dry-run
```

---

## 📦 Déploiement de l'Application

### **1. Cloner le Repository**

```bash
# Créer le répertoire
sudo mkdir -p /var/www/kamlog-backend
sudo chown -R $USER:$USER /var/www/kamlog-backend

# Cloner (ou upload via FTP/SFTP)
cd /var/www
git clone https://github.com/votre-repo/kamlog-backend.git
cd kamlog-backend
```

### **2. Installer les Dépendances**

```bash
# Composer (optimisé pour production)
composer install --optimize-autoloader --no-dev

# Permissions
sudo chown -R www-data:www-data /var/www/kamlog-backend
sudo chmod -R 755 /var/www/kamlog-backend
sudo chmod -R 775 /var/www/kamlog-backend/storage
sudo chmod -R 775 /var/www/kamlog-backend/bootstrap/cache
```

### **3. Configuration .env**

```bash
# Copier l'exemple
cp .env.example .env

# Éditer
nano .env
```

**Configuration Production** :

```env
APP_NAME="KAMLOG API"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://api.kamlog.cm

# Locale
APP_LOCALE=fr
APP_FALLBACK_LOCALE=fr
APP_FAKER_LOCALE=fr_FR

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=error
LOG_STACK=daily

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kamlog_prod
DB_USERNAME=kamlog_user
DB_PASSWORD=STRONG_PASSWORD_HERE

# Cache & Session
CACHE_DRIVER=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120
SESSION_DOMAIN=.kamlog.cm

# Queue
QUEUE_CONNECTION=redis

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_CLIENT=phpredis

# Mail (SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=noreply@kamlog.cm
MAIL_PASSWORD=your_mail_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@kamlog.cm
MAIL_FROM_NAME="${APP_NAME}"

# Sanctum
SANCTUM_STATEFUL_DOMAINS=kamlog.cm,www.kamlog.cm,admin.kamlog.cm
SESSION_DOMAIN=.kamlog.cm

# AWS S3 (si utilisé pour storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=eu-west-1
AWS_BUCKET=kamlog-uploads
AWS_USE_PATH_STYLE_ENDPOINT=false

# Optimizations
HIDE_VALIDATION_DETAILS=true
BCRYPT_ROUNDS=12
```

### **4. Générer la Clé d'Application**

```bash
php artisan key:generate
```

### **5. Exécuter les Migrations**

```bash
# Migrations
php artisan migrate --force

# Seeders (première installation uniquement)
php artisan db:seed --force
```

### **6. Optimisations Laravel**

```bash
# Cache de configuration
php artisan config:cache

# Cache de routes
php artisan route:cache

# Cache de vues
php artisan view:cache

# Cache d'événements
php artisan event:cache

# Optimisation de l'autoloader
composer dump-autoload --optimize --classmap-authoritative
```

### **7. Storage Link**

```bash
php artisan storage:link
```

---

## 🔄 Configuration des Queues

### **1. Supervisor pour Queue Workers**

```bash
# Installer Supervisor
sudo apt install -y supervisor

# Créer la configuration
sudo nano /etc/supervisor/conf.d/kamlog-worker.conf
```

**Configuration Supervisor** :

```ini
[program:kamlog-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/kamlog-backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/kamlog-backend/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
# Recharger Supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start kamlog-worker:*

# Vérifier le statut
sudo supervisorctl status
```

### **2. Cron pour Scheduler**

```bash
# Éditer crontab
sudo crontab -e -u www-data
```

Ajouter :

```cron
* * * * * cd /var/www/kamlog-backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🔒 Sécurité

### **1. Firewall (UFW)**

```bash
# Activer UFW
sudo ufw enable

# Autoriser SSH
sudo ufw allow 22/tcp

# Autoriser HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Vérifier
sudo ufw status
```

### **2. Fail2Ban**

```bash
# Installer
sudo apt install -y fail2ban

# Configurer
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

Ajouter :

```ini
[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/kamlog-api-error.log
```

```bash
# Redémarrer
sudo systemctl restart fail2ban
```

### **3. Permissions Finales**

```bash
# Permissions strictes
sudo chown -R www-data:www-data /var/www/kamlog-backend
sudo find /var/www/kamlog-backend -type f -exec chmod 644 {} \;
sudo find /var/www/kamlog-backend -type d -exec chmod 755 {} \;
sudo chmod -R 775 /var/www/kamlog-backend/storage
sudo chmod -R 775 /var/www/kamlog-backend/bootstrap/cache
```

---

## 📊 Monitoring

### **1. Laravel Telescope (Dev/Staging uniquement)**

```bash
# NE PAS installer en production
# Utiliser uniquement en staging
```

### **2. Logs**

```bash
# Logs Laravel
tail -f /var/www/kamlog-backend/storage/logs/laravel.log

# Logs Nginx
tail -f /var/log/nginx/kamlog-api-error.log
tail -f /var/log/nginx/kamlog-api-access.log

# Logs PHP-FPM
tail -f /var/log/php8.2-fpm.log
```

### **3. Monitoring Recommandé**

- **Uptime** : UptimeRobot, Pingdom
- **APM** : New Relic, Datadog, Scout APM
- **Logs** : Papertrail, Loggly
- **Errors** : Sentry, Bugsnag

---

## 🔄 Mise à Jour de l'Application

### **Script de Déploiement**

Créer `/var/www/kamlog-backend/deploy.sh` :

```bash
#!/bin/bash

echo "🚀 Déploiement KAMLOG Backend..."

# Mode maintenance
php artisan down

# Git pull
git pull origin main

# Composer
composer install --optimize-autoloader --no-dev

# Migrations
php artisan migrate --force

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Restart queue workers
sudo supervisorctl restart kamlog-worker:*

# Mode production
php artisan up

echo "✅ Déploiement terminé !"
```

```bash
# Rendre exécutable
chmod +x deploy.sh

# Utiliser
./deploy.sh
```

---

## 🧪 Tests Post-Déploiement

### **1. Tests API**

```bash
# Health check
curl https://api.kamlog.cm/api/v1/health

# Services publics
curl https://api.kamlog.cm/api/v1/services

# News publiques
curl https://api.kamlog.cm/api/v1/news
```

### **2. Tests Performance**

```bash
# Apache Bench
ab -n 1000 -c 10 https://api.kamlog.cm/api/v1/services

# Résultats attendus :
# - Requests per second: > 100
# - Time per request: < 100ms
# - Failed requests: 0
```

### **3. Checklist Validation**

- [ ] API répond sur HTTPS
- [ ] Certificat SSL valide
- [ ] CORS fonctionne
- [ ] Cache Redis actif
- [ ] Queue workers actifs
- [ ] Scheduler cron actif
- [ ] Logs rotatifs configurés
- [ ] Backups automatiques configurés
- [ ] Monitoring actif
- [ ] Firewall configuré

---

## 💾 Backups

### **1. Backup Base de Données**

Créer `/usr/local/bin/backup-kamlog-db.sh` :

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/kamlog"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="kamlog_prod"
DB_USER="kamlog_user"
DB_PASS="STRONG_PASSWORD_HERE"

# Créer le répertoire
mkdir -p $BACKUP_DIR

# Backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/kamlog_db_$DATE.sql.gz

# Garder seulement les 30 derniers jours
find $BACKUP_DIR -name "kamlog_db_*.sql.gz" -mtime +30 -delete

echo "✅ Backup DB créé : kamlog_db_$DATE.sql.gz"
```

```bash
# Rendre exécutable
sudo chmod +x /usr/local/bin/backup-kamlog-db.sh

# Cron quotidien (2h du matin)
sudo crontab -e
```

Ajouter :

```cron
0 2 * * * /usr/local/bin/backup-kamlog-db.sh >> /var/log/kamlog-backup.log 2>&1
```

### **2. Backup Fichiers**

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/kamlog"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/kamlog-backend"

# Backup storage
tar -czf $BACKUP_DIR/kamlog_storage_$DATE.tar.gz $APP_DIR/storage/app/public

# Garder 30 jours
find $BACKUP_DIR -name "kamlog_storage_*.tar.gz" -mtime +30 -delete

echo "✅ Backup Storage créé"
```

---

## 🚨 Troubleshooting

### **Problème : 500 Internal Server Error**

```bash
# Vérifier les logs
tail -f /var/www/kamlog-backend/storage/logs/laravel.log
tail -f /var/log/nginx/kamlog-api-error.log

# Vérifier les permissions
sudo chown -R www-data:www-data /var/www/kamlog-backend/storage
sudo chmod -R 775 /var/www/kamlog-backend/storage

# Recréer les caches
php artisan config:clear
php artisan cache:clear
php artisan config:cache
```

### **Problème : Queue ne traite pas les jobs**

```bash
# Vérifier Supervisor
sudo supervisorctl status

# Redémarrer les workers
sudo supervisorctl restart kamlog-worker:*

# Vérifier les logs
tail -f /var/www/kamlog-backend/storage/logs/worker.log
```

### **Problème : Performance lente**

```bash
# Vérifier Redis
redis-cli ping

# Vérifier les caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Analyser les requêtes lentes
# Activer slow query log MySQL
```

---

## ✅ Checklist Finale

### **Infrastructure**
- [ ] Serveur configuré (PHP, MySQL, Redis, Nginx)
- [ ] SSL/HTTPS actif
- [ ] Firewall configuré
- [ ] Fail2Ban actif

### **Application**
- [ ] Code déployé
- [ ] .env configuré
- [ ] Migrations exécutées
- [ ] Caches générés
- [ ] Storage link créé

### **Services**
- [ ] Queue workers actifs (Supervisor)
- [ ] Scheduler cron actif
- [ ] Nginx actif et configuré
- [ ] Redis actif

### **Sécurité**
- [ ] APP_DEBUG=false
- [ ] Permissions correctes
- [ ] CORS configuré
- [ ] Rate limiting actif

### **Monitoring**
- [ ] Logs configurés
- [ ] Backups automatiques
- [ ] Monitoring externe actif
- [ ] Alertes configurées

### **Tests**
- [ ] API accessible
- [ ] HTTPS fonctionne
- [ ] CORS fonctionne
- [ ] Performance acceptable

---

## 🎯 Résumé

**Temps de déploiement estimé** : 2-3 heures

**Commandes essentielles** :
```bash
# Déploiement
./deploy.sh

# Logs
tail -f storage/logs/laravel.log

# Cache
php artisan cache:clear && php artisan config:cache

# Queue
sudo supervisorctl restart kamlog-worker:*

# Backup
/usr/local/bin/backup-kamlog-db.sh
```

**Support** : admin@kamlog.cm

🚀 **Votre backend KAMLOG est maintenant en production !**
