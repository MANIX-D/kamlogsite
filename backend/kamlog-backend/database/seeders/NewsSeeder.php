<?php

namespace Database\Seeders;

use App\Models\News;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $news = [
            [
                'titre_fr' => 'KAMLOG inaugure sa nouvelle plateforme logistique de Douala',
                'titre_en' => 'KAMLOG inaugurates its new logistics platform in Douala',
                'contenu_fr' => '<p>KAMLOG a officiellement inauguré sa nouvelle plateforme logistique située dans la zone industrielle de Bonabéri à Douala.</p>',
                'contenu_en' => '<p>KAMLOG has officially inaugurated its new logistics platform located in the Bonabéri industrial zone in Douala.</p>',
                'slug_fr' => 'kamlog-inaugure-nouvelle-plateforme-douala',
                'slug_en' => 'kamlog-inaugurates-new-platform-douala',
                'image' => 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200',
                'type' => 'article',
                'date_publication' => now()->subDays(2),
                'views' => 1250,
                'is_featured' => true,
                'is_published' => true,
            ],
            [
                'titre_fr' => 'Partenariat stratégique avec Maersk Line',
                'titre_en' => 'Strategic partnership with Maersk Line',
                'contenu_fr' => '<p>KAMLOG annonce la signature d\'un partenariat stratégique avec Maersk Line, leader mondial du transport maritime conteneurisé.</p>',
                'contenu_en' => '<p>KAMLOG announces the signing of a strategic partnership with Maersk Line, world leader in containerized maritime transport.</p>',
                'slug_fr' => 'partenariat-strategique-maersk-line',
                'slug_en' => 'strategic-partnership-maersk-line',
                'image' => 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200',
                'type' => 'article',
                'date_publication' => now()->subDays(5),
                'views' => 890,
                'is_featured' => true,
                'is_published' => true,
            ],
            [
                'titre_fr' => 'Journée Portes Ouvertes - 15 Avril 2026',
                'titre_en' => 'Open Day - April 15, 2026',
                'contenu_fr' => '<p>KAMLOG organise une Journée Portes Ouvertes le 15 avril 2026 de 9h à 17h dans ses locaux de Douala.</p>',
                'contenu_en' => '<p>KAMLOG is organizing an Open Day on April 15, 2026 from 9am to 5pm at its Douala premises.</p>',
                'slug_fr' => 'journee-portes-ouvertes-15-avril-2026',
                'slug_en' => 'open-day-april-15-2026',
                'image' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
                'type' => 'annonce',
                'date_publication' => now()->addDays(20),
                'views' => 320,
                'is_featured' => true,
                'is_published' => true,
            ],
            [
                'titre_fr' => 'KAMLOG obtient la certification ISO 9001:2015',
                'titre_en' => 'KAMLOG obtains ISO 9001:2015 certification',
                'contenu_fr' => '<p>Nous sommes fiers d\'annoncer que KAMLOG a obtenu la certification ISO 9001:2015 pour son système de management de la qualité.</p>',
                'contenu_en' => '<p>We are proud to announce that KAMLOG has obtained ISO 9001:2015 certification for its quality management system.</p>',
                'slug_fr' => 'kamlog-certification-iso-9001-2015',
                'slug_en' => 'kamlog-iso-9001-2015-certification',
                'image' => 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
                'type' => 'article',
                'date_publication' => now()->subDays(10),
                'views' => 650,
                'is_featured' => false,
                'is_published' => true,
            ],
            [
                'titre_fr' => 'Nouveaux horaires d\'ouverture pendant le Ramadan',
                'titre_en' => 'New opening hours during Ramadan',
                'contenu_fr' => '<p>À l\'occasion du mois de Ramadan, KAMLOG adapte ses horaires d\'ouverture pour mieux servir ses clients.</p>',
                'contenu_en' => '<p>During the month of Ramadan, KAMLOG is adjusting its opening hours to better serve its clients.</p>',
                'slug_fr' => 'nouveaux-horaires-ramadan',
                'slug_en' => 'new-hours-ramadan',
                'image' => null,
                'type' => 'annonce',
                'date_publication' => now()->subDays(15),
                'views' => 420,
                'is_featured' => false,
                'is_published' => true,
            ],
            [
                'titre_fr' => 'Lancement du service de tracking en temps réel',
                'titre_en' => 'Launch of real-time tracking service',
                'contenu_fr' => '<p>KAMLOG lance son nouveau service de tracking en temps réel pour tous les envois.</p>',
                'contenu_en' => '<p>KAMLOG launches its new real-time tracking service for all shipments.</p>',
                'slug_fr' => 'lancement-service-tracking-temps-reel',
                'slug_en' => 'launch-real-time-tracking-service',
                'image' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',
                'type' => 'article',
                'date_publication' => now()->subDays(7),
                'views' => 980,
                'is_featured' => false,
                'is_published' => true,
            ],
            [
                'titre_fr' => 'KAMLOG recrute 50 nouveaux collaborateurs',
                'titre_en' => 'KAMLOG recruits 50 new employees',
                'contenu_fr' => '<p>Dans le cadre de son développement, KAMLOG lance une campagne de recrutement pour 50 postes.</p>',
                'contenu_en' => '<p>As part of its growth, KAMLOG is launching a recruitment campaign for 50 positions.</p>',
                'slug_fr' => 'kamlog-recrute-50-collaborateurs',
                'slug_en' => 'kamlog-recruits-50-employees',
                'image' => 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200',
                'type' => 'offre',
                'date_publication' => now()->subDays(3),
                'views' => 1580,
                'is_featured' => false,
                'is_published' => true,
            ],
            [
                'titre_fr' => 'Brouillon - Expansion vers l\'Afrique de l\'Ouest',
                'titre_en' => 'Draft - Expansion to West Africa',
                'contenu_fr' => '<p>Article en cours de rédaction sur notre projet d\'expansion...</p>',
                'contenu_en' => '<p>Article being drafted about our expansion project...</p>',
                'slug_fr' => 'brouillon-expansion-afrique-ouest',
                'slug_en' => 'draft-expansion-west-africa',
                'image' => null,
                'type' => 'article',
                'date_publication' => now(),
                'views' => 0,
                'is_featured' => false,
                'is_published' => false,
            ],
        ];

        foreach ($news as $item) {
            News::create($item);
        }
    }
}
