<?php

namespace Database\Seeders;

use App\Models\NewsletterSubscriber;
use Illuminate\Database\Seeder;

class NewsletterSubscriberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subscribers = [
            [
                'email' => 'marie.kouam@example.com',
                'nom' => 'Kouam',
                'prenom' => 'Marie',
                'statut' => 'actif',
                'token_desinscription' => bin2hex(random_bytes(32)),
                'date_inscription' => now()->subDays(120),
                'date_desinscription' => null,
            ],
            [
                'email' => 'paul.nkolo@entreprise.cm',
                'nom' => 'Nkolo',
                'prenom' => 'Paul',
                'statut' => 'actif',
                'token_desinscription' => bin2hex(random_bytes(32)),
                'date_inscription' => now()->subDays(90),
                'date_desinscription' => null,
            ],
            [
                'email' => 'sophie.ateba@gmail.com',
                'nom' => 'Ateba',
                'prenom' => 'Sophie',
                'statut' => 'actif',
                'token_desinscription' => bin2hex(random_bytes(32)),
                'date_inscription' => now()->subDays(60),
                'date_desinscription' => null,
            ],
            [
                'email' => 'jean.mbarga@startup.cm',
                'nom' => 'Mbarga',
                'prenom' => 'Jean',
                'statut' => 'actif',
                'token_desinscription' => bin2hex(random_bytes(32)),
                'date_inscription' => now()->subDays(45),
                'date_desinscription' => null,
            ],
            [
                'email' => 'roger.fotso@export.cm',
                'nom' => 'Fotso',
                'prenom' => 'Roger',
                'statut' => 'actif',
                'token_desinscription' => bin2hex(random_bytes(32)),
                'date_inscription' => now()->subDays(30),
                'date_desinscription' => null,
            ],
            [
                'email' => 'alice.tchoumi@import.cm',
                'nom' => 'Tchoumi',
                'prenom' => 'Alice',
                'statut' => 'desinscrit',
                'token_desinscription' => bin2hex(random_bytes(32)),
                'date_inscription' => now()->subDays(200),
                'date_desinscription' => now()->subDays(10),
            ],
            [
                'email' => 'patrick.kamdem@industrie.cm',
                'nom' => 'Kamdem',
                'prenom' => 'Patrick',
                'statut' => 'actif',
                'token_desinscription' => bin2hex(random_bytes(32)),
                'date_inscription' => now()->subDays(15),
                'date_desinscription' => null,
            ],
            [
                'email' => 'christine.nguema@trading.cm',
                'nom' => 'Nguema',
                'prenom' => 'Christine',
                'statut' => 'actif',
                'token_desinscription' => bin2hex(random_bytes(32)),
                'date_inscription' => now()->subDays(5),
                'date_desinscription' => null,
            ],
            [
                'email' => 'info@logistique-plus.cm',
                'nom' => null,
                'prenom' => null,
                'statut' => 'actif',
                'token_desinscription' => bin2hex(random_bytes(32)),
                'date_inscription' => now()->subDays(80),
                'date_desinscription' => null,
            ],
            [
                'email' => 'contact@transport-express.cm',
                'nom' => null,
                'prenom' => null,
                'statut' => 'actif',
                'token_desinscription' => bin2hex(random_bytes(32)),
                'date_inscription' => now()->subDays(100),
                'date_desinscription' => null,
            ],
        ];

        foreach ($subscribers as $subscriber) {
            NewsletterSubscriber::create($subscriber);
        }
    }
}
