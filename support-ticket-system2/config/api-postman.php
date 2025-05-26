<?php

return [

    'base_url' => env('APP_URL', 'http://localhost'),

    'filename' => '{timestamp}_{app}_collection.json',

    'structured' => true,
    'crud_folders' => true,

    // Because you're using Laravel Sanctum
    'auth_middleware' => 'auth:sanctum',

    'headers' => [
        [
            'key' => 'Accept',
            'value' => 'application/json',
        ],
        [
            'key' => 'Content-Type',
            'value' => 'application/json',
        ],
    ],

    // No pre/post scripts needed unless you have specific logic
    'prerequest_script' => '',
    'test_script' => '',

    'include_doc_comments' => true,

    // Enable form data if you want sample data
    'enable_formdata' => true,
    'print_rules' => true,
    'rules_to_human_readable' => true,

    // Add dummy form values for ease of testing
    'formdata' => [
        'email' => 'admin@example.com',
        'password' => 'password',
    ],

    'include_middleware' => ['api'],

    'disk' => 'local',

    // Provide a dummy token or leave empty — Postman can inject token manually
    'authentication' => [
        'method' => 'bearer',
        'token' => env('POSTMAN_EXPORT_AUTH_TOKEN', ''), // leave blank or set a real token
    ],

    'protocol_profile_behavior' => [
        'disable_body_pruning' => false,
    ],

];
