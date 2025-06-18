<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Producto::with('categorias')->get(); // muestra todos los productos con sus categorías
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'titulo' => 'required|string|max:255',
        'descripcion' => 'required|string',
        'precio' => 'required|numeric|min:0',
        'imagen' => 'nullable|string',
        'stock' => 'required|numeric|min:0',
        'categorias' => 'nullable|array',
        'categorias.*' => 'exists:categorias,id', // Valida que cada ID exista
    ]);

    // Excluir categorias del create ya que no es un campo del modelo
    $productData = collect($validated)->except('categorias')->toArray();
    
    $producto = Producto::create($productData);

    if (!empty($validated['categorias'] ?? [])) {
        $producto->categorias()->sync($validated['categorias']);
    }

    return response()->json($producto->load('categorias'), 201);
}

    /**
     * Display the specified resource.
     */
    public function show(Producto $producto)
    {
        $producto->load('categorias');
        return response()->json($producto); // muestra un producto específico con sus categorías
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Producto $producto)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Producto $producto)
    {
        $validated = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'descripcion' => 'sometimes|required|string',
            'precio' => 'sometimes|required|numeric|min:0',
            'imagen' => 'nullable|string',
            'stock' => 'sometimes|required|numeric|min:0',
            'categorias' => 'nullable|array',
            'categorias.*' => 'exists:categorias,id',
        ]);

        $producto->update($validated);

        if ($request->has('categorias')) {
            $producto->categorias()->sync($request->categorias);
        }
        $producto = Producto::with('categorias')->find($producto->id);

        return response()->json([
            'message' => 'Producto actualizado exitosamente.',
            'producto' => $producto,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();
        return response()->json(['message'=>'Producto Eliminado correctamente'], 204); // elimina el producto y devuelve un código de estado 204 No Content
    }
}