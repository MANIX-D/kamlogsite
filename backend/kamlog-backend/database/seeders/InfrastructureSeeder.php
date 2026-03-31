<?php

namespace Database\Seeders;

use App\Models\Infrastructure;
use Illuminate\Database\Seeder;

class InfrastructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $infrastructures = [
            [
                'nom_fr' => 'Plateforme Logistique de Douala - Bonabéri',
                'nom_en' => 'Douala - Bonabéri Logistics Platform',
                'description_fr' => 'Notre plateforme principale équipée d\'un système WMS moderne, de quais de chargement/déchargement, d\'espaces de stockage climatisés et sécurisés. Certification ISO 9001:2015.',
                'description_en' => 'Our main platform equipped with a modern WMS system, loading/unloading docks, climate-controlled and secured storage spaces. ISO 9001:2015 certified.',
                'type' => 'entrepot',
                'surface' => '15 000 m²',
                'capacite' => '50 000 palettes',
                'image' => 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200',
                'equipements' => json_encode(['WMS', 'quais de chargement', 'chambres froides', 'système de sécurité']),
                'display_order' => 1,
                'is_active' => true,
                'is_available' => true,
            ],
            [
                'nom_fr' => 'Entrepôt de Yaoundé',
                'nom_en' => 'Yaoundé Warehouse',
                'description_fr' => 'Entrepôt stratégiquement situé dans la capitale, idéal pour la distribution vers le centre du pays. Équipé de chambres froides et d\'espaces sécurisés.',
                'description_en' => 'Strategically located warehouse in the capital, ideal for distribution to the center of the country. Equipped with cold rooms and secured spaces.',
                'type' => 'entrepot',
                'surface' => '8 000 m²',
                'capacite' => '25 000 palettes',
                'image' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200',
                'equipements' => json_encode(['chambres froides', 'racks', 'chariots élévateurs']),
                'display_order' => 2,
                'is_active' => true,
                'is_available' => true,
            ],
            [
                'nom_fr' => 'Hub de Transit Port de Douala',
                'nom_en' => 'Douala Port Transit Hub',
                'description_fr' => 'Plateforme de transit située à proximité immédiate du port autonome de Douala. Dédouanement et manutention rapides des conteneurs import/export.',
                'description_en' => 'Transit platform located in the immediate vicinity of the Douala autonomous port. Fast customs clearance and handling of import/export containers.',
                'type' => 'entrepot',
                'surface' => '5 000 m²',
                'capacite' => '1 000 conteneurs',
                'image' => 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200',
                'equipements' => json_encode(['grues', 'reach stackers', 'zone de dédouanement']),
                'display_order' => 3,
                'is_active' => true,
                'is_available' => true,
            ],
            [
                'nom_fr' => 'Bureau Commercial de Douala',
                'nom_en' => 'Douala Commercial Office',
                'description_fr' => 'Siège social et bureau commercial principal. Équipes commerciales, administratives et de direction. Salles de réunion modernes et espace client.',
                'description_en' => 'Head office and main commercial office. Commercial, administrative and management teams. Modern meeting rooms and client area.',
                'type' => 'bureau',
                'surface' => '500 m²',
                'capacite' => '50 collaborateurs',
                'image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
                'display_order' => 4,
                'is_active' => true,
                'is_available' => true,
            ],
            [
                'nom_fr' => 'Agence de Garoua',
                'nom_en' => 'Garoua Agency',
                'description_fr' => 'Agence commerciale desservant la région du Nord. Services de transport routier, dédouanement et conseil logistique.',
                'description_en' => 'Commercial agency serving the Northern region. Road transport, customs clearance and logistics consulting services.',
                'type' => 'bureau',
                'surface' => '200 m²',
                'capacite' => '15 collaborateurs',
                'image' => null,
                'display_order' => 5,
                'is_active' => true,
                'is_available' => true,
            ],
            [
                'nom_fr' => 'Entrepôt de Limbé',
                'nom_en' => 'Limbé Warehouse',
                'description_fr' => 'Entrepôt desservant la région du Sud-Ouest. Proximité avec le port en eau profonde de Limbé.',
                'description_en' => 'Warehouse serving the South-West region. Close proximity to the deep-water port of Limbé.',
                'type' => 'entrepot',
                'surface' => '3 000 m²',
                'capacite' => '10 000 palettes',
                'image' => null,
                'display_order' => 6,
                'is_active' => true,
                'is_available' => true,
            ],
            [
                'nom_fr' => 'Plateforme de Kribi (En construction)',
                'nom_en' => 'Kribi Platform (Under construction)',
                'description_fr' => 'Future plateforme logistique à proximité du port en eau profonde de Kribi. Ouverture prévue en 2027.',
                'description_en' => 'Future logistics platform near the deep-water port of Kribi. Opening planned for 2027.',
                'type' => 'entrepot',
                'surface' => '12 000 m²',
                'capacite' => '40 000 palettes',
                'image' => null,
                'display_order' => 7,
                'is_active' => false,
                'is_available' => false,
            ],
        ];

        foreach ($infrastructures as $infrastructure) {
            Infrastructure::create($infrastructure);
        }
    }
}
