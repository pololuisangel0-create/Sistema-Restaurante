<?php

namespace App\Http\Controllers;

class DashboardController extends Controller
{
    public function index()
    {
        $rol = auth()->user()->rol;

        if ($rol === 'soporte') {
            return redirect('/soporte/restaurantes');
        } elseif ($rol === 'administrador') {
            return redirect('/productos');
        } elseif ($rol === 'cajero') {
            return redirect('/cajero/pedidos');
        }

        return redirect('/');
    }
}
