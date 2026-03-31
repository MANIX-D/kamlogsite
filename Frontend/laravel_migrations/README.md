# Migrations Laravel - KAMLOG

## 📁 Structure

Ce dossier contient toutes les migrations de base de données pour le projet KAMLOG.

## 🚀 Installation

1. Copiez tous les fichiers de migration dans votre projet Laravel :
   ```bash
   cp laravel_migrations/*.php /votre-projet-laravel/database/migrations/
   ```

2. Exécutez les migrations :
   ```bash
   php artisan migrate
   ```

## 📋 Liste des migrations

| Fichier | Table | Description |
|---------|-------|-------------|
| `2024_01_01_000001_create_services_table.php` | `services` | Services logistiques offerts |
| `2024_01_01_000002_create_actualites_table.php` | `actualites` | Articles, annonces et actualités |
| `2024_01_01_000003_create_partners_table.php` | `partners` | Partenaires commerciaux |
| `2024_01_01_000004_create_infrastructures_table.php` | `infrastructures` | Installations et équipements |
| `2024_01_01_000005_create_contact_messages_table.php` | `contact_messages` | Messages du formulaire de contact |
| `2024_01_01_000006_create_newsletter_subscribers_table.php` | `newsletter_subscribers` | Abonnés newsletter |
| `2024_01_01_000007_create_visit_requests_table.php` | `visit_requests` | Demandes de visite |
| `2024_01_01_000008_create_announcements_table.php` | `announcements` | Annonces importantes |
| `2024_01_01_000009_create_job_offers_table.php` | `job_offers` | Offres d'emploi |
| `2024_01_01_000010_create_job_applications_table.php` | `job_applications` | Candidatures aux offres |
| `2024_01_01_000011_create_quotes_table.php` | `quotes` | Demandes de devis |
| `2024_01_01_000012_create_admin_users_table.php` | `admin_users` | Comptes administrateurs |

## 🔑 Caractéristiques

### Multilinguisme
Colonnes FR/EN pour :
- `services` : nom_fr, nom_en, description_fr, description_en
- `actualites` : titre_fr, titre_en, contenu_fr, contenu_en
- `partners` : name_fr, name_en, description_fr, description_en
- `infrastructures` : nom_fr, nom_en, description_fr, description_en
- `announcements` : title_fr, title_en, content_fr, content_en
- `job_offers` : title_fr, title_en, description_fr, description_en, requirements_fr, requirements_en

### ENUM définis

**actualites.type**
- article
- annonce
- offre

**visit_requests.status**
- pending (défaut)
- confirmed
- cancelled

**announcements.priority**
- low
- normal (défaut)
- high
- urgent

**job_offers.contract_type**
- CDI (défaut)
- CDD
- Stage
- Freelance

**quotes.status**
- pending (défaut)
- processing
- quoted
- closed

**job_applications.status**
- pending (défaut)
- reviewing
- accepted
- rejected

### Relations

**job_applications → job_offers**
- Clé étrangère : `job_offer_id`
- Cascade : `onDelete('cascade')`

### Index créés

Tous les champs fréquemment utilisés dans les requêtes sont indexés :
- Statuts (status)
- Dates (created_at, date_publication, application_deadline)
- Flags actifs (is_active)
- Ordre d'affichage (display_order)
- Emails (email)
- Types et catégories

### Contraintes d'unicité

- `newsletter_subscribers.email` → UNIQUE
- `admin_users.email` → UNIQUE

## 🛠️ Commandes utiles

```bash
# Exécuter les migrations
php artisan migrate

# Annuler la dernière migration
php artisan migrate:rollback

# Réinitialiser toutes les migrations
php artisan migrate:reset

# Réinitialiser et ré-exécuter
php artisan migrate:refresh

# Voir le statut des migrations
php artisan migrate:status
```

## 📝 Notes

- Toutes les tables utilisent `timestamps()` pour created_at et updated_at
- Les champs optionnels sont marqués `nullable()`
- Les valeurs par défaut sont définies pour is_active, status, priority, etc.
- Compatible avec Laravel 10 et MySQL 8.0+
