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
                            {--fresh : Fresh migrate (DANGEROUS — drops all tables)}
                            {--skip-checks : Skip pre-flight checks}';

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

        // ── 0. Pre-flight checks ──
        if (!$this->option('skip-checks') && !$this->preFlightChecks()) {
            return Command::FAILURE;
        }

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
            $this->runPostDeployChecks();

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
            ['PHP version', PHP_VERSION],
            ['OPcache', function_exists('opcache_get_status') && opcache_get_status() ? 'ON ✓' : 'OFF ⚠️'],
        ]);

        $this->printWarnings();

        return Command::SUCCESS;
    }

    /**
     * Vérifications pré-déploiement
     */
    private function preFlightChecks(): bool
    {
        $this->step('Vérifications pré-déploiement...');
        $passed = true;

        // APP_KEY must be set
        if (empty(config('app.key'))) {
            $this->error('  ✗ APP_KEY non définie. Exécutez: php artisan key:generate');
            $passed = false;
        } else {
            $this->info('  ✓ APP_KEY configurée');
        }

        // APP_DEBUG must be false in production
        if (config('app.debug') && config('app.env') === 'production') {
            $this->warn('  ⚠ APP_DEBUG=true en production — sera affiché dans le résumé');
        }

        // PHP extensions
        $requiredExtensions = ['pdo_mysql', 'mbstring', 'openssl', 'tokenizer', 'json', 'gd'];
        foreach ($requiredExtensions as $ext) {
            if (!extension_loaded($ext)) {
                $this->error("  ✗ Extension PHP manquante: {$ext}");
                $passed = false;
            }
        }
        $this->info('  ✓ Extensions PHP requises présentes');

        // Check OPcache
        if (!function_exists('opcache_get_status') || !opcache_get_status()) {
            $this->warn('  ⚠ OPcache désactivé — recommandé pour la production');
        } else {
            $this->info('  ✓ OPcache activé');
        }

        // Check DB connectivity
        try {
            \Illuminate\Support\Facades\DB::connection()->getPdo();
            $this->info('  ✓ Connexion base de données OK');
        } catch (\Exception $e) {
            $this->error('  ✗ Connexion base de données échouée: ' . $e->getMessage());
            $passed = false;
        }

        // Check Redis if configured
        if (in_array(config('cache.default'), ['redis', 'failover'])) {
            try {
                \Illuminate\Support\Facades\Redis::ping();
                $this->info('  ✓ Connexion Redis OK');
            } catch (\Exception $e) {
                $this->error('  ✗ Redis configuré mais inaccessible: ' . $e->getMessage());
                $passed = false;
            }
        }

        // Check writable directories
        $writableDirs = ['storage/app', 'storage/framework/cache', 'storage/framework/sessions', 'storage/framework/views', 'storage/logs', 'bootstrap/cache'];
        foreach ($writableDirs as $dir) {
            $fullPath = base_path($dir);
            if (!is_writable($fullPath)) {
                $this->error("  ✗ Répertoire non accessible en écriture: {$dir}");
                $passed = false;
            }
        }
        $this->info('  ✓ Répertoires accessibles en écriture');

        if (!$passed) {
            $this->error('Vérifications pré-déploiement échouées. Corrigez les erreurs ci-dessus.');
        }

        return $passed;
    }

    /**
     * Vérifications post-déploiement
     */
    private function runPostDeployChecks(): void
    {
        $routeCount = count(app('router')->getRoutes()->getRoutes());
        $this->info("  ✓ {$routeCount} routes chargées");

        // Check cached config exists
        if (file_exists(base_path('bootstrap/cache/config.php'))) {
            $this->info('  ✓ Configuration cachée');
        }

        // Check cached routes exists
        if (file_exists(base_path('bootstrap/cache/routes-v7.php'))) {
            $this->info('  ✓ Routes cachées');
        }

        // Check disk space
        $freeSpace = disk_free_space(storage_path());
        if ($freeSpace !== false) {
            $freeSpaceMB = round($freeSpace / 1024 / 1024);
            if ($freeSpaceMB < 500) {
                $this->warn("  ⚠ Espace disque faible: {$freeSpaceMB} MB");
            } else {
                $this->info("  ✓ Espace disque: {$freeSpaceMB} MB disponible");
            }
        }
    }

    /**
     * Afficher les avertissements de configuration
     */
    private function printWarnings(): void
    {
        $warnings = [];

        if (config('app.debug')) {
            $warnings[] = 'APP_DEBUG est activé — désactivez-le en production';
        }

        if (config('cache.default') === 'database') {
            $warnings[] = 'CACHE_STORE=database — Redis recommandé pour la production';
        }

        if (config('session.driver') === 'database') {
            $warnings[] = 'SESSION_DRIVER=database — Redis recommandé pour la production';
        }

        if (config('queue.default') === 'database') {
            $warnings[] = 'QUEUE_CONNECTION=database — Redis recommandé pour la production';
        }

        if (config('queue.default') === 'sync') {
            $warnings[] = 'QUEUE_CONNECTION=sync — les jobs s\'exécutent de manière synchrone';
        }

        if (config('logging.default') === 'stack' && config('logging.channels.stack.channels', []) === ['single']) {
            $warnings[] = 'LOG_STACK=single — daily recommandé pour la rotation';
        }

        foreach ($warnings as $warning) {
            $this->warn("⚠️  {$warning}");
        }
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
