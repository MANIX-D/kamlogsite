<?php

namespace App\Console\Commands;

use App\Services\StorageQuotaService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class CheckStorageHealth extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'storage:health';

    /**
     * The console command description.
     */
    protected $description = 'Vérifier la santé du stockage et alerter si nécessaire';

    /**
     * Execute the console command.
     */
    public function handle(StorageQuotaService $quotaService): int
    {
        $this->info('Vérification de la santé du stockage...');

        // Vérifier l'espace disque système
        $systemDisk = $quotaService->checkSystemDiskSpace();
        
        $this->table(
            ['Métrique Système', 'Valeur'],
            [
                ['Espace total', $systemDisk['total_gb'] . ' GB'],
                ['Espace utilisé', $systemDisk['used_gb'] . ' GB'],
                ['Espace libre', $systemDisk['free_gb'] . ' GB'],
                ['Utilisation', $systemDisk['usage_percent'] . '%'],
            ]
        );

        // Alertes
        if ($systemDisk['critical']) {
            $this->error('⚠️  CRITIQUE: Espace disque système < 10%');
            Log::critical('Espace disque critique', $systemDisk);
        } elseif ($systemDisk['warning']) {
            $this->warn('⚠️  ATTENTION: Espace disque système < 20%');
            Log::warning('Espace disque faible', $systemDisk);
        } else {
            $this->info('✓ Espace disque système OK');
        }

        // Vérifier les disques applicatifs
        foreach (['images', 'cvs', 'documents'] as $disk) {
            $stats = $quotaService->getStorageStats($disk);
            
            $this->newLine();
            $this->info("Disque: {$disk}");
            $this->table(
                ['Métrique', 'Valeur'],
                [
                    ['Utilisé', $stats['total_size_mb'] . ' MB'],
                    ['Quota', $stats['quota_mb'] . ' MB'],
                    ['Utilisation', $stats['usage_percent'] . '%'],
                    ['Disponible', $stats['available_mb'] . ' MB'],
                ]
            );

            if ($stats['usage_percent'] > 90) {
                $this->error("⚠️  CRITIQUE: Quota {$disk} > 90%");
                Log::critical("Quota {$disk} critique", $stats);
            } elseif ($stats['usage_percent'] > 80) {
                $this->warn("⚠️  ATTENTION: Quota {$disk} > 80%");
                Log::warning("Quota {$disk} élevé", $stats);
            } else {
                $this->info("✓ Quota {$disk} OK");
            }
        }

        return Command::SUCCESS;
    }
}
