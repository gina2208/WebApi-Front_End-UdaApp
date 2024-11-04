// Funciones de manejo de ventanas modales al inicio

// Mostrar y cerrar modal de publicación
function mostrarVentanaEmergentePublicacion() {
    document.getElementById("modal1").style.display = "block";
}

function cerrarVentanaEmergentePublicacion() {
    document.getElementById("modal1").style.display = "none";
}

// Mostrar y cerrar modal de reporte
function mostrarVentanaEmergenteReporte() {
    document.getElementById("modal2").style.display = "block";
}

function cerrarVentanaEmergenteReporte() {
    document.getElementById("modal2").style.display = "none";
}

// Mostrar y cerrar modal de agregar comentario
function mostrarVentanaComentario(idPublicacion) {
    document.getElementById('idPublicacionComentario').value = idPublicacion;
    document.getElementById('modal3').style.display = 'block';
}

function cerrarVentanaComentario() {
    document.getElementById('modal3').style.display = 'none';
}

// Mostrar y cerrar modal de ver comentarios
async function mostrarVentanaVerComentarios(idPublicacion) {
    const listaComentarios = document.getElementById('listaComentarios');
    listaComentarios.innerHTML = '';
    document.getElementById('modal4').style.display = 'block';

    try {
        const response = await fetch(`https://localhost:44380/api/Publicaciones/${idPublicacion}/comentarios`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.ok) {
            const comentarios = await response.json();
            comentarios.forEach(comentario => {
                const comentarioElemento = document.createElement('div');
                comentarioElemento.className = 'comentario';
                comentarioElemento.innerHTML = `
                    <p><strong>${comentario.usuario}</strong>: ${comentario.contenido}</p>
                    <p><em>${new Date(comentario.fecha).toLocaleString()}</em></p>
                `;
                listaComentarios.appendChild(comentarioElemento);
            });
        } else {
            console.error("Error al obtener comentarios");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function cerrarVentanaVerComentarios() {
    document.getElementById('modal4').style.display = 'none';
}
// Mostrar y cerrar modal de edición
function mostrarVentanaEditar(idPublicacion, titulo) {
    document.getElementById('idPublicacionEditar').value = idPublicacion;
    document.getElementById('tituloEditar').value = titulo;
    document.getElementById("modal5").style.display = "block";
}

function cerrarVentanaEditar() {
    document.getElementById("modal5").style.display = "none";
}

// Función para enviar la edición
async function enviarEdicion() {
    const idPublicacion = document.getElementById('idPublicacionEditar').value;
    const nuevoTitulo = document.getElementById('tituloEditar').value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`https://localhost:44380/api/Publicaciones/${idPublicacion}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo: nuevoTitulo })
        });

        if (response.ok) {
            console.log("Publicación editada.");
            cargarPublicaciones();
            cerrarVentanaEditar();
        } else {
            console.error("Error al editar publicación:", response.statusText);
        }
    } catch (error) {
        console.error("Error en la solicitud de edición:", error);
    }
}

// Mostrar y cerrar modal de eliminación
function mostrarVentanaEliminar(idPublicacion) {
    document.getElementById('idPublicacionEliminar').value = idPublicacion;
    document.getElementById("modal6").style.display = "block";
}

function cerrarVentanaEliminar() {
    document.getElementById("modal6").style.display = "none";
}

// Confirmar eliminación de publicación
async function confirmarEliminacion() {
    const idPublicacion = document.getElementById('idPublicacionEliminar').value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`https://localhost:44380/api/Publicaciones/${idPublicacion}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log("Publicación eliminada.");
            cargarPublicaciones();
            cerrarVentanaEliminar();
        } else {
            console.error("Error al eliminar publicación:", response.statusText);
        }
    } catch (error) {
        console.error("Error en la solicitud de eliminación:", error);
    }
}


// Función para mostrar el menú
function mostrarMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Función para enviar una publicación a la API
async function enviarPublicacion() {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');
    const titulo = document.getElementById('titulo').value;
    const url = 'https://localhost:44380/api/Publicaciones/hacer-publicacion';

    if (!token || !idUsuario) {
        console.error("Token o ID de usuario no disponible.");
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idUsuario, titulo })
        });

        if (response.ok) {
            console.log("Publicación realizada.");
            cargarPublicaciones();
            cerrarVentanaEmergentePublicacion();
        } else {
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

// Función para cargar publicaciones
async function cargarPublicaciones() {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id'); // Obtiene el ID del usuario actual
    const url = 'https://localhost:44380/api/Publicaciones/pagina-principal';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const publicaciones = await response.json();
            const contenedorPublicaciones = document.getElementById('publicacionesContainer');
            contenedorPublicaciones.innerHTML = '';


            publicaciones.forEach(publicacion => {
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
                    <span class="like-count" data-id="${publicacion.idPublicacion}">${publicacion.numeroLikes}</span>
                </button>
                <button class="ver-comentarios" onclick="mostrarVentanaVerComentarios(${publicacion.idPublicacion})">
                    <img src="/css/imagenes/comentario.png" alt="Comentarios"> 
                </button>
                <button class="comentar" onclick="mostrarVentanaComentario(${publicacion.idPublicacion})">
                    <img src="/css/imagenes/comentario.png" alt="Comentar"> 
                </button>
                <button class="editar" onclick="mostrarVentanaEditar(${publicacion.idPublicacion}, '${publicacion.titulo}')">Editar</button>
                <button class="eliminar" onclick="mostrarVentanaEliminar(${publicacion.idPublicacion})">Eliminar</button>

            </div>
        </div>
    `;
                contenedorPublicaciones.insertAdjacentHTML('beforeend', publicacionHTML);
            });

        } else {
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error('Error al cargar las publicaciones:', error);
    }
}

// Función para dar like a una publicación
async function darLike(idPublicacion) {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');
    const url = 'https://localhost:44380/api/Publicaciones/toggle-like';

    if (!token || !idUsuario) {
        console.error("Token o ID de usuario no disponible.");
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idUsuario: parseInt(idUsuario), idPublicacion, likeStatus: true })
        });

        if (response.ok) {
            const data = await response.json();
            const likeCountSpan = document.querySelector(`.like-count[data-id="${idPublicacion}"]`);
            if (likeCountSpan) {
                likeCountSpan.textContent = data.numeroLikes;
            }
        } else {
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud de like:', error);
    }
}

// Función para reportar una publicación
async function reportarPublicacion() {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');
    const idPublicacion = document.getElementById('idPublicacion').value;
    const motivo = document.getElementById('opcionesSelect').value;
    const url = 'https://localhost:44380/api/Publicaciones/reportar';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idPublicacion: parseInt(idPublicacion), idUsuarioReportador: parseInt(idUsuario), motivo })
        });

        if (response.ok) {
            console.log("Reporte enviado.");
            cerrarVentanaEmergenteReporte();
        } else {
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud de reporte:', error);
    }
}

// Función para enviar un comentario
async function enviarComentario() {
    const idPublicacion = document.getElementById('idPublicacionComentario').value;
    const contenido = document.getElementById('contenidoComentario').value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`https://localhost:44380/api/Publicaciones/${idPublicacion}/comentarios`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contenido })
        });

        if (response.ok) {
            cerrarVentanaComentario();
            await cargarPublicaciones(); // Recargar publicaciones para ver el nuevo comentario
        } else {
            console.error("Error al enviar comentario:", response.statusText);
        }
    } catch (error) {
        console.error("Error en la solicitud de comentario:", error);
    }
}
// Función para enviar la edición
async function enviarEdicion() {
    const idPublicacion = document.getElementById('idPublicacionEditar').value;
    const nuevoTitulo = document.getElementById('tituloEditar').value;
    const idUsuario = localStorage.getItem('id'); // ID del usuario que edita
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`https://localhost:44380/api/Publicaciones/actualizar-publicacion`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUsuario: parseInt(idUsuario), // ID del usuario que edita
                idPublicacion: parseInt(idPublicacion), // ID de la publicación
                titulo: nuevoTitulo, // Nuevo título
                contenido: "" // Contenido vacío
            })
        });

        if (response.ok) {
            console.log("Publicación editada.");
            cargarPublicaciones(); // Recargar publicaciones después de editar
            cerrarVentanaEditar();
        } else {
            console.error("Error al editar publicación:", response.statusText);
        }
    } catch (error) {
        console.error("Error en la solicitud de edición:", error);
    }
}


// Confirmar eliminación de publicación
async function confirmarEliminacion() {
    const idPublicacion = document.getElementById('idPublicacionEliminar').value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`https://localhost:44380/api/Publicaciones/eliminar-publicacion`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idPublicacion: parseInt(idPublicacion) }) // Enviando el ID de la publicación a eliminar
        });

        if (response.ok) {
            console.log("Publicación eliminada.");
            cargarPublicaciones(); // Recargar publicaciones después de eliminar
            cerrarVentanaEliminar();
        } else {
            console.error("Error al eliminar publicación:", response.statusText);
        }
    } catch (error) {
        console.error("Error en la solicitud de eliminación:", error);
    }
}

// Llama a la función al cargar la página
cargarPublicaciones();
