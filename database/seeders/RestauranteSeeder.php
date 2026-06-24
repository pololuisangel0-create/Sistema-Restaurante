<?php

namespace Database\Seeders;

use App\Models\Producto;
use App\Models\Restaurante;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RestauranteSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Soporte General',
            'email' => 'soporte@correo.com',
            'password' => Hash::make('Polo12'),
            'rol' => 'soporte',
            'restaurante_id' => null,
        ]);

        $restaurante = Restaurante::create([
            'nombre' => 'La Pascana del Sabor',
            'direccion' => 'Av. Principal',
            'telefono' => '123456789',
            'estado' => 'activo',
        ]);

        User::create([
            'name' => 'Administrador',
            'email' => 'admin@admin.com',
            'password' => Hash::make('Admin'),
            'rol' => 'administrador',
            'restaurante_id' => $restaurante->id,
        ]);

        User::create([
            'name' => 'Cajero',
            'email' => 'cajero@cajero.com',
            'password' => Hash::make('Contra'),
            'rol' => 'cajero',
            'restaurante_id' => $restaurante->id,
        ]);

        $producto1 = Producto::create([
            'nombre' => 'Hamburguesa Clásica',
            'descripcion' => 'Carne, lechuga, tomate y queso',
            'precio' => 25,
            'categoria' => 'Platos Fuertes',
            'restaurante_id' => $restaurante->id,
        ]);

        $producto2 = Producto::create([
            'nombre' => 'Limonada',
            'descripcion' => 'Limonada natural',
            'precio' => 8,
            'categoria' => 'Bebidas',
            'restaurante_id' => $restaurante->id,
        ]);

        Stock::create([
            'producto_id' => $producto1->id,
            'cantidad_disponible' => 20,
            'cantidad_min' => 5,
        ]);

        Stock::create([
            'producto_id' => $producto2->id,
            'cantidad_disponible' => 30,
            'cantidad_min' => 10,
        ]);
    }
}
