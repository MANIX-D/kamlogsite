# Documentation - Seeders KAMLOG

## 📋 Vue d'ensemble

Système complet de seeders avec **données réalistes** pour toutes les tables de la base de données KAMLOG.

### **11 Seeders créés**

| Seeder | Nombre d'entrées | Description |
|--------|------------------|-------------|
| `UserSeeder` | 5 utilisateurs | Admin par défaut + équipe |
| `ServiceSeeder` | 8 services | Services logistiques complets |
| `NewsSeeder` | 8 actualités | Actualités, événements, communiqués |
| `PartnerSeeder` | 10 partenaires | Partenaires stratégiques et commerciaux |
| `InfrastructureSeeder` | 7 infrastructures | Plateformes, entrepôts, bureaux |
| `JobOfferSeeder` | 9 offres | Offres d'emploi actives et archivées |
| `AnnouncementSeeder` | 8 annonces | Annonces système diverses |
| `ContactMessageSeeder` | 8 messages | Messages de contact clients |
| `NewsletterSubscriberSeeder` | 10 abonnés | Abonnés newsletter actifs/inactifs |
| `VisitRequestSeeder` | 6 demandes | Demandes de visite installations |
| `QuoteRequestSeeder` | 7 demandes | Demandes de devis diverses |

---

## 👤 Admin Par Défaut

### **Identifiants**

```
Email    : admin@kamlog.cm
Password : Admin123!
Role     : super_admin
```

### **Autres Utilisateurs**

| Nom | Email | Role | Password |
|-----|-------|------|----------|
| Jean Mbarga | jean.mbarga@kamlog.cm | admin | Password123! |
| Marie Kouam | marie.kouam@kamlog.cm | editor | Password123! |
| Paul Nkolo | paul.nkolo@kamlog.cm | editor | Password123! |
| Sophie Ateba | sophie.ateba@kamlog.cm | editor (inactif) | Password123! |

---

## 🚀 Utilisation

### **Exécuter tous les seeders**

```bash
php artisan db:seed
```

### **Exécuter un seeder spécifique**

```bash
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=ServiceSeeder
php artisan db:seed --class=NewsSeeder
```

### **Réinitialiser et seeder**

```bash
# Attention : supprime toutes les données !
php artisan migrate:fresh --seed
```

### **En production (avec prudence)**

```bash
# Seeder uniquement l'admin
php artisan db:seed --class=UserSeeder

# Ou seeder des données de base
php artisan db:seed --class=ServiceSeeder
php artisan db:seed --class=PartnerSeeder
```

---

## 📊 Détails des Données

### **1. UserSeeder (5 utilisateurs)**

**Admin par défaut** :
- Nom : Admin KAMLOG
- Email : admin@kamlog.cm
- Password : Admin123!
- Role : super_admin
- Actif : Oui

**Autres utilisateurs** :
- 1 admin
- 2 editors actifs
- 1 editor inactif

---

### **2. ServiceSeeder (8 services)**

**Services actifs (7)** :
1. Transport Maritime
2. Transport Aérien
3. Transport Routier
4. Entreposage et Stockage
5. Dédouanement
6. Transit et Manutention
7. Supply Chain Management

**Service inactif (1)** :
8. E-commerce Logistique

**Données incluses** :
- Titres et slugs
- Descriptions complètes
- Icônes
- URLs d'images (Unsplash)
- Ordre d'affichage
- Statut actif/inactif

---

### **3. NewsSeeder (8 actualités)**

**Types** :
- 5 actualités
- 1 événement
- 2 communiqués

**Statuts** :
- 7 publiées
- 1 brouillon (non publié)

**Caractéristiques** :
- Contenu HTML complet
- Extraits générés
- Images (Unsplash)
- Auteurs variés
- Dates de publication
- Compteur de vues
- Featured/non-featured
- Meta description et keywords

**Exemples** :
- Inauguration nouvelle plateforme Douala
- Partenariat Maersk Line
- Journée Portes Ouvertes
- Certification ISO 9001:2015
- Lancement tracking temps réel
- Recrutement 50 collaborateurs

---

### **4. PartnerSeeder (10 partenaires)**

**Types** :
- 3 stratégiques (Maersk, CMA CGM, MSC)
- 4 opérationnels (DHL, Air France KLM, Bolloré, CAMRAIL)
- 2 institutionnels (Port de Douala, Chambre de Commerce)
- 1 commercial (Total Energies)

**Données** :
- Noms réels
- Logos (URLs Wikipedia)
- Sites web
- Descriptions
- Ordre d'affichage

---

### **5. InfrastructureSeeder (7 infrastructures)**

**Types** :
- 3 plateformes logistiques
- 3 entrepôts
- 2 bureaux

**Localisations** :
- Douala (4)
- Yaoundé (1)
- Garoua (1)
- Limbé (1)
- Kribi (1 - en construction)

**Données** :
- Adresses complètes
- Superficies (m²)
- Capacités
- Descriptions détaillées
- Coordonnées GPS (latitude/longitude)
- Images
- Statut actif/inactif

---

### **6. JobOfferSeeder (9 offres)**

**Types de contrat** :
- 6 CDI
- 1 CDD
- 1 Stage
- 1 Alternance (fermée)

**Postes** :
- Responsable Logistique
- Agent de Transit Senior
- Chauffeur Poids Lourd (10 postes)
- Magasinier Cariste
- Commercial Export B2B
- Développeur Full Stack (Stage)
- Assistant(e) Administrative
- Responsable Qualité et Sécurité
- Alternance (fermée)

**Données** :
- Descriptions complètes
- Salaires
- Expérience requise
- Niveau d'étude
- Compétences
- Dates limites
- Statut actif/inactif

---

### **7. AnnouncementSeeder (8 annonces)**

**Types** :
- 4 info
- 1 alerte
- 2 maintenance
- 1 promotion

**Priorités** :
- 1 basse
- 3 normales
- 3 hautes
- 1 urgente

**Cibles** :
- 3 tous
- 2 clients
- 1 partenaires
- 1 employés

**Exemples** :
- Maintenance système
- Nouveaux tarifs 2026
- Promotion fret aérien -15%
- Alerte trafic port
- Formation interne WMS
- Fermeture fête nationale

---

### **8. ContactMessageSeeder (8 messages)**

**Statuts** :
- 3 nouveaux
- 3 en_cours
- 2 traités

**Sujets** :
- Demandes de devis
- Informations services
- Réclamations
- Partenariats
- Visites installations

**Données** :
- Coordonnées complètes
- Messages détaillés
- Réponses (si traité)
- Dates de réponse

---

### **9. NewsletterSubscriberSeeder (10 abonnés)**

**Statuts** :
- 9 actifs
- 1 désabonné

**Données** :
- Emails
- Noms/prénoms (optionnels)
- Dates d'inscription
- Dates de désinscription

---

### **10. VisitRequestSeeder (6 demandes)**

**Statuts** :
- 3 en_attente
- 2 confirmées
- 1 annulée

**Entreprises variées** :
- Industrie
- Trading
- Export
- E-commerce
- Construction
- Pharmacie

**Données** :
- Coordonnées complètes
- Entreprise
- Nombre de personnes
- Dates souhaitées
- Messages
- Dates confirmées
- Notes admin

---

### **11. QuoteRequestSeeder (7 demandes)**

**Statuts** :
- 2 nouveaux
- 2 en_cours
- 1 devis_envoyé
- 1 accepté
- 1 refusé

**Services demandés** :
- Transport Maritime
- Entreposage
- Export complet
- Dédouanement
- Fulfillment E-commerce
- Transport Routier
- Transport Aérien + Stockage

**Données** :
- Coordonnées complètes
- Descriptions détaillées
- Budgets
- Délais
- Montants devis
- Dates envoi
- Notes admin

---

## 🎨 Données Réalistes

### **Contexte Camerounais**

Toutes les données sont adaptées au contexte camerounais :
- Villes : Douala, Yaoundé, Garoua, Limbé, Kribi
- Téléphones : Format +237 6 XX XX XX XX
- Entreprises : Noms réalistes camerounais
- Adresses : Zones réelles (Bonabéri, Akwa, Bastos, etc.)
- Coordonnées GPS : Vraies coordonnées des villes

### **Secteur Logistique**

Données cohérentes avec le secteur :
- Services logistiques réels
- Partenaires internationaux connus (Maersk, CMA CGM, DHL)
- Infrastructures types (plateformes, entrepôts)
- Offres d'emploi secteur logistique
- Demandes clients réalistes

### **Variété des Statuts**

Données dans différents états :
- Actif/Inactif
- Publié/Brouillon
- Nouveau/En cours/Traité
- En attente/Confirmé/Annulé
- Accepté/Refusé

---

## 🔧 Personnalisation

### **Modifier les Données**

Éditez les fichiers seeders dans `database/seeders/` :

```php
// Exemple : Ajouter un service
$services = [
    [
        'titre' => 'Nouveau Service',
        'slug' => 'nouveau-service',
        'description' => 'Description...',
        // ...
    ],
];
```

### **Ajouter des Données**

Ajoutez simplement des éléments aux tableaux :

```php
$news = [
    // ... actualités existantes
    [
        'titre' => 'Nouvelle actualité',
        // ...
    ],
];
```

### **Créer un Nouveau Seeder**

```bash
php artisan make:seeder NomSeeder
```

Puis ajoutez-le dans `DatabaseSeeder.php` :

```php
$this->call([
    // ... seeders existants
    NomSeeder::class,
]);
```

---

## ⚠️ Avertissements

### **En Production**

**Ne PAS exécuter** `php artisan migrate:fresh --seed` en production !

Cela supprimera **toutes les données** existantes.

### **Seeders Recommandés en Production**

Seuls ces seeders sont sûrs en production :
- `UserSeeder` - Pour créer l'admin initial
- `ServiceSeeder` - Pour les services de base
- `PartnerSeeder` - Pour les partenaires

### **Données de Test**

Les autres seeders contiennent des données de test/démo :
- Messages de contact fictifs
- Demandes de devis fictives
- Actualités de démonstration

---

## ✅ Checklist Utilisation

**Développement** :
- [ ] Exécuter `php artisan migrate:fresh --seed`
- [ ] Vérifier que toutes les tables sont remplies
- [ ] Tester la connexion avec admin@kamlog.cm
- [ ] Vérifier les relations entre tables

**Production** :
- [ ] Exécuter uniquement `UserSeeder` au démarrage
- [ ] Créer les services manuellement ou via `ServiceSeeder`
- [ ] Ne PAS seeder les données de test
- [ ] Sauvegarder la base avant tout seeding

**Tests** :
- [ ] Tester l'authentification avec tous les users
- [ ] Vérifier les données dans l'API
- [ ] Tester les filtres et recherches
- [ ] Vérifier les relations (news->auteur, etc.)

---

## 🎯 Résumé

Le système de seeders KAMLOG est maintenant **complet et production-ready** avec :

✅ **11 Seeders** - Toutes les tables couvertes  
✅ **Admin par défaut** - admin@kamlog.cm / Admin123!  
✅ **Données réalistes** - Contexte camerounais  
✅ **Variété de statuts** - Données dans tous les états  
✅ **Relations complètes** - Données liées entre tables  
✅ **Coordonnées GPS** - Vraies positions géographiques  
✅ **Partenaires réels** - Maersk, CMA CGM, DHL, etc.  
✅ **Contenu riche** - Descriptions complètes  
✅ **Images** - URLs Unsplash pour les visuels  
✅ **Production safe** - Instructions claires  

**Les seeders sont prêts pour le développement et la production !** 🚀
