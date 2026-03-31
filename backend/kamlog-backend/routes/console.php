<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Production Scheduled Tasks
|--------------------------------------------------------------------------
|
| Run: php artisan schedule:work (dev) or crontab: * * * * * php artisan schedule:run
|
*/

// Purger les tokens Sanctum expirés — tous les jours à 2h
Schedule::command('sanctum:prune-expired --hours=48')
    ->daily()
    ->at('02:00')
    ->withoutOverlapping()
    ->onOneServer()
    ->appendOutputTo(storage_path('logs/schedule.log'));

// Vérifier la santé du stockage — tous les jours à 6h
Schedule::command('storage:health')
    ->daily()
    ->at('06:00')
    ->withoutOverlapping()
    ->onOneServer()
    ->appendOutputTo(storage_path('logs/schedule.log'));

// Nettoyer les fichiers temporaires anciens (> 90 jours) — tous les dimanches à 3h
Schedule::command('storage:cleanup --disk=images --days=90')
    ->weekly()
    ->sundays()
    ->at('03:00')
    ->withoutOverlapping()
    ->onOneServer()
    ->appendOutputTo(storage_path('logs/schedule.log'));

// Purger les sessions expirées (si driver database) — tous les jours à 4h
Schedule::command('session:gc')
    ->daily()
    ->at('04:00')
    ->withoutOverlapping()
    ->onOneServer();

// Purger les jobs échoués de plus de 7 jours — tous les jours à 5h
Schedule::command('queue:prune-failed --hours=168')
    ->daily()
    ->at('05:00')
    ->withoutOverlapping()
    ->onOneServer();
