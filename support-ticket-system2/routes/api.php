<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Authentication\AuthController;
use App\Http\Controllers\ProfileController;

require __DIR__ . '/admin.php';
require __DIR__ . '/customer.php';
require __DIR__ . '/support_agent.php';

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', [ProfileController::class, 'me']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::get('/roles', [ProfileController::class, 'allRoles']);
});

// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });
