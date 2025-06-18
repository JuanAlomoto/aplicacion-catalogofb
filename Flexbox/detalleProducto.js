document.addEventListener("DOMContentLoaded", () => {
    const detalleProductoContainer = document.getElementById("detalle-producto");

    // obtener el id del producto de la URL 
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id"); // id es el nombre del parámetro en la URL

    if (productId) {
        cargarDetalleProducto(productId); // si hay un id cargar el detalle del producto
    } else {
        // si no hay id en la url mostrar un mensaje de error
        detalleProductoContainer.innerHTML = "<p class='text-red-500 text-center'>ID de producto no encontrado en la URL.</p>";
    }

    // función asincrona para cargar los detalles de un producto desde la api
    async function cargarDetalleProducto(id) {
        try {
            // realizar la petición a la api para el producto especifico
            const response = await fetch(`http://127.0.0.1:8000/api/productos/${id}`);
            if (!response.ok) { 
                throw new Error("Error al cargar el detalle del producto Codigo: " + response.status);
            }
            const producto = await response.json(); 

            // Mostrar la información del producto en el contenedor
            detalleProductoContainer.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.titulo}" class="w-64 h-64 object-contain mr-8">
                <div class="flex-1">
                    <h2 class="text-3xl font-bold mb-4">${producto.titulo}</h2>
                    <p class="text-xl text-blue-600 font-semibold mb-4">$${producto.precio}</p>
                    <p class="text-gray-700 mb-4">${producto.descripcion}</p>
                    <p class="text-gray-500 text-sm">Categoría: <span class="font-medium">${producto.categorias.map(categoria => categoria.nombre).join(", ")}</span></p>
                    <button id="actualizar-producto-btn" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4 hidden">Actualizar producto</button>
                    <button id="eliminar-producto-btn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4 ml-2 hidden">Eliminar producto</button>
                </div>
            `;

            // Verificar si el usuario es admin antes de mostrar los botones
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const userRes = await fetch("http://127.0.0.1:8000/api/me", {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "Content-Type": "application/json"
                        }
                    });
                    if (userRes.ok) {
                        const user = await userRes.json();
                        if (user.rol === "admin") {
                            // Mostrar botones solo si es admin
                            document.getElementById("actualizar-producto-btn").classList.remove("hidden");
                            document.getElementById("eliminar-producto-btn").classList.remove("hidden");

                            // Evento actualizar
                            const actualizarBtn = document.getElementById("actualizar-producto-btn");
                            if (actualizarBtn) {
                                actualizarBtn.addEventListener("click", () => {
                                    window.location.href = `actualizar.html?id=${id}`;
                            });
                            }

                            // Evento eliminar
                            const eliminarBtn = document.getElementById("eliminar-producto-btn");
                            if (eliminarBtn) {
                                eliminarBtn.addEventListener("click", async () => {
                                    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
                                    try {
                                        const response = await fetch(`http://127.0.0.1:8000/api/productos/${id}`, {
                                            method: "DELETE",
                                            headers: {
                                                "Authorization": "Bearer " + token
                                            }
                                        });
                                        if (!response.ok) {
                                            const errorText = await response.text();
                                            alert("Error al eliminar el producto: " + errorText);
                                            return;
                                        }
                                        alert("Producto eliminado correctamente.");
                                        window.location.href = "index.html";
                                    } catch (error) {
                                        alert("Error al eliminar el producto.");
                                        console.error(error);
                                    }
                                });
                            }
                        }
                    }
                } catch (error) {
                    // Si hay error, los botones permanecen ocultos
                }
            }
        } catch (error) {
            console.error("Error cargando el detalle del producto:", error);
            detalleProductoContainer.innerHTML = `<p class='text-red-500 text-center'>No se pudo cargar el detalle del producto: ${error.message}</p>`;
        }
    }
});