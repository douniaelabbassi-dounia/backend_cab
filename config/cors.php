<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // Local dev in browser
        'http://localhost',
        'http://localhost:8100',
        'http://127.0.0.1',
        'http://127.0.0.1:8100',
        'https://localhost',
        'https://localhost:8100',
        'https://127.0.0.1',
        'https://127.0.0.1:8100',
        // Capacitor/Ionic native schemes
        'capacitor://localhost',
        'ionic://localhost',
    ],

    'allowed_origins_patterns' => [
        // Allow LAN IPs (e.g., http://192.168.x.x:8100, http://10.x.x.x)
        '#^http://(192\.168|10\.|172\.(1[6-9]|2[0-9]|3[0-1]))\.[0-9]+\.[0-9]+(:[0-9]+)?$#',
        '#^https://(192\.168|10\.|172\.(1[6-9]|2[0-9]|3[0-1]))\.[0-9]+\.[0-9]+(:[0-9]+)?$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Using token auth; typically no cookies involved. Keep true for flexibility.
    'supports_credentials' => true,

];
