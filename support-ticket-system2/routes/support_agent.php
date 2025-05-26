<?php
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TicketReplyController;
use Illuminate\Support\Facades\Route;

Route::prefix('support-agent')
    ->middleware(['auth:sanctum', 'role:Support Agent'])->group(function () {

        Route::get('/tickets', [TicketController::class, 'index']); 
        Route::get('/tickets/{id}', [TicketController::class, 'show']);
        Route::post('/tickets/{id}/updateStatus', [TicketController::class, 'updateStatus']);
        
        Route::get('/tickets/{id}/replies', [TicketReplyController::class, 'index']);
        Route::post('/tickets/{id}/replies', [TicketReplyController::class, 'store']);
        
});

