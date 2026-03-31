<?php

namespace App\Console\Commands;

use App\Services\StorageQuotaService;
use Illuminate\Console\Command;

class CleanupOldFiles extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'storage:cleanup {--disk=images} {--days=90}';

    /**
     * The console command description.
     */
    protected $description = 'Nettoyer les fichiers anciens du stockage';

    /**
     * Execute the console command.
     */
    public function handle(StorageQuotaService $quotaService): int
    {
        $disk = $this->option('disk');
        $days = (int) $this->option('days');

        $this->info("Nettoyage des fichiers de plus de {$days} jours sur le disque '{$disk}'...");

        $deletedCount = $quotaService->cleanupOldFiles($disk, $days);

        $this->info("✓ {$deletedCount} fichier(s) supprimé(s)");

        // Afficher les statistiques
        $stats = $quotaService->getStorageStats($disk);
        $this->table(
            ['Métrique', 'Valeur'],
            [
                ['Espace utilisé', $stats['total_size_mb'] . ' MB'],
                ['Quota', $stats['quota_mb'] . ' MB'],
                ['Utilisation', $stats['usage_percent'] . '%'],
                ['Disponible', $stats['available_mb'] . ' MB'],
            ]
        );

        return Command::SUCCESS;
    }
}
