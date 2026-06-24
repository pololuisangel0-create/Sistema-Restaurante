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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('rol', ['soporte', 'administrador', 'cajero'])->default('cajero');
            $table->foreignId('restaurante_id')->nullable()->constrained('restaurantes')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['restaurante_id']);
            $table->dropColumn(['rol', 'restaurante_id']);
        });
    }
};
