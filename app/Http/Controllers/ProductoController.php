<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Stock;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function index()
    {
        $productos = Producto::where('restaurante_id', auth()->user()->restaurante_id)
            ->with('stock')
            ->get();

        return inertia('productos/index', ['productos' => $productos]);
    }

    public function store(Request $request)
    {
        $validado = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'costo' => 'required|numeric|min:0',
            'categoria' => 'nullable|string|max:255',
            'cantidad_disponible' => 'required|integer|min:0',
            'cantidad_min' => 'required|integer|min:0',
        ]);

        $producto = Producto::create([
            'nombre' => $validado['nombre'],
            'descripcion' => $validado['descripcion'] ?? null,
            'precio' => $validado['precio'],
            'costo' => $validado['costo'],
            'categoria' => $validado['categoria'] ?? null,
            'restaurante_id' => auth()->user()->restaurante_id,
        ]);

        Stock::create([
            'producto_id' => $producto->id,
            'cantidad_disponible' => $validado['cantidad_disponible'],
            'cantidad_min' => $validado['cantidad_min'],
        ]);

        return redirect(('/productos'));

    }

    public function show(Producto $producto)
    {
        return response()->json($producto->load('stock'));
    }

    public function update(Request $request, Producto $producto)
    {
        $validado = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'costo' => 'required|numeric|min:0',
            'categoria' => 'nullable|string|max:255',
        ]);

        $producto->update($validado);

        return redirect('/productos');
    }

    public function destroy(Producto $producto)
    {
        $producto->delete();

        return redirect('/productos');
    }
}
