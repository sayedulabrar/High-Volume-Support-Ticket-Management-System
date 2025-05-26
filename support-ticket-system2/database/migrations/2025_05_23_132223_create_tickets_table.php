<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();

            // Foreign key to user who created the ticket
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Foreign key to support agent (nullable at first)
            $table->foreignId('assigned_to')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');

            $table->string('subject');
            $table->string('category');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->text('description');
            $table->enum('status', ['open', 'in progress', 'resolved', 'closed'])->default('open');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
