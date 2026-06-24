<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $fillable = ['codigo_pedido', 'nombre_cliente', 'estado', 'total', 'cajero_id', 'restaurante_id'];

    public function restaurante()
    {
        return $this->belongsTo(Restaurante::class);
    }

    public function cajero()
    {
        return $this->belongsTo(User::class, 'cajero_id');
    }

    public function detalles()
    {
        return $this->hasMany(DetallePedido::class);
    }
}
