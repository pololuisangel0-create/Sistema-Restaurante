<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $fillable = ['nombre', 'descripcion', 'precio', 'costo', 'categoria', 'restaurante_id'];

    public function restaurante()
    {
        return $this->belongsTo(Restaurante::class);
    }

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }

    public function detallesPedidos()
    {
        return $this->hasMany(DetallePedido::class);
    }
}
