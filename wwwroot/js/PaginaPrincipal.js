// Función para mostrar la ventana emergente de publicación
function mostrarVentanaEmergentePublicacion() {
    const modal = document.getElementById("modal1");
    modal.style.display = "block";
}

// Función para cerrar la ventana emergente de publicación
function cerrarVentanaEmergentePublicacion() {
    const modal = document.getElementById("modal1");
    modal.style.display = "none";
}

// Función para mostrar la ventana emergente de reporte
function mostrarVentanaEmergenteReporte() {
    const modal = document.getElementById("modal2");
    modal.style.display = "block";
}

// Función para cerrar la ventana emergente de reporte
function cerrarVentanaEmergenteReporte() {
    const modal = document.getElementById("modal2");
    modal.style.display = "none";
}

// Función para realizar una solicitud de publicación a la API
async function enviarPublicacion() {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('idUsuario'); // Obtén el idUsuario desde localStorage

    if (!token || !idUsuario) {
        console.error("Token o ID de usuario no disponible.");
        return;
    }

    const titulo = document.getElementById('titulo').value;
    const url = 'https://localhost:44380/api/Publicacion';

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idUsuario,
            titulo
        })
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Publicación realizada:", data);
        cargarPublicaciones(); // Llama a cargar publicaciones después de la publicación
        cerrarVentanaEmergentePublicacion(); // Cierra la ventana emergente después de publicar

    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

// Función para cargar las publicaciones desde la API
async function cargarPublicaciones() {
    const token = localStorage.getItem('token');
    const url = 'https://localhost:44380/api/Publicacion';

    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const publicaciones = await response.json();
        const contenedorPublicaciones = document.getElementById('publicacionesContainer');

        // Limpiar el contenedor antes de agregar nuevas publicaciones
        contenedorPublicaciones.innerHTML = '';

        // Recorrer y mostrar cada publicación en el HTML
        publicaciones.forEach((publicacion) => {
            const publicacionHTML = `
                <div class="publicacioncontainer">
                    <div class="usuarioPerfil">
                        <img src="~/css/imagenes/perfil.png" class="usu" alt="Perfil de usuario">
                        <p class="usuarioP">${publicacion.nombreUsuario}</p>
                    </div>
                    <div class="mensajeP">${publicacion.contenido}</div>
                    <button class="repor" onclick="mostrarVentanaEmergenteReporte()">Reportar</button>
                    <div class="interaccion">
                        <button class="like">
                            <img src="~/css/imagenes/like.png" alt="Like"> 
                            Like <span>${publicacion.numeroLikes}</span>
                        </button>
                        <button class="comen" onclick="mostrarVentanaEmergenteComentariosVisual()">
                            <img src="~/css/imagenes/comentario.png" alt="Comentar"> 
                            Comentar <span>${publicacion.numeroComentarios}</span>
                        </button>
                    </div>
                </div>
            `;

            // Insertar cada publicación en el contenedor
            contenedorPublicaciones.insertAdjacentHTML('beforeend', publicacionHTML);
        });

    } catch (error) {
        console.error('Error al cargar las publicaciones:', error);
    }
}

// Llama a cargarPublicaciones() al cargar la página
document.addEventListener('DOMContentLoaded', cargarPublicaciones);
