<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $announcements = [
            [
                'title_fr' => 'Maintenance système - 28 Mars 2026',
                'title_en' => 'System Maintenance - March 28, 2026',
                'content_fr' => 'Une maintenance programmée de notre système informatique aura lieu le samedi 28 mars 2026 de 22h00 à 02h00.',
                'content_en' => 'A scheduled maintenance of our IT system will take place on Saturday, March 28, 2026 from 10pm to 2am.',
                'type' => 'maintenance',
                'priority' => 'high',
                'start_date' => now()->addDays(3),
                'end_date' => now()->addDays(4),
                'is_active' => true,
                'is_popup' => true,
            ],
            [
                'title_fr' => 'Nouveaux tarifs 2026',
                'title_en' => 'New 2026 Rates',
                'content_fr' => 'Nos nouveaux tarifs pour l\'année 2026 sont désormais disponibles. Contactez votre commercial.',
                'content_en' => 'Our new rates for 2026 are now available. Contact your sales representative.',
                'type' => 'info',
                'priority' => 'normal',
                'start_date' => now()->subDays(10),
                'end_date' => now()->addDays(20),
                'is_active' => true,
                'is_popup' => false,
            ],
            [
                'title_fr' => 'Promotion Fret Aérien -15%',
                'title_en' => 'Air Freight Promotion -15%',
                'content_fr' => 'Profitez de -15% sur tous vos envois par fret aérien jusqu\'au 31 mars 2026 !',
                'content_en' => 'Get -15% off all your air freight shipments until March 31, 2026!',
                'type' => 'promotion',
                'priority' => 'high',
                'start_date' => now()->subDays(5),
                'end_date' => now()->addDays(6),
                'is_active' => true,
                'is_popup' => true,
            ],
            [
                'title_fr' => 'Alerte Trafic - Port de Douala',
                'title_en' => 'Traffic Alert - Douala Port',
                'content_fr' => 'En raison de travaux d\'extension du port de Douala, des retards sont à prévoir sur les opérations de dédouanement.',
                'content_en' => 'Due to extension works at the port of Douala, delays are expected on customs clearance operations.',
                'type' => 'alerte',
                'priority' => 'urgent',
                'start_date' => now(),
                'end_date' => now()->addDays(15),
                'is_active' => true,
                'is_popup' => true,
            ],
            [
                'title_fr' => 'Réunion partenaires - 10 Avril',
                'title_en' => 'Partners Meeting - April 10',
                'content_fr' => 'Nous organisons une réunion avec nos partenaires stratégiques le 10 avril 2026.',
                'content_en' => 'We are organizing a meeting with our strategic partners on April 10, 2026.',
                'type' => 'info',
                'priority' => 'normal',
                'start_date' => now()->addDays(16),
                'end_date' => now()->addDays(17),
                'is_active' => true,
                'is_popup' => false,
            ],
            [
                'title_fr' => 'Formation interne - Nouveau WMS',
                'title_en' => 'Internal Training - New WMS',
                'content_fr' => 'Formation obligatoire pour tous les employés de l\'entrepôt sur le nouveau système WMS.',
                'content_en' => 'Mandatory training for all warehouse employees on the new WMS system.',
                'type' => 'info',
                'priority' => 'high',
                'start_date' => now()->addDays(7),
                'end_date' => now()->addDays(11),
                'is_active' => true,
                'is_popup' => false,
            ],
            [
                'title_fr' => 'Fermeture exceptionnelle - Fête Nationale',
                'title_en' => 'Exceptional Closure - National Holiday',
                'content_fr' => 'Nos bureaux seront fermés le 20 mai 2026 pour la Fête Nationale.',
                'content_en' => 'Our offices will be closed on May 20, 2026 for the National Holiday.',
                'type' => 'info',
                'priority' => 'normal',
                'start_date' => now()->addDays(56),
                'end_date' => now()->addDays(57),
                'is_active' => true,
                'is_popup' => false,
            ],
            [
                'title_fr' => 'Annonce expirée - Test',
                'title_en' => 'Expired Announcement - Test',
                'content_fr' => 'Cette annonce est expirée et ne devrait plus s\'afficher.',
                'content_en' => 'This announcement has expired and should no longer be displayed.',
                'type' => 'info',
                'priority' => 'low',
                'start_date' => now()->subDays(30),
                'end_date' => now()->subDays(1),
                'is_active' => false,
                'is_popup' => false,
            ],
        ];

        foreach ($announcements as $announcement) {
            Announcement::create($announcement);
        }
    }
}
