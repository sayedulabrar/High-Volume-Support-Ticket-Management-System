<?php
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TicketReplyController;
use Illuminate\Support\Facades\Route;

Route::prefix('customer')
    ->middleware(['auth:sanctum', 'role:Customer'])->group(function () {

        Route::post('/tickets', [TicketController::class, 'store']);
        Route::get('/tickets', [TicketController::class, 'index']); // filters by assigned_to
        Route::get('/tickets/{id}', [TicketController::class, 'show']);
        
        Route::get('/tickets/{id}/replies', [TicketReplyController::class, 'index']);
        Route::post('/tickets/{id}/replies', [TicketReplyController::class, 'store']);
});

