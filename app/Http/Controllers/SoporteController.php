<?php

namespace App\Http\Controllers;

use App\Models\Restaurante;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class SoporteController extends Controller
{
    public function restaurantes()
    {
        $restaurantes = Restaurante::with(['usuarios' => function ($query) {
            $query->where('rol', 'administrador');
        }])->get();

        return inertia('soporte/restaurantes', [
            'restaurantes' => $restaurantes,
        ]);
    }

    public function crearRestaurante(Request $request)
    {
        $validado = $request->validate([
            'nombre' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
        ]);

        $restaurante = Restaurante::create([
            'nombre' => $validado['nombre'],
            'direccion' => $validado['direccion'],
            'telefono' => $validado['telefono'],
            'estado' => 'activo',
        ]);

        return redirect('/soporte/restaurantes')->with('success', "Restaurante '{$restaurante->nombre}' creado");
    }

    public function crearAdmin(Request $request, Restaurante $restaurante)
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
            'rol' => 'administrador',
            'restaurante_id' => $restaurante->id,
        ]);

        return redirect('/soporte/restaurantes')->with('success', "Admin creado para {$restaurante->nombre}");
    }

    public function gestionar(Restaurante $restaurante)
    {
        $restaurante->load(['usuarios' => function ($query) {
            $query->where('rol', 'administrador');
        }]);

        return inertia('soporte/gestionar-restaurante', [
            'restaurante' => $restaurante,
        ]);
    }

    public function actualizarEstado(Request $request, Restaurante $restaurante)
    {
        $validado = $request->validate([
            'estado' => ['required', Rule::in(['activo', 'inactivo', 'suspendido'])],
        ]);

        $restaurante->update($validado);

        return redirect("/soporte/restaurantes/{$restaurante->id}/gestionar")
            ->with('success', "Estado actualizado a '{$restaurante->estado}'");
    }

    public function eliminarRestaurante(Restaurante $restaurante)
    {
        $restaurante->delete();

        return redirect('/soporte/restaurantes')->with('success', "Restaurante '{$restaurante->nombre}' eliminado");
    }

    public function eliminarAdmin(Restaurante $restaurante, User $user)
    {
        if ($user->restaurante_id !== $restaurante->id || $user->rol !== 'administrador') {
            abort(404);
        }

        $user->delete();

        return redirect("/soporte/restaurantes/{$restaurante->id}/gestionar")
            ->with('success', "Admin '{$user->name}' eliminado");
    }
}
