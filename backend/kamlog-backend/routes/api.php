<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\Admin\MetricsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\InvitationController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\InfrastructureController;
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

    // -------------------- Mot de passe oublié (Public) --------------------
    Route::prefix('password-reset')->middleware('throttle:login')->group(function () {
        Route::post('/send', [PasswordResetController::class, 'sendResetLink']);
        Route::get('/{token}/validate', [PasswordResetController::class, 'validateToken']);
        Route::post('/{token}/verify-code', [PasswordResetController::class, 'verifyCode']);
        Route::post('/{token}/reset', [PasswordResetController::class, 'resetPassword']);
    });

    // -------------------- Invitations (Public) --------------------
    Route::prefix('invitations')->group(function () {
        Route::get('/{token}/validate', [InvitationController::class, 'validateToken']);
        Route::post('/{token}/register', [InvitationController::class, 'register'])
            ->middleware('throttle:login');
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

        // -------------------- Profil (tous les admins authentifiés) --------------------
        Route::prefix('admin/profile')->group(function () {
            Route::get('/', [ProfileController::class, 'show']);
            Route::put('/', [ProfileController::class, 'update']);
            Route::put('/password', [ProfileController::class, 'updatePassword']);
        });

        // ============================================
        // ROUTES ADMIN PAR RÔLE
        // ============================================

        // -------------------- Gestion Utilisateurs (Super Admin + Admin — lecture) --------------------
        Route::prefix('admin')->middleware(['role:super_admin,admin'])->group(function () {

            // Utilisateurs
            Route::prefix('users')->group(function () {
                Route::get('/', [UserController::class, 'index']);
                Route::get('/{id}', [UserController::class, 'show'])->where('id', '[0-9]+');
            });
        });

        // -------------------- Invitations (Super Admin uniquement) --------------------
        Route::prefix('admin')->middleware(['role:super_admin'])->group(function () {

            // Gestion des utilisateurs (write)
            Route::prefix('users')->group(function () {
                Route::put('/{id}', [UserController::class, 'update'])->where('id', '[0-9]+');
                Route::put('/{id}/toggle-active', [UserController::class, 'toggleActive'])->where('id', '[0-9]+');
                Route::delete('/{id}', [UserController::class, 'destroy'])->where('id', '[0-9]+');
            });

            // Invitations
            Route::prefix('invitations')->group(function () {
                Route::get('/', [InvitationController::class, 'index']);
                Route::post('/', [InvitationController::class, 'store']);
                Route::delete('/{id}', [InvitationController::class, 'destroy'])->where('id', '[0-9]+');
            });

            // Métriques d'authentification
            Route::prefix('metrics')->group(function () {
                Route::get('/auth/today', [MetricsController::class, 'today']);
                Route::get('/auth/period', [MetricsController::class, 'period']);
            });
        });

        // -------------------- Tous les Admins — Lecture --------------------
        Route::prefix('admin')->middleware(['role:super_admin,admin'])->group(function () {

            // Tableau de bord
            Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

            // Lecture — Actualités
            Route::prefix('news')->group(function () {
                Route::get('/', [NewsController::class, 'index']);
                Route::get('/{id}', [NewsController::class, 'show'])->where('id', '[0-9]+');
            });

            // Lecture — Partenaires
            Route::prefix('partners')->group(function () {
                Route::get('/', [PartnerController::class, 'index']);
                Route::get('/{id}', [PartnerController::class, 'show'])->where('id', '[0-9]+');
            });

            // Lecture — Infrastructures
            Route::prefix('infrastructures')->group(function () {
                Route::get('/', [InfrastructureController::class, 'index']);
                Route::get('/{id}', [InfrastructureController::class, 'show'])->where('id', '[0-9]+');
            });

            // Lecture — Messages
            Route::prefix('contact-messages')->group(function () {
                Route::get('/', [ContactMessageController::class, 'index']);
                Route::get('/{id}', [ContactMessageController::class, 'show'])->where('id', '[0-9]+');
            });

            // Lecture — Newsletter
            Route::prefix('newsletter')->group(function () {
                Route::get('/subscribers', [NewsletterSubscriberController::class, 'index']);
            });

            // Lecture — Demandes de visite
            Route::prefix('visit-requests')->group(function () {
                Route::get('/', [VisitRequestController::class, 'index']);
                Route::get('/{id}', [VisitRequestController::class, 'show'])->where('id', '[0-9]+');
            });

            // Lecture — Demandes de devis
            Route::prefix('quote-requests')->group(function () {
                Route::get('/', [QuoteRequestController::class, 'index']);
                Route::get('/{id}', [QuoteRequestController::class, 'show'])->where('id', '[0-9]+');
            });
        });

        // -------------------- Admin & Super Admin — Écriture --------------------
        Route::prefix('admin')->middleware(['role:super_admin,admin', 'throttle:admin-write'])->group(function () {

            // Actualités — CUD
            Route::prefix('news')->group(function () {
                Route::post('/', [NewsController::class, 'store']);
                Route::put('/{id}', [NewsController::class, 'update'])->where('id', '[0-9]+');
                Route::delete('/{id}', [NewsController::class, 'destroy'])->where('id', '[0-9]+');
                Route::post('/{id}/restore', [NewsController::class, 'restore'])->where('id', '[0-9]+');
            });

            // Partenaires — CUD
            Route::prefix('partners')->group(function () {
                Route::post('/', [PartnerController::class, 'store']);
                Route::put('/{id}', [PartnerController::class, 'update'])->where('id', '[0-9]+');
                Route::delete('/{id}', [PartnerController::class, 'destroy'])->where('id', '[0-9]+');
                Route::post('/{id}/restore', [PartnerController::class, 'restore'])->where('id', '[0-9]+');
            });

            // Infrastructures — CUD
            Route::prefix('infrastructures')->group(function () {
                Route::post('/', [InfrastructureController::class, 'store']);
                Route::put('/{id}', [InfrastructureController::class, 'update'])->where('id', '[0-9]+');
                Route::delete('/{id}', [InfrastructureController::class, 'destroy'])->where('id', '[0-9]+');
                Route::post('/{id}/restore', [InfrastructureController::class, 'restore'])->where('id', '[0-9]+');
            });

            // Messages — Écriture
            Route::prefix('contact-messages')->group(function () {
                Route::put('/{id}', [ContactMessageController::class, 'update'])->where('id', '[0-9]+');
                Route::post('/{id}/mark-read', [ContactMessageController::class, 'markAsRead'])->where('id', '[0-9]+');
                Route::delete('/{id}', [ContactMessageController::class, 'destroy'])->where('id', '[0-9]+');
            });

            // Newsletter — Écriture
            Route::prefix('newsletter')->group(function () {
                Route::get('/subscribers/{id}', [NewsletterSubscriberController::class, 'show'])->where('id', '[0-9]+');
                Route::delete('/subscribers/{id}', [NewsletterSubscriberController::class, 'destroy'])->where('id', '[0-9]+');
            });

            // Demandes de visite — Écriture
            Route::prefix('visit-requests')->group(function () {
                Route::put('/{id}', [VisitRequestController::class, 'update'])->where('id', '[0-9]+');
                Route::post('/{id}/confirm', [VisitRequestController::class, 'confirm'])->where('id', '[0-9]+');
                Route::post('/{id}/cancel', [VisitRequestController::class, 'cancel'])->where('id', '[0-9]+');
                Route::delete('/{id}', [VisitRequestController::class, 'destroy'])->where('id', '[0-9]+');
            });

            // Demandes de devis — Écriture
            Route::prefix('quote-requests')->group(function () {
                Route::put('/{id}', [QuoteRequestController::class, 'update'])->where('id', '[0-9]+');
                Route::delete('/{id}', [QuoteRequestController::class, 'destroy'])->where('id', '[0-9]+');
            });

            // Gestion des fichiers
            Route::prefix('files')->group(function () {
                Route::post('/images/upload', [FileUploadController::class, 'uploadImage'])
                    ->middleware('throttle:uploads');
                Route::delete('/images', [FileUploadController::class, 'deleteImage']);
                Route::get('/images/info', [FileUploadController::class, 'getImageInfo']);
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
    });
});
