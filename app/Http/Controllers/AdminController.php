<?php

namespace App\Http\Controllers;

use App\Models\Jornada;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function cajeros()
    {
        $restaurante_id = auth()->user()->restaurante_id;

        $cajeros = User::where('restaurante_id', $restaurante_id)
            ->where('rol', 'cajero')
            ->with('jornadas')
            ->get();

        return inertia('admin/cajeros', [
            'cajeros' => $cajeros,
        ]);
    }

    public function jornadas(User $user)
    {
        $jornadas = $user->jornadas()
            ->orderByDesc('inicio')
            ->paginate(20);

        return inertia('admin/jornadas', [
            'cajero' => $user,
            'jornadas' => $jornadas,
        ]);
    }

    public function crearCajero(Request $request)
    {
        $validado = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        User::create([
            'name' => $validado['nombre'],
            'email' => $validado['email'],
            'password' => Hash::make($validado['password']),
            'rol' => 'cajero',
            'restaurante_id' => auth()->user()->restaurante_id,
        ]);

        return redirect('/admin/cajeros');
    }

    public function eliminarCajero(User $user)
    {
        $user->delete();

        return redirect('/admin/cajeros');
    }
}
