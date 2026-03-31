<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class DeployProduction extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'deploy:production 
                            {--seed : Run database seeders}
                            {--fresh : Fresh migrate (DANGEROUS — drops all tables)}';

    /**
     * The console command description.
     */
    protected $description = 'Optimiser et déployer l\'application pour la production';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🚀 Déploiement production KAMLOG...');
        $this->newLine();

        // ── 1. Maintenance mode ──
        $this->step('Activation du mode maintenance...');
        $this->call('down', ['--secret' => bin2hex(random_bytes(16))]);

        try {
            // ── 2. Cache clearing ──
            $this->step('Nettoyage des caches...');
            $this->call('cache:clear');
            $this->call('config:clear');
            $this->call('route:clear');
            $this->call('view:clear');
            $this->call('event:clear');

            // ── 3. Database migrations ──
            if ($this->option('fresh')) {
                if (!$this->confirm('⚠️  ATTENTION: --fresh va SUPPRIMER toutes les tables. Continuer ?')) {
                    $this->call('up');
                    return Command::FAILURE;
                }
                $this->step('Migration fresh...');
                $this->call('migrate:fresh', ['--force' => true]);
            } else {
                $this->step('Exécution des migrations...');
                $this->call('migrate', ['--force' => true]);
            }

            // ── 4. Database seeding (optional) ──
            if ($this->option('seed')) {
                $this->step('Exécution des seeders...');
                $this->call('db:seed', ['--force' => true]);
            }

            // ── 5. Optimize for production ──
            $this->step('Optimisation pour la production...');
            $this->call('config:cache');
            $this->call('route:cache');
            $this->call('view:cache');
            $this->call('event:cache');

            // ── 6. Storage link ──
            $this->step('Vérification du lien storage...');
            if (!file_exists(public_path('storage'))) {
                $this->call('storage:link');
            } else {
                $this->info('  ✓ Lien storage déjà existant');
            }

            // ── 7. Prune expired tokens ──
            $this->step('Purge des tokens expirés...');
            $this->call('sanctum:prune-expired', ['--hours' => 48]);

            // ── 8. Queue restart (pick up new code) ──
            $this->step('Redémarrage des workers de queue...');
            $this->call('queue:restart');

            // ── 9. Verify ──
            $this->step('Vérification finale...');
            $routeCount = count(app('router')->getRoutes()->getRoutes());
            $this->info("  ✓ {$routeCount} routes chargées");

        } catch (\Exception $e) {
            $this->error('❌ Erreur durant le déploiement: ' . $e->getMessage());
            $this->call('up');
            return Command::FAILURE;
        }

        // ── 10. Disable maintenance ──
        $this->step('Désactivation du mode maintenance...');
        $this->call('up');

        $this->newLine();
        $this->info('✅ Déploiement terminé avec succès !');
        $this->newLine();

        // Summary
        $this->table(['Paramètre', 'Valeur'], [
            ['Environnement', config('app.env')],
            ['Debug', config('app.debug') ? 'OUI ⚠️' : 'NON ✓'],
            ['Cache driver', config('cache.default')],
            ['Session driver', config('session.driver')],
            ['Queue driver', config('queue.default')],
            ['DB connection', config('database.default')],
        ]);

        if (config('app.debug')) {
            $this->warn('⚠️  APP_DEBUG est activé ! Désactivez-le en production.');
        }

        return Command::SUCCESS;
    }

    /**
     * Afficher un titre d'étape
     */
    private function step(string $message): void
    {
        $this->newLine();
        $this->comment("── {$message}");
    }
}
