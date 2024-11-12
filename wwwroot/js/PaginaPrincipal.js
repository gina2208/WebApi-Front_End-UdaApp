// Función para mostrar la ventana emergente de publicación
function mostrarVentanaEmergentePublicacion() {
    const modal = document.getElementById("modal1");
    modal.style.display = "block";
}

// Función para mostrar el menú
function mostrarMenu() {
    const modal = document.getElementById("menu");
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

// Función para obtener el valor de una cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Función para realizar una solicitud de publicación a la API
async function enviarPublicacion() {
    const token = getCookie('Authtoken');
    const idUsuario = getCookie('idUsuario'); // Obtén el idUsuario desde la cookie

    if (!token || !idUsuario) {
        console.error("Token o ID de usuario no disponible.");
        return;
    }

    const titulo = document.getElementById('titulo').value;
    const url = 'https://localhost:44380/api/Publicaciones/hacer-publicacion';

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
    const token = getCookie('token');
    const url = 'https://localhost:44380/api/Publicaciones/pagina-principal';

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
                        <img src="/css/imagenes/Perfil.png" class="usu" alt="Perfil de usuario">
                        <p class="usuarioP">${publicacion.nombreUsuario}</p>
                    </div>
                   
                    <p class="fechaPublicacion">Publicado el: ${new Date(publicacion.fechaPublicacion).toLocaleDateString()}</p>
                    <div class="mensajeP">${publicacion.titulo}</div>
                    <button class="repor" onclick="mostrarVentanaEmergenteReporte()">Reportar</button>
                    <div class="interaccion">
                        <button class="like" onclick="darLike(${publicacion.idPublicacion})">
                            <img src="/css/imagenes/like.png" alt="Like"> 
                            Like <span class="like-count" data-id="${publicacion.idPublicacion}">${publicacion.numeroLikes}</span>
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

// Función para dar like a una publicación
async function darLike(idPublicacion) {
    const token = getCookie('token');
    const idUsuario = getCookie('idUsuario'); // Obtiene el idUsuario desde la cookie
    const url = 'https://localhost:44380/api/Publicaciones/toggle-like';

    if (!token || !idUsuario) {
        console.error("Token o ID de usuario no disponible.");
        return;
    }

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idUsuario: parseInt(idUsuario),
            idPublicacion: idPublicacion,
            likeStatus: true
        })
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Error al dar like: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Like agregado:", data);

        // Actualiza el número de likes en el DOM sin recargar toda la lista de publicaciones
        const likeCountSpan = document.querySelector(`.like-count[data-id="${idPublicacion}"]`);
        if (likeCountSpan) {
            likeCountSpan.textContent = data.numeroLikes;
        }

    } catch (error) {
        console.error('Error en la solicitud de like:', error);
    }
}

// Función para reportar una publicación
async function reportarPublicacion() {
    const token = getCookie('token');
    const idUsuario = getCookie('idUsuario');
    const idPublicacion = document.getElementById('idPublicacion').value;
    const motivo = document.getElementById('opcionesSelect').value;
    const url = 'https://localhost:44380/api/Publicaciones/reportar';

    if (!token || !idUsuario) {
        console.error("Token o ID de usuario no disponible.");
        return;
    }

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idPublicacion: parseInt(idPublicacion),
            idUsuarioReportador: parseInt(idUsuario),
            motivo: motivo
        })
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Error al reportar: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Reporte enviado:", data);
        cargarPublicaciones(); // Opcionalmente recargar publicaciones para reflejar cambios
        cerrarVentanaEmergenteReporte();

    } catch (error) {
        console.error('Error en la solicitud de reporte:', error);
    }
}

// Llama a cargarPublicaciones() al cargar la página
document.addEventListener('DOMContentLoaded', cargarPublicaciones);
