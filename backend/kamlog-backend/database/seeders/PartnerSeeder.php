<?php

namespace Database\Seeders;

use App\Models\Partner;
use Illuminate\Database\Seeder;

class PartnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $partners = [
            [
                'name_fr' => 'Maersk Line',
                'name_en' => 'Maersk Line',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Maersk_Group_Logo.svg/320px-Maersk_Group_Logo.svg.png',
                'description_fr' => 'Leader mondial du transport maritime conteneurisé',
                'description_en' => 'World leader in containerized maritime transport',
                'category' => 'transport',
                'website' => 'https://www.maersk.com',
                'partnership_level' => 'strategic',
                'display_order' => 1,
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'name_fr' => 'CMA CGM',
                'name_en' => 'CMA CGM',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/3e/CMA_CGM_logo.svg/320px-CMA_CGM_logo.svg.png',
                'description_fr' => 'Groupe français leader mondial du transport maritime et de la logistique',
                'description_en' => 'French group, world leader in maritime transport and logistics',
                'category' => 'transport',
                'website' => 'https://www.cma-cgm.com',
                'partnership_level' => 'strategic',
                'display_order' => 2,
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'name_fr' => 'MSC Mediterranean Shipping Company',
                'name_en' => 'MSC Mediterranean Shipping Company',
                'logo_url' => 'https://www.msc.com/images/default-source/global/logo.png',
                'description_fr' => 'Deuxième plus grande compagnie de transport maritime au monde',
                'description_en' => 'Second largest shipping company in the world',
                'category' => 'transport',
                'website' => 'https://www.msc.com',
                'partnership_level' => 'strategic',
                'display_order' => 3,
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'name_fr' => 'DHL Global Forwarding',
                'name_en' => 'DHL Global Forwarding',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/320px-DHL_Logo.svg.png',
                'description_fr' => 'Leader mondial de la logistique et du transport express',
                'description_en' => 'World leader in logistics and express transport',
                'category' => 'logistique',
                'website' => 'https://www.dhl.com',
                'partnership_level' => 'premium',
                'display_order' => 4,
                'is_active' => true,
                'is_featured' => false,
            ],
            [
                'name_fr' => 'Air France KLM Cargo',
                'name_en' => 'Air France KLM Cargo',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Air_France_Logo.svg/320px-Air_France_Logo.svg.png',
                'description_fr' => 'Solutions de fret aérien vers le monde entier',
                'description_en' => 'Air freight solutions worldwide',
                'category' => 'transport',
                'website' => 'https://www.afklcargo.com',
                'partnership_level' => 'premium',
                'display_order' => 5,
                'is_active' => true,
                'is_featured' => false,
            ],
            [
                'name_fr' => 'Port Autonome de Douala',
                'name_en' => 'Douala Autonomous Port',
                'logo_url' => 'https://www.pad-cm.com/images/logo.png',
                'description_fr' => 'Principal port maritime du Cameroun',
                'description_en' => 'Main maritime port of Cameroon',
                'category' => 'logistique',
                'website' => 'https://www.pad-cm.com',
                'partnership_level' => 'standard',
                'display_order' => 6,
                'is_active' => true,
                'is_featured' => false,
            ],
            [
                'name_fr' => 'Chambre de Commerce du Cameroun',
                'name_en' => 'Cameroon Chamber of Commerce',
                'logo_url' => null,
                'description_fr' => 'Chambre de Commerce, d\'Industrie, des Mines et de l\'Artisanat',
                'description_en' => 'Chamber of Commerce, Industry, Mines and Crafts',
                'category' => 'autre',
                'website' => 'https://www.ccima.cm',
                'partnership_level' => 'standard',
                'display_order' => 7,
                'is_active' => true,
                'is_featured' => false,
            ],
            [
                'name_fr' => 'Bolloré Logistics',
                'name_en' => 'Bolloré Logistics',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/fr/thumb/f/f5/Bollor%C3%A9_Logistics_logo.svg/320px-Bollor%C3%A9_Logistics_logo.svg.png',
                'description_fr' => 'Solutions logistiques intégrées en Afrique',
                'description_en' => 'Integrated logistics solutions in Africa',
                'category' => 'logistique',
                'website' => 'https://www.bollore-logistics.com',
                'partnership_level' => 'premium',
                'display_order' => 8,
                'is_active' => true,
                'is_featured' => false,
            ],
            [
                'name_fr' => 'CAMRAIL',
                'name_en' => 'CAMRAIL',
                'logo_url' => null,
                'description_fr' => 'Compagnie ferroviaire du Cameroun',
                'description_en' => 'Cameroon railway company',
                'category' => 'transport',
                'website' => 'https://www.camrail.net',
                'partnership_level' => 'standard',
                'display_order' => 9,
                'is_active' => true,
                'is_featured' => false,
            ],
            [
                'name_fr' => 'Total Energies Cameroun',
                'name_en' => 'Total Energies Cameroon',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/fr/thumb/4/49/TotalEnergies_logo.svg/320px-TotalEnergies_logo.svg.png',
                'description_fr' => 'Partenaire énergétique pour nos opérations',
                'description_en' => 'Energy partner for our operations',
                'category' => 'autre',
                'website' => 'https://www.totalenergies.cm',
                'partnership_level' => 'basic',
                'display_order' => 10,
                'is_active' => true,
                'is_featured' => false,
            ],
        ];

        foreach ($partners as $partner) {
            Partner::create($partner);
        }
    }
}
