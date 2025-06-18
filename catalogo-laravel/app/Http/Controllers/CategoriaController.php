<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categoria; // 

class CategoriaController extends Controller
{
    public function index()
    {
        // Aquí puedes implementar la lógica para obtener todas las categorías
        return response()->json(Categoria::all());
    }

}
