<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRestaurantStatus
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if ($user && $user->restaurante_id && $user->rol !== 'soporte') {
            $restaurante = $user->restaurante;

            if (!$restaurante) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect('/login')->withErrors([
                    'email' => 'El restaurante asignado no existe. Contacte al soporte.',
                ]);
            }
            if ($restaurante->estado !== 'activo') {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect('/login')->withErrors([
                    'email' => 'El restaurante ha sido ' . $restaurante->estado . '. Contacte al soporte.',
                ]);
            }
        }

        return $next($request);
    }
}
