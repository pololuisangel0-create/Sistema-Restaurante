<?php

namespace App\Http\Controllers;

use App\Models\Gasto;
use Illuminate\Http\Request;

class GastoController extends Controller
{
    public function index()
    {
        $gastos = Gasto::where('restaurante_id', auth()->user()->restaurante_id)
            ->orderBy('fecha', 'desc')
            ->get();

        return inertia('gastos/index', [
            'gastos' => $gastos,
        ]);
    }

    public function store(Request $request)
    {
        $validado = $request->validate([
            'descripcion' => 'required|string|max:255',
            'monto' => 'required|numeric|min:0',
            'fecha' => 'required|date',
        ]);

        Gasto::create([
            'descripcion' => $validado['descripcion'],
            'monto' => $validado['monto'],
            'fecha' => $validado['fecha'],
            'restaurante_id' => auth()->user()->restaurante_id,
        ]);

        return redirect('/gastos');
    }

    public function destroy(Gasto $gasto)
    {
        $gasto->delete();

        return redirect('/gastos');
    }
}
