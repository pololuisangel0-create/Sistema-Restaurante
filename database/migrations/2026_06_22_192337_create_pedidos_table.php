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
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_pedido');
            $table->string('nombre_cliente');
            $table->enum('estado', ['pendiente', 'aceptado', 'preparando', 'listo', 'cancelado'])->default('pendiente');
            $table->decimal('total', 8, 2)->default(0);
            $table->foreignId('cajero_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('restaurante_id')->nullable()->constrained('restaurantes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
