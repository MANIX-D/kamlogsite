<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration CORS pour l'API KAMLOG
    | Permet au frontend (React/Vite) de communiquer avec le backend Laravel
    |
    | En production, définir CORS_ALLOWED_ORIGINS dans .env :
    | CORS_ALLOWED_ORIGINS=https://kamlog.com,https://www.kamlog.com,https://admin.kamlog.com
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => array_filter(array_merge(
        // Origines de développement (ignorées si APP_ENV=production)
        env('APP_ENV') !== 'production' ? [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:8000',
            'http://localhost:8000',
        ] : [],
        // Origines de production (via .env)
        array_filter(explode(',', (string) env('CORS_ALLOWED_ORIGINS', '')))
    )),

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
        'Origin',
        'X-XSRF-TOKEN',
    ],

    'exposed_headers' => [
        'X-Total-Count',
        'X-Page-Count',
        'X-Per-Page',
        'X-Current-Page',
    ],

    // Cache les réponses preflight pendant 2 heures (réduit les requêtes OPTIONS)
    'max_age' => 7200,

    'supports_credentials' => true,

];
