# 📚 Index de la Documentation - KAMLOG

Bienvenue dans la documentation complète du projet KAMLOG. Ce fichier vous guide vers les différents documents en fonction de vos besoins.

---

## 🚀 Pour bien démarrer

| Document | Description | Temps de lecture |
|----------|-------------|------------------|
| **[QUICK_START.md](QUICK_START.md)** | Guide de démarrage rapide en 5 minutes | ⏱️ 5 min |
| **[README.md](README.md)** | Vue d'ensemble du projet, installation complète | ⏱️ 10 min |

💡 **Conseil :** Commencez par QUICK_START.md si vous voulez installer rapidement le projet.

---

## 🔧 Configuration et Installation

| Document | Contenu | Pour qui ? |
|----------|---------|-----------|
| **[BACKEND_SETUP.md](BACKEND_SETUP.md)** | Guide complet d'installation Laravel + MySQL | Développeurs backend |
| **[CONFIGURATION_MYSQL_LARAVEL.md](CONFIGURATION_MYSQL_LARAVEL.md)** | Architecture complète, flux de données | Lead dev, architectes |
| **[VERIFICATION_MYSQL.md](VERIFICATION_MYSQL.md)** | Tests, vérifications techniques, checklist | DevOps, QA |

### Quand utiliser quel document ?

- **Première installation ?** → Commencez par `QUICK_START.md`
- **Installation détaillée backend ?** → Lisez `BACKEND_SETUP.md`
- **Comprendre l'architecture ?** → Consultez `CONFIGURATION_MYSQL_LARAVEL.md`
- **Vérifier que tout fonctionne ?** → Suivez `VERIFICATION_MYSQL.md`

---

## 📊 Migration Supabase → MySQL

| Document | Description | Date |
|----------|-------------|------|
| **[MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md)** | Résumé complet de la migration effectuée | 2026-03-24 |

Ce document détaille :
- ✅ Ce qui a été supprimé (Supabase)
- ✅ Ce qui a été ajouté (Laravel + MySQL)
- ✅ Vérifications effectuées
- ✅ Architecture finale

---

## 🗄️ Base de Données

| Document | Contenu | Type |
|----------|---------|------|
| **[laravel_migrations/README.md](laravel_migrations/README.md)** | Documentation complète du schéma MySQL | Base de données |
| **laravel_migrations/*.php** | 12 fichiers de migration Laravel | Migrations SQL |

### Tables disponibles

1. services
2. actualites
3. partners
4. infrastructures
5. contact_messages
6. newsletter_subscribers
7. visit_requests
8. announcements
9. job_offers
10. job_applications
11. quotes
12. admin_users

---

## 🌍 Internationalisation (i18n)

| Document | Description | Langues |
|----------|-------------|---------|
| **[docs/TRANSLATION_SYSTEM.md](docs/TRANSLATION_SYSTEM.md)** | Guide complet du système de traduction | FR, EN |
| **[src/i18n/README.md](src/i18n/README.md)** | Documentation technique i18next | FR, EN |
| **[docs/BACKEND_TRANSLATION_GUIDE.md](docs/BACKEND_TRANSLATION_GUIDE.md)** | Guide de traduction backend | FR, EN |

### Fichiers de traduction

- **[src/i18n/locales/fr.json](src/i18n/locales/fr.json)** - Traductions françaises (défaut)
- **[src/i18n/locales/en.json](src/i18n/locales/en.json)** - Traductions anglaises

---

## 🛠️ Développement Laravel

| Document | Description | Audience |
|----------|-------------|----------|
| **[LARAVEL_BACKEND_GUIDE.md](LARAVEL_BACKEND_GUIDE.md)** | Guide de développement Laravel complet | Développeurs backend |

### Contenu du guide Laravel

- Installation et configuration
- Structure des controllers
- Modèles Eloquent
- Validation et FormRequest
- Authentification Sanctum
- Upload de fichiers
- API RESTful
- CORS et sécurité

---

## 📁 Structure du Projet

### Frontend (React + Vite)

```
src/
├── components/          # Composants React
│   ├── admin/          # Interface admin
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── ...
├── pages/              # Pages de l'application
│   ├── admin/         # Pages admin
│   ├── HomePage.tsx
│   └── ...
├── services/          # Services API
│   ├── apiClient.ts   # Client Axios
│   ├── api.ts         # API publique
│   ├── adminApi.ts    # API admin
│   └── auth.ts        # Authentification
├── i18n/              # Traductions
├── types/             # Types TypeScript
├── utils/             # Utilitaires
└── config/            # Configuration
```

### Backend (Laravel)

```
app/
├── Http/
│   └── Controllers/
│       └── Api/           # Controllers API
│           ├── Admin/     # Controllers admin
│           └── Public/    # Controllers publics
├── Models/                # Modèles Eloquent
└── ...
database/
└── migrations/            # Migrations SQL
routes/
└── api.php               # Routes API
config/
├── cors.php              # Configuration CORS
└── ...
```

---

## 🔗 Navigation Rapide

### Par cas d'usage

#### Je veux installer le projet rapidement
1. [QUICK_START.md](QUICK_START.md) ⭐
2. [README.md](README.md)

#### Je veux comprendre l'architecture
1. [CONFIGURATION_MYSQL_LARAVEL.md](CONFIGURATION_MYSQL_LARAVEL.md) ⭐
2. [MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md)

#### Je veux développer le backend
1. [BACKEND_SETUP.md](BACKEND_SETUP.md) ⭐
2. [LARAVEL_BACKEND_GUIDE.md](LARAVEL_BACKEND_GUIDE.md)
3. [laravel_migrations/README.md](laravel_migrations/README.md)

#### Je veux gérer les traductions
1. [docs/TRANSLATION_SYSTEM.md](docs/TRANSLATION_SYSTEM.md) ⭐
2. [src/i18n/README.md](src/i18n/README.md)

#### Je veux vérifier que tout fonctionne
1. [VERIFICATION_MYSQL.md](VERIFICATION_MYSQL.md) ⭐
2. [MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md)

---

## 📖 Documents par Ordre de Lecture Recommandé

### Pour un nouveau développeur

1. **[README.md](README.md)** - Vue d'ensemble
2. **[QUICK_START.md](QUICK_START.md)** - Installation rapide
3. **[CONFIGURATION_MYSQL_LARAVEL.md](CONFIGURATION_MYSQL_LARAVEL.md)** - Comprendre l'architecture
4. **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - Installation détaillée backend
5. **[LARAVEL_BACKEND_GUIDE.md](LARAVEL_BACKEND_GUIDE.md)** - Développement Laravel
6. **[docs/TRANSLATION_SYSTEM.md](docs/TRANSLATION_SYSTEM.md)** - Système i18n

### Pour un chef de projet

1. **[README.md](README.md)** - Vue d'ensemble
2. **[MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md)** - État de la migration
3. **[CONFIGURATION_MYSQL_LARAVEL.md](CONFIGURATION_MYSQL_LARAVEL.md)** - Architecture
4. **[laravel_migrations/README.md](laravel_migrations/README.md)** - Schéma de base de données

### Pour un DevOps

1. **[QUICK_START.md](QUICK_START.md)** - Installation
2. **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - Configuration backend
3. **[VERIFICATION_MYSQL.md](VERIFICATION_MYSQL.md)** - Tests et vérifications
4. **[CONFIGURATION_MYSQL_LARAVEL.md](CONFIGURATION_MYSQL_LARAVEL.md)** - Architecture

---

## 🆘 Résolution de Problèmes

### Le frontend ne démarre pas
→ Vérifiez [README.md](README.md) section "Installation"

### Le backend ne se connecte pas à MySQL
→ Consultez [BACKEND_SETUP.md](BACKEND_SETUP.md) section "Configuration MySQL"

### Les traductions ne fonctionnent pas
→ Lisez [docs/TRANSLATION_SYSTEM.md](docs/TRANSLATION_SYSTEM.md)

### API endpoints retournent 404
→ Vérifiez [BACKEND_SETUP.md](BACKEND_SETUP.md) section "Structure des API Endpoints"

### Erreurs CORS
→ Consultez [CONFIGURATION_MYSQL_LARAVEL.md](CONFIGURATION_MYSQL_LARAVEL.md) section "Configuration Frontend ↔ Backend"

---

## 📝 Fichiers de Configuration

| Fichier | Description | Emplacement |
|---------|-------------|-------------|
| `.env` | Configuration frontend | Racine du projet |
| `.env.example` | Exemple de configuration | Racine du projet |
| `laravel/.env` | Configuration backend | Projet Laravel |
| `src/config/api.ts` | Endpoints API | Frontend |
| `config/cors.php` | Configuration CORS | Backend Laravel |

---

## 🔍 Recherche par Mot-Clé

| Mot-clé | Document(s) |
|---------|-------------|
| **MySQL** | BACKEND_SETUP.md, CONFIGURATION_MYSQL_LARAVEL.md, VERIFICATION_MYSQL.md |
| **Laravel** | BACKEND_SETUP.md, LARAVEL_BACKEND_GUIDE.md, QUICK_START.md |
| **API** | BACKEND_SETUP.md, CONFIGURATION_MYSQL_LARAVEL.md, src/config/api.ts |
| **Authentification** | BACKEND_SETUP.md, CONFIGURATION_MYSQL_LARAVEL.md, src/services/auth.ts |
| **Traduction** | docs/TRANSLATION_SYSTEM.md, src/i18n/README.md |
| **Migrations** | laravel_migrations/README.md, BACKEND_SETUP.md |
| **CORS** | CONFIGURATION_MYSQL_LARAVEL.md, BACKEND_SETUP.md |
| **Supabase** | MIGRATION_COMPLETE.md, VERIFICATION_MYSQL.md |
| **Installation** | QUICK_START.md, README.md, BACKEND_SETUP.md |
| **Déploiement** | README.md, BACKEND_SETUP.md |

---

## 💡 Liens Utiles

### Documentation Officielle

- [Laravel Documentation](https://laravel.com/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [i18next Documentation](https://www.i18next.com/)
- [Axios Documentation](https://axios-http.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### Outils

- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [React Router](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 📊 Statistiques du Projet

| Métrique | Valeur |
|----------|--------|
| **Documents de documentation** | 10+ |
| **Tables de base de données** | 12 |
| **Fichiers de migration** | 12 |
| **Langues supportées** | 2 (FR, EN) |
| **Endpoints API** | 30+ |
| **Composants React** | 50+ |
| **Pages** | 15+ |

---

## ✅ Checklist Complète

### Installation
- [ ] Frontend installé (`npm install`)
- [ ] Backend Laravel créé
- [ ] MySQL configuré
- [ ] Migrations exécutées
- [ ] Admin créé
- [ ] Tests de connexion effectués

### Développement
- [ ] Controllers API implémentés
- [ ] Validation configurée
- [ ] Upload de fichiers fonctionnel
- [ ] Emails configurés
- [ ] Traductions complètes

### Déploiement
- [ ] Build frontend (`npm run build`)
- [ ] Configuration production Laravel
- [ ] Base de données production
- [ ] Variables d'environnement configurées
- [ ] Tests de production effectués

---

## 🎯 Prochaines Étapes Recommandées

1. ✅ **Lire QUICK_START.md** pour installer rapidement
2. ✅ **Consulter BACKEND_SETUP.md** pour le backend
3. ✅ **Implémenter les controllers** Laravel
4. ✅ **Tester l'application** complètement
5. ✅ **Déployer** en production

---

**Date de dernière mise à jour :** 2026-03-24
**Version du projet :** 1.0.0
**Statut :** ✅ Prêt pour le développement
