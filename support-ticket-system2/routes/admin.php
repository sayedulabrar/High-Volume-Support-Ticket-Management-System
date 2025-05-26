<?php
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\TicketController;

Route::prefix('admin')
    ->middleware(['auth:sanctum', 'role:Admin'])->group(function () {
        Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('/users/{user}/edit', [UserManagementController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [UserManagementController::class, 'update'])->name('users.update');
        
        //Admin can assign tickets to agents
        Route::put('/tickets/{id}/assign', [TicketController::class, 'assign']);

        Route::get('/tickets', [TicketController::class, 'index']);

});

