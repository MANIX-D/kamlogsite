<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Admin\MetricsController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\InfrastructureController;
use App\Http\Controllers\Api\JobOfferController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\NewsletterSubscriberController;
use App\Http\Controllers\Api\VisitRequestController;
use App\Http\Controllers\Api\QuoteRequestController;
use App\Http\Controllers\Api\FileUploadController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\StorageController;

/*
|--------------------------------------------------------------------------
| API Routes KAMLOG
|--------------------------------------------------------------------------
|
| Routes API RESTful pour le backend KAMLOG
| - Routes publiques (lecture + soumissions)
| - Routes admin protégées par Sanctum
| - Rate limiting sur routes sensibles
|
*/

// API Version 1 — Rate limiting global par IP/user
Route::prefix('v1')->middleware(['throttle:api'])->group(function () {
    
    // ============================================
    // ROUTES PUBLIQUES
    // ============================================
    
    // -------------------- Auth Admin --------------------
    Route::prefix('admin/auth')->group(function () {
        Route::post('/login', [AdminAuthController::class, 'login'])
            ->middleware('throttle:login');
    });

    // -------------------- Services (Public) --------------------
    Route::prefix('services')->group(function () {
        Route::get('/', [ServiceController::class, 'index']);
        Route::get('/{id}', [ServiceController::class, 'show'])->where('id', '[0-9]+');
    });

    // -------------------- Actualités (Public) --------------------
    Route::prefix('news')->group(function () {
        Route::get('/', [NewsController::class, 'index']);
        Route::get('/slug/{slug}', [NewsController::class, 'showBySlug']); // DOIT être avant /{id}
        Route::get('/{id}', [NewsController::class, 'show'])->where('id', '[0-9]+');
    });

    // -------------------- Partenaires (Public) --------------------
    Route::prefix('partners')->group(function () {
        Route::get('/', [PartnerController::class, 'index']);
        Route::get('/{id}', [PartnerController::class, 'show'])->where('id', '[0-9]+');
    });

    // -------------------- Infrastructures (Public) --------------------
    Route::prefix('infrastructures')->group(function () {
        Route::get('/', [InfrastructureController::class, 'index']);
        Route::get('/{id}', [InfrastructureController::class, 'show'])->where('id', '[0-9]+');
    });

    // -------------------- Offres d'Emploi (Public) --------------------
    Route::prefix('jobs')->group(function () {
        Route::get('/', [JobOfferController::class, 'index']);
        Route::get('/{id}', [JobOfferController::class, 'show'])->where('id', '[0-9]+');
    });

    // -------------------- Annonces (Public) --------------------
    Route::prefix('announcements')->group(function () {
        Route::get('/', [AnnouncementController::class, 'index']);
        Route::get('/{id}', [AnnouncementController::class, 'show'])->where('id', '[0-9]+');
    });

    // -------------------- Formulaires Publics (avec rate limiting) --------------------
    
    // Contact
    Route::post('/contact', [ContactMessageController::class, 'store'])
        ->middleware('throttle:public-form');
    
    // Newsletter
    Route::post('/newsletter/subscribe', [NewsletterSubscriberController::class, 'subscribe'])
        ->middleware('throttle:public-form');
    Route::get('/newsletter/unsubscribe/{token}', [NewsletterSubscriberController::class, 'unsubscribe']);
    
    // Demande de visite
    Route::post('/visit-requests', [VisitRequestController::class, 'store'])
        ->middleware('throttle:public-form');
    
    // Demande de devis
    Route::post('/quote-requests', [QuoteRequestController::class, 'store'])
        ->middleware('throttle:public-form');
    
    // Upload CV (public - pour candidatures)
    Route::post('/upload/cv', [FileUploadController::class, 'uploadCV'])
        ->middleware('throttle:uploads');

    // ============================================
    // ROUTES PROTÉGÉES PAR SANCTUM
    // ============================================
    
    Route::middleware(['auth:sanctum'])->group(function () {
        
        // -------------------- Auth Admin (Authentifié) --------------------
        Route::prefix('admin/auth')->group(function () {
            Route::post('/logout', [AdminAuthController::class, 'logout']);
            Route::post('/logout-all', [AdminAuthController::class, 'logoutAll']);
            Route::get('/me', [AdminAuthController::class, 'me']);
            Route::post('/refresh', [AdminAuthController::class, 'refresh'])
                ->middleware('throttle:10,1');
        });

        // ============================================
        // ROUTES ADMIN PAR RÔLE
        // ============================================

        // -------------------- Super Admin Uniquement --------------------
        Route::prefix('admin')->middleware(['role:super_admin'])->group(function () {
            
            // Métriques d'authentification
            Route::prefix('metrics')->group(function () {
                Route::get('/auth/today', [MetricsController::class, 'today']);
                Route::get('/auth/period', [MetricsController::class, 'period']);
            });

            // Gestion des utilisateurs (à implémenter)
            // Route::apiResource('users', UserController::class);
        });

        // -------------------- Admin & Super Admin --------------------
        Route::prefix('admin')->middleware(['role:super_admin,admin', 'throttle:admin-write'])->group(function () {
            
            // Tableau de bord
            Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

            // Services - CRUD complet
            Route::prefix('services')->group(function () {
                Route::post('/', [ServiceController::class, 'store']);
                Route::put('/{id}', [ServiceController::class, 'update'])->where('id', '[0-9]+');
                Route::delete('/{id}', [ServiceController::class, 'destroy'])->where('id', '[0-9]+');
                Route::post('/{id}/restore', [ServiceController::class, 'restore'])->where('id', '[0-9]+');
            });

            // Actualités - CRUD complet
            Route::prefix('news')->group(function () {
                Route::post('/', [NewsController::class, 'store']);
                Route::put('/{id}', [NewsController::class, 'update'])->where('id', '[0-9]+');
                Route::delete('/{id}', [NewsController::class, 'destroy'])->where('id', '[0-9]+');
                Route::post('/{id}/restore', [NewsController::class, 'restore'])->where('id', '[0-9]+');
            });

            // Partenaires - CRUD complet
            Route::prefix('partners')->group(function () {
                Route::post('/', [PartnerController::class, 'store']);
                Route::put('/{id}', [PartnerController::class, 'update'])->where('id', '[0-9]+');
                Route::delete('/{id}', [PartnerController::class, 'destroy'])->where('id', '[0-9]+');
                Route::post('/{id}/restore', [PartnerController::class, 'restore'])->where('id', '[0-9]+');
            });

            // Infrastructures - CRUD complet
            Route::prefix('infrastructures')->group(function () {
                Route::post('/', [InfrastructureController::class, 'store']);
                Route::put('/{id}', [InfrastructureController::class, 'update'])->where('id', '[0-9]+');
                Route::delete('/{id}', [InfrastructureController::class, 'destroy'])->where('id', '[0-9]+');
                Route::post('/{id}/restore', [InfrastructureController::class, 'restore'])->where('id', '[0-9]+');
            });

            // Offres d'emploi - CRUD complet
            Route::prefix('jobs')->group(function () {
                Route::post('/', [JobOfferController::class, 'store']);
                Route::put('/{id}', [JobOfferController::class, 'update'])->where('id', '[0-9]+');
                Route::delete('/{id}', [JobOfferController::class, 'destroy'])->where('id', '[0-9]+');
                Route::post('/{id}/restore', [JobOfferController::class, 'restore'])->where('id', '[0-9]+');
            });

            // Annonces - CRUD complet
            Route::prefix('announcements')->group(function () {
                Route::post('/', [AnnouncementController::class, 'store']);
                Route::put('/{id}', [AnnouncementController::class, 'update'])->where('id', '[0-9]+');
                Route::delete('/{id}', [AnnouncementController::class, 'destroy'])->where('id', '[0-9]+');
                Route::post('/{id}/restore', [AnnouncementController::class, 'restore'])->where('id', '[0-9]+');
            });

            // Messages de contact - Gestion
            Route::prefix('contact-messages')->group(function () {
                Route::get('/', [ContactMessageController::class, 'index']);
                Route::get('/{id}', [ContactMessageController::class, 'show'])->where('id', '[0-9]+');
                Route::put('/{id}', [ContactMessageController::class, 'update'])->where('id', '[0-9]+');
                Route::post('/{id}/mark-read', [ContactMessageController::class, 'markAsRead'])->where('id', '[0-9]+');
                Route::delete('/{id}', [ContactMessageController::class, 'destroy'])->where('id', '[0-9]+');
            });

            // Newsletter - Gestion des abonnés
            Route::prefix('newsletter')->group(function () {
                Route::get('/subscribers', [NewsletterSubscriberController::class, 'index']);
                Route::get('/subscribers/{id}', [NewsletterSubscriberController::class, 'show'])->where('id', '[0-9]+');
                Route::delete('/subscribers/{id}', [NewsletterSubscriberController::class, 'destroy'])->where('id', '[0-9]+');
            });

            // Demandes de visite - Gestion
            Route::prefix('visit-requests')->group(function () {
                Route::get('/', [VisitRequestController::class, 'index']);
                Route::get('/{id}', [VisitRequestController::class, 'show'])->where('id', '[0-9]+');
                Route::put('/{id}', [VisitRequestController::class, 'update'])->where('id', '[0-9]+');
                Route::post('/{id}/confirm', [VisitRequestController::class, 'confirm'])->where('id', '[0-9]+');
                Route::post('/{id}/cancel', [VisitRequestController::class, 'cancel'])->where('id', '[0-9]+');
                Route::delete('/{id}', [VisitRequestController::class, 'destroy'])->where('id', '[0-9]+');
            });

            // Demandes de devis - Gestion
            Route::prefix('quote-requests')->group(function () {
                Route::get('/', [QuoteRequestController::class, 'index']);
                Route::get('/{id}', [QuoteRequestController::class, 'show'])->where('id', '[0-9]+');
                Route::put('/{id}', [QuoteRequestController::class, 'update'])->where('id', '[0-9]+');
                Route::delete('/{id}', [QuoteRequestController::class, 'destroy'])->where('id', '[0-9]+');
            });

            // Gestion des fichiers
            Route::prefix('files')->group(function () {
                // Images
                Route::post('/images/upload', [FileUploadController::class, 'uploadImage'])
                    ->middleware('throttle:uploads');
                Route::delete('/images', [FileUploadController::class, 'deleteImage']);
                Route::get('/images/info', [FileUploadController::class, 'getImageInfo']);
                
                // CV
                Route::get('/cvs/download', [FileUploadController::class, 'downloadCV']);
                Route::delete('/cvs', [FileUploadController::class, 'deleteCV']);
            });

            // Monitoring du stockage
            Route::prefix('storage')->group(function () {
                Route::get('/stats', [StorageController::class, 'stats']);
                Route::get('/stats/all', [StorageController::class, 'allStats']);
                Route::get('/folder-size', [StorageController::class, 'folderSize']);
                Route::get('/health', [StorageController::class, 'health']);
            });
        });

        // -------------------- Tous les Admins (Editor, Admin, Super Admin) --------------------
        Route::prefix('admin')->middleware(['role:super_admin,admin,editor'])->group(function () {
            
            // Lecture seule pour les éditeurs
            Route::prefix('services')->group(function () {
                Route::get('/', [ServiceController::class, 'index']);
                Route::get('/{id}', [ServiceController::class, 'show'])->where('id', '[0-9]+');
            });

            Route::prefix('news')->group(function () {
                Route::get('/', [NewsController::class, 'index']);
                Route::get('/{id}', [NewsController::class, 'show'])->where('id', '[0-9]+');
            });

            Route::prefix('partners')->group(function () {
                Route::get('/', [PartnerController::class, 'index']);
                Route::get('/{id}', [PartnerController::class, 'show'])->where('id', '[0-9]+');
            });

            Route::prefix('infrastructures')->group(function () {
                Route::get('/', [InfrastructureController::class, 'index']);
                Route::get('/{id}', [InfrastructureController::class, 'show'])->where('id', '[0-9]+');
            });

            Route::prefix('jobs')->group(function () {
                Route::get('/', [JobOfferController::class, 'index']);
                Route::get('/{id}', [JobOfferController::class, 'show'])->where('id', '[0-9]+');
            });

            Route::prefix('announcements')->group(function () {
                Route::get('/', [AnnouncementController::class, 'index']);
                Route::get('/{id}', [AnnouncementController::class, 'show'])->where('id', '[0-9]+');
            });
        });
    });
});
