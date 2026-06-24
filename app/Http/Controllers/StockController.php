<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function update(Request $request, Stock $stock)
    {
        $valido = $request->validate([
            'cantidad_disponible' => 'required|integer|min:0',
            'cantidad_min' => 'required|integer|min:0',
        ]);

        $stock->update($valido);

        return redirect('/productos');
    }
}
