<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Restaurante;

class MenuController extends Controller
{
    public function restaurantes()
    {
        $restaurantes = Restaurante::where('estado', 'activo')->get();

        return inertia('menu/restaurantes', [
            'restaurantes' => $restaurantes,
        ]);
    }

    public function show(Restaurante $restaurante)
    {
        $productos = Producto::where('restaurante_id', $restaurante->id)->with('stock')->get();

        return inertia('menu/show', [
            'restaurante' => $restaurante,
            'productos' => $productos,
        ]);
    }
}
