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
// Variables para almacenar IDs de publicaciones y comentarios seleccionados
let idPublicacionSeleccionada = null;
let idComentarioSeleccionado = null;

// Función para mostrar el modal para añadir un comentario
function mostrarVentanaComentario(idPublicacion) {
    idPublicacionSeleccionada = idPublicacion;
    document.getElementById("modal3").style.display = "block";
}

// Función para cerrar el modal de añadir comentario
function cerrarVentanaComentario() {
    document.getElementById("modal3").style.display = "none";
}

// Función para mostrar el modal de ver comentarios
function mostrarVentanaVerComentarios(idPublicacion) {
    idPublicacionSeleccionada = idPublicacion;
    cargarComentarios(idPublicacion);
    document.getElementById("modal4").style.display = "block";
}

// Función para cerrar el modal de ver comentarios
function cerrarVentanaVerComentarios() {
    document.getElementById("modal4").style.display = "none";
}

// Función para cargar los comentarios de una publicación
async function cargarComentarios(idPublicacion) {
    try {
        const response = await fetch(`https://localhost:44380/api/Comentario/publicacion/${idPublicacion}`);
        const comentarios = await response.json();
        const listaComentarios = document.getElementById("listaComentarios");
        listaComentarios.innerHTML = "";

        if (comentarios.length > 0) {
            comentarios.forEach(comentario => {
                listaComentarios.innerHTML += `
                    <div class="comentario">
                        <p>${comentario.comentario}</p>
                        <button onclick="mostrarVentanaEditarComentario(${comentario.idComentario})">Editar</button>
                        <button onclick="eliminarComentario(${comentario.idComentario})">Eliminar</button>
                    </div>`;
            });
        } else {
            listaComentarios.innerHTML = "<p>No hay comentarios disponibles aún. ¡Sé el primero en comentar!</p>";
        }
    } catch (error) {
        console.error("Error al cargar comentarios:", error);
    }
}

// Función para enviar un comentario nuevo
async function enviarComentario() {
    const contenidoComentario = document.getElementById("contenidoComentario").value;

    const nuevoComentario = {
        comentario: contenidoComentario,
        idPublicacion: idPublicacionSeleccionada
    };

    try {
        const response = await fetch('https://localhost:44380/api/Comentario/crear-comentario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoComentario)
        });

        if (response.ok) {
            cerrarVentanaComentario();
            mostrarVentanaVerComentarios(idPublicacionSeleccionada); // Actualizar lista de comentarios
        } else {
            console.error("Error al crear el comentario");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

// Función para mostrar el modal de edición de comentario
function mostrarVentanaEditarComentario(idComentario) {
    idComentarioSeleccionado = idComentario;
    const comentario = document.getElementById("contenidoComentario");
    comentario.value = ""; // Aquí puedes poner el contenido actual del comentario si es necesario
    mostrarVentanaComentario(idPublicacionSeleccionada);
}

// Función para editar un comentario existente
async function editarComentario() {
    const contenidoComentario = document.getElementById("contenidoComentario").value;

    const comentarioEditado = {
        idComentario: idComentarioSeleccionado,
        idPublicacion: idPublicacionSeleccionada,
        contenido: contenidoComentario
    };

    try {
        const response = await fetch('https://localhost:44380/api/Comentario/actualizar-comentario', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comentarioEditado)
        });

        if (response.ok) {
            cerrarVentanaComentario();
            mostrarVentanaVerComentarios(idPublicacionSeleccionada); // Actualizar lista de comentarios
        } else {
            console.error("Error al editar el comentario");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

// Función para eliminar un comentario
async function eliminarComentario(idComentario) {
    try {
        const response = await fetch(`https://localhost:44380/api/Comentario/eliminar-comentario/${idComentario}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            mostrarVentanaVerComentarios(idPublicacionSeleccionada); // Actualizar lista de comentarios
        } else {
            console.error("Error al eliminar el comentario");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

// Llama a la función al cargar la página
cargarPublicaciones();
