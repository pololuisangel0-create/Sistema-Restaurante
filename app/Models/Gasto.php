<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gasto extends Model
{
    protected $fillable = ['descripcion', 'monto', 'fecha', 'restaurante_id'];

    public function restaurante()
    {
        return $this->belongsTo(Restaurante::class);
    }
}
