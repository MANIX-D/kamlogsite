<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'nom_fr' => 'Transport Maritime',
                'nom_en' => 'Maritime Transport',
                'description_fr' => 'Service complet de transport maritime international. Nous gérons vos expéditions par conteneurs FCL et LCL vers toutes les destinations mondiales avec des délais optimisés et une traçabilité complète.',
                'description_en' => 'Complete international maritime transport service. We manage your FCL and LCL container shipments to all worldwide destinations with optimized deadlines and full traceability.',
                'icon' => 'ship',
                'image' => 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800',
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'nom_fr' => 'Transport Aérien',
                'nom_en' => 'Air Transport',
                'description_fr' => 'Solutions de fret aérien express et standard pour vos envois urgents. Partenariats avec les principales compagnies aériennes pour garantir rapidité et fiabilité.',
                'description_en' => 'Express and standard air freight solutions for your urgent shipments. Partnerships with major airlines to guarantee speed and reliability.',
                'icon' => 'plane',
                'image' => 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'nom_fr' => 'Transport Routier',
                'nom_en' => 'Road Transport',
                'description_fr' => 'Flotte moderne de camions pour le transport routier national et régional. Distribution urbaine, livraisons express et transport de marchandises diverses.',
                'description_en' => 'Modern truck fleet for national and regional road transport. Urban distribution, express deliveries and general cargo transport.',
                'icon' => 'truck',
                'image' => 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800',
                'display_order' => 3,
                'is_active' => true,
            ],
            [
                'nom_fr' => 'Entreposage et Stockage',
                'nom_en' => 'Warehousing and Storage',
                'description_fr' => 'Entrepôts sécurisés et climatisés pour le stockage de vos marchandises. Gestion des stocks en temps réel avec système WMS moderne.',
                'description_en' => 'Secure and climate-controlled warehouses for your goods storage. Real-time inventory management with modern WMS system.',
                'icon' => 'warehouse',
                'image' => 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800',
                'display_order' => 4,
                'is_active' => true,
            ],
            [
                'nom_fr' => 'Dédouanement',
                'nom_en' => 'Customs Clearance',
                'description_fr' => 'Service complet de dédouanement import/export. Nos experts en douane vous accompagnent dans toutes vos démarches administratives.',
                'description_en' => 'Complete import/export customs clearance service. Our customs experts support you through all administrative procedures.',
                'icon' => 'file-text',
                'image' => 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
                'display_order' => 5,
                'is_active' => true,
            ],
            [
                'nom_fr' => 'Transit et Manutention',
                'nom_en' => 'Transit and Handling',
                'description_fr' => 'Services de transit portuaire et manutention avec équipements modernes. Chargement et déchargement de conteneurs, empotage et dépotage.',
                'description_en' => 'Port transit and handling services with modern equipment. Container loading and unloading, stuffing and stripping.',
                'icon' => 'package',
                'image' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
                'display_order' => 6,
                'is_active' => true,
            ],
            [
                'nom_fr' => 'Supply Chain Management',
                'nom_en' => 'Supply Chain Management',
                'description_fr' => 'Optimisation complète de votre chaîne logistique. Conseil, audit et mise en place de solutions sur mesure pour améliorer votre performance logistique.',
                'description_en' => 'Complete optimization of your supply chain. Consulting, auditing and implementation of tailored solutions to improve your logistics performance.',
                'icon' => 'trending-up',
                'image' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
                'display_order' => 7,
                'is_active' => true,
            ],
            [
                'nom_fr' => 'E-commerce Logistique',
                'nom_en' => 'E-commerce Logistics',
                'description_fr' => 'Solutions logistiques dédiées au e-commerce. Préparation de commandes, emballage, expédition et gestion des retours.',
                'description_en' => 'Dedicated e-commerce logistics solutions. Order preparation, packaging, shipping and returns management.',
                'icon' => 'shopping-cart',
                'image' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
                'display_order' => 8,
                'is_active' => false,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
