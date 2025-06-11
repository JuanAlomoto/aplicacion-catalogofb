<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarritoProducto extends Model
{
    protected $table = 'carrito_productos';
    
    protected $fillable = [
        'carrito_id',
        'producto_id',
        'precio_unitario', // Precio del producto al momento de agregar al carrito
    ];

    public function carrito()
    {
        return $this->belongsTo(Carrito::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}
