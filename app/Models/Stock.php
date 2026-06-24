<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $table = 'stock';

    protected $fillable = ['producto_id', 'cantidad_disponible', 'cantidad_min'];

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}
