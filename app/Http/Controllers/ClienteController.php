<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\Restaurante;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function consultarPedido(Request $request, Restaurante $restaurante)
    {
        $codigo = $request->query('codigo');
        $pedido = null;

        if ($codigo) {
            $pedido = Pedido::where('restaurante_id', $restaurante->id)
                ->where('codigo_pedido', $codigo)
                ->with('detalles.producto')
                ->first();
        }

        return inertia('cliente/estado-pedido', [
            'restaurante' => $restaurante,
            'pedido' => $pedido,
            'codigoBuscado' => $codigo,
        ]);
    }
}
