<?php

namespace App\Http\Controllers;

use App\Models\DetallePedido;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    /**
     * Listar todos los pedidos de un restaurante
     */
    public function index(Request $request)
    {
        $restaurante_id = $request->get('restaurante_id');

        $pedidos = Pedido::where('restaurante_id', $restaurante_id)
            ->with('detalles.producto')
            ->orderByDesc('created_at')
            ->paginate(15);

        return response()->json([
            'pedidos' => $pedidos,
            'mensaje' => 'Pedidos obtenidos',
        ]);
    }

    /**
     * Ver detalle de un pedido específico
     */
    public function show($codigo_pedido)
    {
        $pedido = Pedido::where('codigo_pedido', $codigo_pedido)
            ->with('detalles.producto')
            ->firstOrFail();

        return response()->json([
            'pedido' => $pedido,
            'detalles' => $pedido->detalles,
            'mensaje' => 'Pedido encontrado',
        ]);
    }

    /**
     * Crear nuevo pedido
     */
    public function store(Request $request)
    {
        $validado = $request->validate([
            'nombre_cliente' => 'required|string|max:255',
            'restaurante_id' => 'required|integer|exists:restaurantes,id',
            'items' => 'required|array|min:1',
            'items.*.producto_id' => 'required|integer|exists:productos,id',
            'items.*.cantidad' => 'required|integer|min:1',
            'items.*.precio_unitario' => 'required|numeric|min:0',
        ]);

        try {
            $pedido = DB::transaction(function () use ($validado) {
                // Generar código
                $codigoPedido = $this->generarCodigoPedido($validado['restaurante_id']);

                // Validar stock antes de crear
                foreach ($validado['items'] as $item) {
                    $stock = Stock::where('producto_id', $item['producto_id'])->first();

                    if (! $stock || $stock->cantidad_disponible < $item['cantidad']) {
                        $producto = Producto::find($item['producto_id']);
                        throw new \Exception("Stock insuficiente para {$producto->nombre}");
                    }
                }

                // Crear pedido
                $pedido = Pedido::create([
                    'codigo_pedido' => $codigoPedido,
                    'nombre_cliente' => $validado['nombre_cliente'],
                    'restaurante_id' => $validado['restaurante_id'],
                    'estado' => 'pendiente',
                    'total' => 0,
                ]);

                // Crear detalles y actualizar stock
                $total = 0;
                foreach ($validado['items'] as $item) {
                    DetallePedido::create([
                        'pedido_id' => $pedido->id,
                        'producto_id' => $item['producto_id'],
                        'cantidad' => $item['cantidad'],
                        'precio_unitario' => $item['precio_unitario'],
                    ]);

                    // Restar del stock
                    Stock::where('producto_id', $item['producto_id'])
                        ->decrement('cantidad_disponible', $item['cantidad']);

                    $total += $item['cantidad'] * $item['precio_unitario'];
                }

                $pedido->update(['total' => $total]);

                return $pedido;
            });

            return response()->json([
                'codigo_pedido' => $pedido->codigo_pedido,
                'total' => $pedido->total,
                'estado' => $pedido->estado,
                'mensaje' => 'Pedido creado exitosamente',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Actualizar estado del pedido
     */
    public function update(Request $request, $codigo_pedido)
    {
        $validado = $request->validate([
            'estado' => 'required|in:pendiente,aceptado,preparando,listo,cancelado',
        ]);

        $pedido = Pedido::where('codigo_pedido', $codigo_pedido)->firstOrFail();

        // Si se cancela, devolver stock
        if ($validado['estado'] === 'cancelado' && $pedido->estado !== 'cancelado') {
            DB::transaction(function () use ($pedido) {
                foreach ($pedido->detalles as $detalle) {
                    Stock::where('producto_id', $detalle->producto_id)
                        ->where('restaurante_id', $pedido->restaurante_id)
                        ->increment('cantidad', $detalle->cantidad);
                }
            });
        }

        $pedido->update(['estado' => $validado['estado']]);

        return response()->json([
            'pedido' => $pedido,
            'mensaje' => 'Estado del pedido actualizado',
        ]);
    }

    /**
     * Eliminar pedido (solo si está pendiente)
     */
    public function destroy($codigo_pedido)
    {
        $pedido = Pedido::where('codigo_pedido', $codigo_pedido)->firstOrFail();

        if ($pedido->estado !== 'pendiente') {
            return response()->json([
                'error' => 'Solo puedes eliminar pedidos pendientes',
            ], 400);
        }

        DB::transaction(function () use ($pedido) {
            // Devolver stock
            foreach ($pedido->detalles as $detalle) {
                Stock::where('producto_id', $detalle->producto_id)
                    ->where('restaurante_id', $pedido->restaurante_id)
                    ->increment('cantidad', $detalle->cantidad);
            }

            // Eliminar detalles
            $pedido->detalles()->delete();

            // Eliminar pedido
            $pedido->delete();
        });

        return response()->json([
            'mensaje' => 'Pedido eliminado',
        ]);
    }

    /**
     * Generar código único del pedido
     */
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
}
