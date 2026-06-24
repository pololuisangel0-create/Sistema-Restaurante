<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CajeroController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GastoController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\SoporteController;
use App\Http\Controllers\StockController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');
Route::get('/menu', [MenuController::class, 'restaurantes']);
Route::get('/menu/{restaurante}', [MenuController::class, 'show']);
Route::post('/pedidos', [PedidoController::class, 'store']);
Route::get('/estado-pedido/{restaurante}', [ClienteController::class, 'consultarPedido']);

Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/');
})->name('logout');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/productos', [ProductoController::class, 'index']);
    Route::post('/productos', [ProductoController::class, 'store']);
    Route::delete('/productos/{producto}', [ProductoController::class, 'destroy']);
    Route::put('/productos/{producto}', [ProductoController::class, 'update']);
    Route::put('/stock/{stock}', [StockController::class, 'update']);
    Route::get('/cajero/pedidos', [CajeroController::class, 'nuevoPedido']);
    Route::post('/cajero/pedidos', [CajeroController::class, 'guardarPedido']);
    Route::get('/cajero/pedidos/lista', [CajeroController::class, 'pedidos']);
    Route::put('/pedidos/{pedido}', [CajeroController::class, 'actualizarEstado']);
    Route::get('/gastos', [GastoController::class, 'index']);
    Route::post('/gastos', [GastoController::class, 'store']);
    Route::delete('/gastos/{gasto}', [GastoController::class, 'destroy']);
    Route::get('/reportes', [ReporteController::class, 'index']);
    Route::get('/soporte/restaurantes', [SoporteController::class, 'restaurantes']);
    Route::post('/soporte/restaurantes', [SoporteController::class, 'crearRestaurante']);
    Route::post('/soporte/restaurantes/{restaurante}/admin', [SoporteController::class, 'crearAdmin']);
    Route::get('/soporte/restaurantes/{restaurante}/gestionar', [SoporteController::class, 'gestionar']);
    Route::put('/soporte/restaurantes/{restaurante}/estado', [SoporteController::class, 'actualizarEstado']);
    Route::delete('/soporte/restaurantes/{restaurante}', [SoporteController::class, 'eliminarRestaurante']);
    Route::delete('/soporte/restaurantes/{restaurante}/admin/{user}', [SoporteController::class, 'eliminarAdmin']);
    Route::get('/admin/cajeros', [AdminController::class, 'cajeros']);
    Route::post('/admin/cajeros', [AdminController::class, 'crearCajero']);
    Route::delete('/admin/cajeros/{user}', [AdminController::class, 'eliminarCajero']);
    Route::get('/admin/cajeros/{user}/jornadas', [AdminController::class, 'jornadas']);
});

require __DIR__.'/settings.php';
