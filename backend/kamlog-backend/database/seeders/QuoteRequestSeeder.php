<?php

namespace Database\Seeders;

use App\Models\QuoteRequest;
use Illuminate\Database\Seeder;

class QuoteRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $quoteRequests = [
            [
                'company_name' => 'Import Export SARL',
                'contact_person' => 'Marie Kouam',
                'email' => 'marie.kouam@example.com',
                'phone' => '+237 6 XX XX XX 01',
                'address' => 'Douala, Cameroun',
                'service_type' => 'transport',
                'project_description' => '2 conteneurs 40\' HC de Douala vers Le Havre. Marchandise : équipements industriels (machines-outils). Poids total estimé : 45 tonnes. Besoin assurance tous risques.',
                'budget_range' => '5000-7000 EUR',
                'desired_start_date' => now()->addDays(15),
                'desired_end_date' => null,
                'priority' => 'normale',
                'status' => 'nouveau',
                'estimated_amount' => null,
                'notes_admin' => null,
            ],
            [
                'company_name' => 'Agro Business Cameroun',
                'contact_person' => 'Paul Nkolo',
                'email' => 'paul.nkolo@entreprise.cm',
                'phone' => '+237 6 XX XX XX 02',
                'address' => 'Yaoundé, Cameroun',
                'service_type' => 'stockage',
                'project_description' => 'Stockage de 500 palettes de produits alimentaires (conserves). Besoin de chambres froides entre 2°C et 8°C. Durée : 6 mois renouvelable. Gestion des stocks en temps réel souhaitée.',
                'budget_range' => 'À définir',
                'desired_start_date' => now()->addDays(7),
                'desired_end_date' => now()->addMonths(6),
                'priority' => 'haute',
                'status' => 'en_cours',
                'estimated_amount' => 2500000,
                'notes_admin' => 'Devis envoyé. Relance prévue dans 3 jours. Client intéressé mais négocie le prix.',
            ],
            [
                'company_name' => 'Cacao Export SA',
                'contact_person' => 'Roger Fotso',
                'email' => 'roger.fotso@export.cm',
                'phone' => '+237 6 XX XX XX 05',
                'address' => 'Douala, Cameroun',
                'service_type' => 'logistique',
                'project_description' => 'Export de 100 tonnes de cacao vers Rotterdam. Besoin de : transport routier plantation-port, entreposage temporaire, dédouanement export, transport maritime, assurance. Livraison incoterm CFR.',
                'budget_range' => '15000-20000 EUR',
                'desired_start_date' => now()->addMonths(2),
                'desired_end_date' => null,
                'priority' => 'haute',
                'status' => 'envoyé',
                'estimated_amount' => 18500000,
                'notes_admin' => 'Devis détaillé envoyé. Client satisfait du prix. En attente de confirmation.',
            ],
            [
                'company_name' => 'Import Textile',
                'contact_person' => 'Alice Tchoumi',
                'email' => 'alice.tchoumi@import.cm',
                'phone' => '+237 6 XX XX XX 06',
                'address' => 'Yaoundé, Cameroun',
                'service_type' => 'personnalise',
                'project_description' => 'Dédouanement import de 3 conteneurs 20\' de textiles en provenance de Chine. Besoin accompagnement complet : déclaration douane, paiement droits et taxes, livraison entrepôt Yaoundé.',
                'budget_range' => '500000-800000 FCFA',
                'desired_start_date' => now()->addDays(5),
                'desired_end_date' => null,
                'priority' => 'urgente',
                'status' => 'accepte',
                'estimated_amount' => 650000,
                'notes_admin' => 'Devis accepté. Dossier transmis au service transit. Paiement reçu.',
            ],
            [
                'company_name' => 'E-Commerce Startup',
                'contact_person' => 'Jean Mbarga',
                'email' => 'jean.mbarga@startup.cm',
                'phone' => '+237 6 XX XX XX 04',
                'address' => 'Douala, Cameroun',
                'service_type' => 'logistique',
                'project_description' => 'Solution complète e-commerce : réception marchandises, stockage, préparation commandes, emballage, expédition, gestion retours. Volume : 200-300 commandes/jour. Intégration API avec notre plateforme.',
                'budget_range' => 'Tarif au colis + stockage',
                'desired_start_date' => now()->addMonths(3),
                'desired_end_date' => null,
                'priority' => 'normale',
                'status' => 'en_cours',
                'estimated_amount' => null,
                'notes_admin' => 'RDV prévu avec le client pour comprendre ses besoins en détail. Devis complexe à établir.',
            ],
            [
                'company_name' => 'BTP Construction',
                'contact_person' => 'Daniel Essomba',
                'email' => 'daniel.essomba@btp.cm',
                'phone' => '+237 6 XX XX XX 13',
                'address' => 'Yaoundé, Cameroun',
                'service_type' => 'transport',
                'project_description' => 'Transport de matériaux de construction (ciment, fer à béton) de Douala vers chantiers à Yaoundé. Volume : 10 camions/semaine pendant 6 mois. Besoin de camions bâchés.',
                'budget_range' => 'Contrat mensuel',
                'desired_start_date' => now()->addDays(10),
                'desired_end_date' => now()->addMonths(6),
                'priority' => 'normale',
                'status' => 'refuse',
                'estimated_amount' => 8500000,
                'notes_admin' => 'Client a refusé. Prix trop élevé selon lui. A trouvé moins cher ailleurs.',
            ],
            [
                'company_name' => 'Pharmacie Centrale',
                'contact_person' => 'Sylvie Ondoa',
                'email' => 'sylvie.ondoa@pharma.cm',
                'phone' => '+237 6 XX XX XX 12',
                'address' => 'Douala, Cameroun',
                'service_type' => 'logistique',
                'project_description' => 'Import de produits pharmaceutiques par fret aérien. Besoin chaîne du froid complète : transport aéroport-entrepôt, stockage 2-8°C, distribution vers pharmacies. Certification GDP obligatoire.',
                'budget_range' => 'À définir selon volume',
                'desired_start_date' => now()->addDays(10),
                'desired_end_date' => null,
                'priority' => 'haute',
                'status' => 'nouveau',
                'estimated_amount' => null,
                'notes_admin' => 'Demande spécifique. Vérifier nos certifications GDP avant de répondre.',
            ],
        ];

        foreach ($quoteRequests as $quoteRequest) {
            QuoteRequest::create($quoteRequest);
        }
    }
}
