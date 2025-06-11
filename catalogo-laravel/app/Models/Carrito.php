<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carrito extends Model
{
    protected $table = 'carritos';
    protected $fillable = [
        'user_id',
        'estado', // 'pendiente', 'pagado', 'cancelado'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function carritoProductos()
    {
        return $this->hasMany(CarritoProducto::class);
    }
}
