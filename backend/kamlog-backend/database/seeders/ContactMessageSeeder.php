<?php

namespace Database\Seeders;

use App\Models\ContactMessage;
use Illuminate\Database\Seeder;

class ContactMessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $messages = [
            [
                'nom' => 'Kouam',
                'email' => 'marie.kouam@example.com',
                'telephone' => '+237 6 XX XX XX 01',
                'sujet' => 'Demande de devis transport maritime',
                'message' => 'Bonjour, je souhaiterais obtenir un devis pour le transport maritime de 2 conteneurs 40\' de Douala vers Le Havre. Marchandise : équipements industriels. Merci de me contacter rapidement.',
                'statut' => 'nouveau',
                'reponse' => null,
                'date_reponse' => null,
            ],
            [
                'nom' => 'Nkolo',
                'email' => 'paul.nkolo@entreprise.cm',
                'telephone' => '+237 6 XX XX XX 02',
                'sujet' => 'Information sur vos services d\'entreposage',
                'message' => 'Nous recherchons une solution d\'entreposage pour environ 500 palettes de produits alimentaires. Avez-vous des chambres froides disponibles ? Quels sont vos tarifs ?',
                'statut' => 'en_cours',
                'reponse' => 'Bonjour M. Nkolo, merci pour votre message. Nous disposons effectivement de chambres froides. Notre commercial M. Ateba vous contactera dans les 24h pour discuter de vos besoins. Cordialement, KAMLOG',
                'date_reponse' => now()->subHours(2),
            ],
            [
                'nom' => 'Ateba',
                'email' => 'sophie.ateba@gmail.com',
                'telephone' => '+237 6 XX XX XX 03',
                'sujet' => 'Réclamation retard livraison',
                'message' => 'Bonjour, ma commande référence KL-2026-0345 devait être livrée le 20 mars mais je n\'ai toujours rien reçu. Pouvez-vous me donner des informations sur le statut de ma livraison ? C\'est urgent.',
                'statut' => 'traite',
                'reponse' => 'Bonjour Mme Ateba, nous nous excusons pour ce retard. Votre colis a été retenu en douane pour vérification. Il a été libéré ce matin et sera livré demain avant 17h. Nous vous offrons une remise de 20% sur votre prochaine commande. Cordialement, Service Client KAMLOG',
                'date_reponse' => now()->subDays(1),
            ],
            [
                'nom' => 'Mbarga',
                'email' => 'jean.mbarga@startup.cm',
                'telephone' => '+237 6 XX XX XX 04',
                'sujet' => 'Partenariat e-commerce',
                'message' => 'Bonjour, nous sommes une startup e-commerce en pleine croissance. Nous cherchons un partenaire logistique pour gérer notre fulfillment (stockage, préparation commandes, expédition). Proposez-vous ce type de service ?',
                'statut' => 'nouveau',
                'reponse' => null,
                'date_reponse' => null,
            ],
            [
                'nom' => 'Fotso',
                'email' => 'roger.fotso@export.cm',
                'telephone' => '+237 6 XX XX XX 05',
                'sujet' => 'Export vers l\'Europe',
                'message' => 'Nous exportons du cacao vers l\'Europe. Pouvez-vous nous accompagner sur toute la chaîne logistique (transport, dédouanement, assurance) ? Quels sont vos délais moyens Douala-Rotterdam ?',
                'statut' => 'en_cours',
                'reponse' => 'Bonjour M. Fotso, nous avons une grande expérience dans l\'export de cacao. Nos délais Douala-Rotterdam sont de 18-22 jours. Notre responsable export Mme Kouam vous contactera demain pour discuter en détail. Cordialement, KAMLOG',
                'date_reponse' => now()->subHours(5),
            ],
            [
                'nom' => 'Tchoumi',
                'email' => 'alice.tchoumi@import.cm',
                'telephone' => '+237 6 XX XX XX 06',
                'sujet' => 'Dédouanement urgent',
                'message' => 'Bonjour, j\'ai un conteneur bloqué au port depuis 3 jours. Mon transitaire habituel ne répond plus. Pouvez-vous m\'aider en urgence ? Conteneur MAEU1234567.',
                'statut' => 'traite',
                'reponse' => 'Bonjour Mme Tchoumi, nous avons pris en charge votre dossier. Notre agent de transit est déjà sur place. Le conteneur sera dédouané aujourd\'hui. Nous vous tiendrons informée. Cordialement, KAMLOG',
                'date_reponse' => now()->subDays(2),
            ],
            [
                'nom' => 'Kamdem',
                'email' => 'patrick.kamdem@industrie.cm',
                'telephone' => '+237 6 XX XX XX 07',
                'sujet' => 'Visite de vos installations',
                'message' => 'Bonjour, nous envisageons de confier notre logistique à un prestataire externe. Serait-il possible de visiter votre plateforme de Bonabéri la semaine prochaine ?',
                'statut' => 'nouveau',
                'reponse' => null,
                'date_reponse' => null,
            ],
            [
                'nom' => 'Nguema',
                'email' => 'christine.nguema@trading.cm',
                'telephone' => '+237 6 XX XX XX 08',
                'sujet' => 'Tarifs transport routier',
                'message' => 'Bonjour, quels sont vos tarifs pour du transport routier Douala-Yaoundé ? Nous avons environ 10 palettes par semaine à transporter. Possibilité de contrat annuel ?',
                'statut' => 'en_cours',
                'reponse' => null,
                'date_reponse' => null,
            ],
        ];

        foreach ($messages as $message) {
            ContactMessage::create($message);
        }
    }
}
