<?php

/**
 * Configuration d'optimisation de base de données pour la production
 * 
 * Ce fichier contient les recommandations pour optimiser MySQL en production
 */

return [
    
    /*
    |--------------------------------------------------------------------------
    | Optimisations MySQL pour Production
    |--------------------------------------------------------------------------
    |
    | Configuration recommandée dans my.cnf ou my.ini
    |
    */
    
    'mysql_config' => [
        // InnoDB Buffer Pool (75% de la RAM disponible pour MySQL)
        'innodb_buffer_pool_size' => '2G',
        
        // Fichiers de log InnoDB
        'innodb_log_file_size' => '512M',
        'innodb_log_buffer_size' => '16M',
        
        // Optimisation des connexions
        'max_connections' => 200,
        'max_allowed_packet' => '64M',
        
        // Query Cache (désactivé dans MySQL 8.0+)
        'query_cache_type' => 0,
        'query_cache_size' => 0,
        
        // Table Cache
        'table_open_cache' => 4000,
        'table_definition_cache' => 2000,
        
        // Thread Cache
        'thread_cache_size' => 50,
        
        // Optimisation InnoDB
        'innodb_flush_log_at_trx_commit' => 2,
        'innodb_flush_method' => 'O_DIRECT',
        'innodb_file_per_table' => 1,
        
        // Optimisation des lectures
        'read_buffer_size' => '2M',
        'read_rnd_buffer_size' => '4M',
        'sort_buffer_size' => '4M',
        'join_buffer_size' => '4M',
        
        // Slow Query Log
        'slow_query_log' => 1,
        'long_query_time' => 2,
        'log_queries_not_using_indexes' => 1,
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Index recommandés
    |--------------------------------------------------------------------------
    |
    | Liste des index créés pour optimiser les performances
    |
    */
    
    'indexes' => [
        'services' => [
            'is_active',
            'display_order',
            'composite: is_active + display_order',
        ],
        'news' => [
            'type',
            'date_publication',
            'is_published',
            'is_featured',
            'slug_fr (unique)',
            'slug_en (unique)',
            'composite: is_published + date_publication',
            'composite: type + is_published',
        ],
        'partners' => [
            'category',
            'is_active',
            'is_featured',
            'display_order',
            'partnership_level',
            'composite: is_active + display_order',
            'composite: category + is_active',
        ],
        'infrastructures' => [
            'type',
            'is_active',
            'is_available',
            'display_order',
            'composite: is_active + is_available',
            'composite: type + is_active',
        ],
        'contact_messages' => [
            'email',
            'statut',
            'lu',
            'created_at',
            'composite: statut + lu',
            'composite: statut + created_at',
        ],
        'newsletter_subscribers' => [
            'email (unique)',
            'statut',
            'date_inscription',
            'composite: statut + date_inscription',
        ],
        'visit_requests' => [
            'email',
            'date',
            'status',
            'type_visite',
            'composite: status + date',
            'composite: date + status',
        ],
        'announcements' => [
            'is_active',
            'priority',
            'type',
            'start_date',
            'end_date',
            'composite: is_active + start_date + end_date',
            'composite: priority + is_active',
        ],
        'job_offers' => [
            'is_active',
            'is_urgent',
            'contract_type',
            'experience_level',
            'location',
            'application_deadline',
            'composite: is_active + application_deadline',
            'composite: contract_type + is_active',
            'composite: location + is_active',
        ],
        'job_applications' => [
            'email',
            'status',
            'application_date',
            'composite: job_offer_id + status',
            'composite: status + application_date',
        ],
        'quote_requests' => [
            'email',
            'status',
            'priority',
            'service_type',
            'created_at',
            'composite: status + priority',
            'composite: service_type + status',
            'composite: status + created_at',
        ],
        'users' => [
            'email (unique)',
            'role',
            'is_active',
            'last_login_at',
            'composite: is_active + role',
        ],
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Recommandations de maintenance
    |--------------------------------------------------------------------------
    */
    
    'maintenance' => [
        'daily' => [
            'Vérifier les logs de requêtes lentes',
            'Monitorer l\'utilisation du buffer pool',
        ],
        'weekly' => [
            'ANALYZE TABLE pour mettre à jour les statistiques',
            'Vérifier la fragmentation des tables',
        ],
        'monthly' => [
            'OPTIMIZE TABLE pour défragmenter',
            'Réviser les index non utilisés',
            'Analyser les performances des requêtes',
        ],
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Commandes utiles
    |--------------------------------------------------------------------------
    */
    
    'useful_commands' => [
        'analyze_all_tables' => 'ANALYZE TABLE services, news, partners, infrastructures, contact_messages, newsletter_subscribers, visit_requests, announcements, job_offers, job_applications, quote_requests, users;',
        'check_table_sizes' => 'SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)" FROM information_schema.TABLES WHERE table_schema = "kamlog" ORDER BY (data_length + index_length) DESC;',
        'check_index_usage' => 'SELECT * FROM sys.schema_unused_indexes WHERE object_schema = "kamlog";',
        'check_slow_queries' => 'SELECT * FROM mysql.slow_log ORDER BY query_time DESC LIMIT 20;',
    ],
];
