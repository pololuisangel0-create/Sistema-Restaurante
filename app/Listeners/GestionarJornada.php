<?php

namespace App\Listeners;

use App\Models\Jornada;
use Illuminate\Auth\Events\Login;

class GestionarJornada
{
    public function handle(Login $event): void
    {
        $user = $event->user;

        if ($user->rol === 'cajero') {
            Jornada::create([
                'user_id' => $user->id,
                'inicio' => now(),
            ]);
        }
    }
}
