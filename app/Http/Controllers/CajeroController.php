<?php

namespace App\Http\Controllers;

use App\Models\DetallePedido;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CajeroController extends Controller
{
    public function pedidos()
    {
        $restaurante_id = auth()->user()->restaurante_id;

        $pedidos = Pedido::where('restaurante_id', $restaurante_id)
            ->with('detalles.producto')
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('cajero/pedidos', [
            'pedidos' => $pedidos,
        ]);
    }

    public function nuevoPedido()
    {
        $restaurante_id = auth()->user()->restaurante_id;

        $productos = Producto::where('restaurante_id', $restaurante_id)
            ->with('stock')
            ->get();

        return inertia('cajero/nuevo-pedido', [
            'productos' => $productos,
            'restaurante_id' => $restaurante_id,
        ]);
    }

    public function guardarPedido(Request $request)
    {
        $validado = $request->validate([
            'nombre_cliente' => 'required|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.producto_id' => 'required|integer|exists:productos,id',
            'items.*.cantidad' => 'required|integer|min:1',
            'items.*.precio_unitario' => 'required|numeric|min:0',
        ]);

        $restaurante_id = auth()->user()->restaurante_id;

        try {
            $resultado = DB::transaction(function () use ($validado, $restaurante_id) {
                $codigoPedido = $this->generarCodigoPedido($restaurante_id);
                $stockBajo = [];

                foreach ($validado['items'] as $item) {
                    $stock = Stock::where('producto_id', $item['producto_id'])->first();
                    if (!$stock || $stock->cantidad_disponible < $item['cantidad']) {
                        $producto = Producto::find($item['producto_id']);
                        throw new \Exception("Stock insuficiente para {$producto->nombre}");
                    }
                }

                $pedido = Pedido::create([
                    'codigo_pedido' => $codigoPedido,
                    'nombre_cliente' => $validado['nombre_cliente'],
                    'restaurante_id' => $restaurante_id,
                    'estado' => 'listo',
                    'total' => 0,
                ]);

                $total = 0;
                foreach ($validado['items'] as $item) {
                    DetallePedido::create([
                        'pedido_id' => $pedido->id,
                        'producto_id' => $item['producto_id'],
                        'cantidad' => $item['cantidad'],
                        'precio_unitario' => $item['precio_unitario'],
                    ]);

                    Stock::where('producto_id', $item['producto_id'])
                        ->decrement('cantidad_disponible', $item['cantidad']);

                    $stock = Stock::where('producto_id', $item['producto_id'])->first();
                    if ($stock && $stock->cantidad_disponible <= $stock->cantidad_min) {
                        $producto = Producto::find($item['producto_id']);
                        $stockBajo[] = "{$producto->nombre} (quedan {$stock->cantidad_disponible})";
                    }

                    $total += $item['cantidad'] * $item['precio_unitario'];
                }

                $pedido->update(['total' => $total]);
                return [$pedido, $stockBajo];
            });

            $stockBajo = $resultado[1];

            if (!empty($stockBajo)) {
                $mensaje = 'Pedido registrado. Stock bajo en: ' . implode(', ', $stockBajo);
                return redirect('/cajero/pedidos/lista')->with('warning', $mensaje);
            }

            return redirect('/cajero/pedidos/lista');
        } catch (\Exception $e) {
            return redirect('/cajero/pedidos')->withErrors(['error' => $e->getMessage()]);
        }
    }

    private function generarCodigoPedido($restaurante_id)
    {
        $hoy = now()->toDateString();
        $ultimo = Pedido::where('restaurante_id', $restaurante_id)
            ->whereDate('created_at', $hoy)
            ->orderBy('codigo_pedido', 'desc')
            ->first();

        if ($ultimo) {
            return $ultimo->codigo_pedido + 1;
        }

        return 1;
    }

    public function actualizarEstado(Request $request, Pedido $pedido)
    {
        $validado = $request->validate([
            'estado' => 'required|in:aceptado,preparando,listo,entregado',
        ]);

        // Si pasa de "pendiente" a "aceptado", baja el stock
        if ($pedido->estado === 'pendiente' && $validado['estado'] === 'aceptado') {
            foreach ($pedido->detalles as $detalle) {
                $stock = Stock::where('producto_id', $detalle->producto_id)->first();
                if ($stock) {
                    $stock->update([
                        'cantidad_disponible' => max(0, $stock->cantidad_disponible - $detalle->cantidad),
                    ]);
                }
            }
        }

        $pedido->update(['estado' => $validado['estado']]);

        return redirect('/cajero/pedidos/lista');
    }
}
