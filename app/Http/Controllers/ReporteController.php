<?php

namespace App\Http\Controllers;

use App\Models\Gasto;
use App\Models\Pedido;
use Illuminate\Http\Request;

class ReporteController extends Controller
{
    public function index(Request $request)
    {
        $restaurante_id = auth()->user()->restaurante_id;

        $from = $request->get('from', now()->toDateString());
        $to = $request->get('to', now()->toDateString());

        // Ingresos del periodo filtrado
        $ingresos = Pedido::where('restaurante_id', $restaurante_id)
            ->where('estado', 'entregado')
            ->whereDate('created_at', '>=', $from)
            ->whereDate('created_at', '<=', $to)
            ->sum('total');

        // Gastos del periodo filtrado
        $gastos = Gasto::where('restaurante_id', $restaurante_id)
            ->whereDate('fecha', '>=', $from)
            ->whereDate('fecha', '<=', $to)
            ->sum('monto');

        // Pedidos entregados del periodo
        $pedidos = Pedido::where('restaurante_id', $restaurante_id)
            ->where('estado', 'entregado')
            ->whereDate('created_at', '>=', $from)
            ->whereDate('created_at', '<=', $to)
            ->with('detalles.producto')
            ->orderByDesc('created_at')
            ->get();

        // Costo total de ventas: suma de (cantidad * producto.costo) de cada detalle
        $costoVentas = 0;
        foreach ($pedidos as $pedido) {
            foreach ($pedido->detalles as $detalle) {
                $costoVentas += $detalle->cantidad * ($detalle->producto->costo ?? 0);
            }
        }

        return inertia('reportes/index', [
            'periodo' => [
                'from' => $from,
                'to' => $to,
                'ingresos' => $ingresos,
                'gastos' => $gastos,
                'costo_ventas' => $costoVentas,
                'ganancia_bruta' => $ingresos - $gastos,
                'ganancia_neta' => $ingresos - $gastos - $costoVentas,
            ],
            'pedidos' => $pedidos,
        ]);
    }
}
