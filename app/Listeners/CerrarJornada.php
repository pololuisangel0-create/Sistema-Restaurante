<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Logout;

class CerrarJornada
{
    public function handle(Logout $event): void
    {
        $user = $event->user;

        if ($user && $user->rol === 'cajero') {
            $jornada = $user->jornadas()->whereNull('fin')->latest()->first();
            if ($jornada) {
                $jornada->update(['fin' => now()]);
            }
        }
    }
}
