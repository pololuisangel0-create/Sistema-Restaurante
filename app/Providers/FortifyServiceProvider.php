<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::authenticateUsing(function (Request $request) {
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return null;
            }

            // Soporte siempre puede entrar
            if ($user->rol === 'soporte') {
                return $user;
            }

            // Usuarios sin restaurante asociado
            if (!$user->restaurante_id) {
                return $user;
            }

            // Verificar estado del restaurante
            $restaurante = $user->restaurante;
            if (!$restaurante) {
                throw new \Illuminate\Validation\ValidationException(
                    validator: validator([], []),
                    response: back()->withErrors([
                        'email' => 'El restaurante asignado no existe. Contacte al soporte.',
                    ]),
                );
            }
            if ($restaurante->estado !== 'activo') {
                $estado = $restaurante->estado;
                throw new \Illuminate\Validation\ValidationException(
                    validator: validator([], []),
                    response: back()->withErrors([
                        'email' => "El restaurante al que pertenece está {$estado}. No puede iniciar sesión.",
                    ]),
                );
            }

            return $user;
        });
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}
