<?php

namespace Database\Seeders;

use App\Models\VisitRequest;
use Illuminate\Database\Seeder;

class VisitRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $visitRequests = [
            [
                'name' => 'Patrick Kamdem',
                'email' => 'patrick.kamdem@industrie.cm',
                'phone' => '+237 6 XX XX XX 07',
                'company' => 'Industrie Camerounaise SA',
                'date' => now()->addDays(10),
                'heure' => '10:00',
                'type_visite' => 'guidee',
                'message' => 'Nous souhaitons visiter votre plateforme logistique de Bonabéri pour évaluer vos capacités avant de vous confier notre logistique. Nous serons 3 personnes (DG, Directeur Logistique, Responsable Achats).',
                'status' => 'pending',
                'notes_admin' => null,
            ],
            [
                'name' => 'Christine Nguema',
                'email' => 'christine.nguema@trading.cm',
                'phone' => '+237 6 XX XX XX 08',
                'company' => 'Trading International SARL',
                'date' => now()->addDays(15),
                'heure' => '14:00',
                'type_visite' => 'guidee',
                'message' => 'Visite de vos installations dans le cadre d\'un appel d\'offres. Nous aimerions voir vos entrepôts climatisés et vos équipements de manutention.',
                'status' => 'confirmed',
                'notes_admin' => 'Visite confirmée. Guide : M. Nkolo. Prévoir présentation PowerPoint.',
            ],
            [
                'name' => 'Daniel Essomba',
                'email' => 'daniel.essomba@export.cm',
                'phone' => '+237 6 XX XX XX 09',
                'company' => 'Export Cacao Cameroun',
                'date' => now()->addDays(5),
                'heure' => '09:00',
                'type_visite' => 'guidee',
                'message' => 'Visite technique de vos installations de stockage. Nous exportons du cacao et cherchons un partenaire pour le stockage avant export. Délégation de 5 personnes.',
                'status' => 'pending',
                'notes_admin' => 'Demande reçue. En attente de validation par la direction.',
            ],
            [
                'name' => 'Francine Mvondo',
                'email' => 'francine.mvondo@startup.cm',
                'phone' => '+237 6 XX XX XX 10',
                'company' => 'E-Shop Cameroun',
                'date' => now()->addDays(20),
                'heure' => '11:00',
                'type_visite' => 'guidee',
                'message' => 'Startup e-commerce cherchant un partenaire fulfillment. Visite pour comprendre vos processus de préparation de commandes.',
                'status' => 'confirmed',
                'notes_admin' => 'Visite confirmée. Prévoir démonstration du système WMS. Guide : Mme Kouam.',
            ],
            [
                'name' => 'Thomas Biya',
                'email' => 'thomas.biya@construction.cm',
                'phone' => '+237 6 XX XX XX 11',
                'company' => 'BTP Construction',
                'date' => now()->subDays(2),
                'heure' => '15:00',
                'type_visite' => 'guidee',
                'message' => 'Visite pour évaluer vos capacités de stockage de matériaux de construction.',
                'status' => 'cancelled',
                'notes_admin' => 'Client a annulé. A trouvé une solution ailleurs.',
            ],
            [
                'name' => 'Sylvie Ondoa',
                'email' => 'sylvie.ondoa@pharma.cm',
                'phone' => '+237 6 XX XX XX 12',
                'company' => 'Pharmacie Centrale',
                'date' => now()->addDays(8),
                'heure' => '10:30',
                'type_visite' => 'guidee',
                'message' => 'Visite de vos chambres froides. Nous importons des produits pharmaceutiques nécessitant une chaîne du froid stricte. Besoin de voir vos certifications.',
                'status' => 'pending',
                'notes_admin' => 'Demande spéciale : prévoir documentation certification GDP.',
            ],
        ];

        foreach ($visitRequests as $visitRequest) {
            VisitRequest::create($visitRequest);
        }
    }
}
