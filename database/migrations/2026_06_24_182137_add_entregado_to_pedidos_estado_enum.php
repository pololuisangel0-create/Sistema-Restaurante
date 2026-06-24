<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE pedidos MODIFY COLUMN estado ENUM('pendiente', 'aceptado', 'preparando', 'listo', 'cancelado', 'entregado') NOT NULL DEFAULT 'pendiente'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE pedidos MODIFY COLUMN estado ENUM('pendiente', 'aceptado', 'preparando', 'listo', 'cancelado') NOT NULL DEFAULT 'pendiente'");
    }
};
