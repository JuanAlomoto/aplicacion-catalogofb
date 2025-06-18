const contenedorProductos = document.getElementById("productos");
const inputBusqueda = document.getElementById("busqueda");
const contenedorCategorias = document.getElementById("categorias");
const logoutButton = document.getElementById("logoutButton"); // Referencia al botón de cerrar sesión

let productos = [];
let categoriaSeleccionada = "all";

//LOGICA LOGIN
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    if(loginForm){
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const mensaje = document.getElementById("mensaje");
            try {
                const response = await fetch("http://127.0.0.1:8000/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email:username,
                        password,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Error en la respuesta de la API");
                }

                const data = await response.json();
                localStorage.setItem("token", data.access_token);
                mensaje.textContent = "Inicio de sesión exitoso";
                mensaje.classList.add("text-green-500");
                

                setTimeout(() => {
                    window.location.href = "index.html"; // Redirigir a la página principal
                }, 1500);
                
            } catch (error) {
                console.error("Error al iniciar sesión:", error);
                mensaje.textContent = "Error al iniciar sesión. Verifica tus credenciales.";                
                mensaje.classList.add("text-red-500");
            }
        });
    } if (contenedorProductos && contenedorCategorias && inputBusqueda) {
    // Si los elementos existen, se ejecuta la lógica de productos
    cargarProductos();
    cargarCategorias();

    //Agregar evento de búsqueda
    inputBusqueda.addEventListener("input", filtrarProductos);
    }
});

//LOGICA DE PRODUCTOS
async function cargarProductos() {
    try {
        const respuesta = await fetch("http://127.0.0.1:8000/api/productos");

        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API");
        }

        productos = await respuesta.json();

        if (productos.length === 0) {
            console.log("No hay productos disponibles.");
        } else {
            Productos = productos; // Guardar los productos en la variable global
            mostrarProductos(productos); // Mostrar los productos en la interfaz de usuario
        }
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

async function cargarCategorias() {
    try {
        const respuesta = await fetch("https://fakestoreapi.com/products/categories");

        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API");
        }

        const categorias = await respuesta.json();
        mostrarCategorias(["all", ...categorias]); // Agregar "all" como opción predeterminada
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
}

function filtrarProductos() {
    let filtrados = productos;
    

    // Filtrar por categoría
    if (categoriaSeleccionada !== "all") {
        filtrados = filtrados.filter((p) =>
            Array.isArray(p.categorias)
                ? p.categorias.includes(categoriaSeleccionada)
                : p.categorias === categoriaSeleccionada
        );
    }

    // Filtrar por texto de búsqueda
    const texto = inputBusqueda.value.toLowerCase();
    if (texto.trim() !== "") {
        filtrados = filtrados.filter(
            (p) =>
                p.titulo.toLowerCase().includes(texto) ||
                p.descripcion.toLowerCase().includes(texto)
        );
    }

    mostrarProductos(filtrados); // Mostrar los productos filtrados
}

function mostrarProductos(productos) {
    contenedorProductos.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos productos

    productos.forEach((producto) => {
        const productoDiv = document.createElement("div");
        productoDiv.className =
            "bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300";

        productoDiv.innerHTML = `
            <h3 class="text-lg font-semibold mb-2 text-center" style="color: #111111;">${producto.titulo}</h3>
            <img src="${producto.imagen}" alt="${producto.titulo}" class="w-32 h-32 object-contain mb-4">
            <p class="text-gray-700 mb-2 text-center">${producto.descripcion}</p>
            <p class="text-gray-800 mb-2 font-bold">Precio: $${producto.precio}</p>
            <p class="text-gray-600 mb-2">Stock: ${producto.stock}</p>
            <a href="detalle.html?id=${producto.id}" class="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center">Ver detalle</a>
        `;
        contenedorProductos.appendChild(productoDiv);
    });
}

function mostrarProductos(productos) {
    contenedorProductos.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos productos

    productos.forEach((producto) => {
        const productoDiv = document.createElement("div");
        productoDiv.className =
            "bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300";

        productoDiv.innerHTML = `
            <img src="${producto.image}" alt="${producto.titulo}" class="w-32 h-32 object-contain mb-4">
            <h3 class="text-blue-600 lg font-semibold mb-2 text-center">${producto.titulo}</h3>
            <p class="text-black text-center">$${producto.price}</p>
        `;
        contenedorProductos.appendChild(productoDiv);
    });
}

//Mostrar Detalle de los Prdoductos
function mostrarProductos(productos) {
    contenedorProductos.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos productos

    productos.forEach((producto) => {
        const productoDiv = document.createElement("div");
        productoDiv.className =
            "bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300";

        productoDiv.innerHTML = `
            <h3 class="text-lg font-semibold mb-2 text-center" style="color: #111111;">${producto.titulo}</h3>
            <img src="${producto.imagen}" alt="${producto.titulo}" class="w-32 h-32 object-contain mb-4">
            <p class="text-gray-700 mb-2 text-center">${producto.descripcion}</p>
            <p class="text-gray-800 mb-2 font-bold">Precio: $${producto.precio}</p>
            <p class="text-gray-600 mb-2">Stock: ${producto.stock}</p>
            <a href="detalle.html?id=${producto.id}" class="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center">Ver detalle</a>
        `;
        contenedorProductos.appendChild(productoDiv);
    });
}

//Detalle de los Productos.
if (window.location.pathname.endsWith('detalle.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const contenedor = document.getElementById('detalleProducto');
    if (!id) {
        contenedor.innerHTML = '<p>No se encontró el producto.</p>';
    } else {
        fetch(`http://127.0.0.1:8000/api/productos/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("No se pudo cargar el producto");
                return res.json();
            })
            .then(producto => {
                contenedor.innerHTML = `
                    <h2 class="text-2xl font-bold mb-4">${producto.titulo}</h2>
                    <img src="${producto.imagen}" alt="${producto.titulo}" class="w-64 h-64 object-contain mx-auto mb-4">
                    <p class="mb-2"><strong>Descripción:</strong> ${producto.descripcion}</p>
                    <p class="mb-2"><strong>Precio:</strong> $${producto.precio}</p>
                    <p class="mb-2"><strong>Stock:</strong> ${producto.stock}</p>
                    <a href="Tienda.html" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Volver</a>
                `;
            })
            .catch(() => {
                contenedor.innerHTML = '<p>Error al cargar el producto.</p>';
            });
    }
}

inputBusqueda.addEventListener("input", filtrarProductos);

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos(); // Cargar los productos al cargar la página
    cargarCategorias(); // Cargar las categorías al cargar la página
});

if (localStorage.getItem("token")) {
    // Si hay un token en el almacenamiento local, mostrar el botón de cerrar sesión
    logoutButton.classList.remove("hidden"); // Remover la clase hidden
}

// Lógica para mostrar el botón "Crear producto" solo si el usuario es admin
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const crearBtnId = "crear-producto-btn";
    // Elimina el botón si ya existe para evitar duplicados
    const btnExistente = document.getElementById(crearBtnId);
    if (btnExistente) btnExistente.remove();

    if (token) {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/me", {
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) throw new Error("No autorizado");
            const user = await response.json();

            // Verifica si el usuario tiene el rol admin (ajusta según tu backend, por ejemplo user.rol o user.role)
            if (user.rol === "admin") {
                // Crear y agregar el botón "Crear producto"
                const crearBtn = document.createElement("button");
                crearBtn.id = crearBtnId;
                crearBtn.textContent = "Crear producto";
                crearBtn.className = "btn btn-success ml-2"; // Bootstrap
                crearBtn.addEventListener("click", () => {
                    window.location.href = "crear.html";
                });

                // Puedes agregar el botón donde prefieras, aquí lo agrego al body al final
                document.body.appendChild(crearBtn);
            }
        } catch (error) {
            // Si hay error, no mostrar el botón
            // Opcional: console.error("No autorizado o error al obtener usuario:", error);
        }
    }
});

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token"); // Eliminar el token del almacenamiento local
        window.location.href = "login.html"; // Redirigir a la página de inicio de sesión
    });
}