<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurante extends Model
{
    protected $fillable = ['nombre', 'direccion', 'telefono', 'estado'];

    public function usuarios()
    {
        return $this->hasMany(User::class);
    }

    public function productos()
    {
        return $this->hasMany(Producto::class);
    }

    public function pedidos()
    {
        return $this->hasMany(Pedido::class);
    }

    public function gastos()
    {
        return $this->hasMany(Gasto::class);
    }
}
