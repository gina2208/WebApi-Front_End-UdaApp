// Funciones de manejo de ventanas modales al inicio

// Mostrar y cerrar modal de publicación
function mostrarVentanaEmergentePublicacion() {
    document.getElementById("modal1").style.display = "block";
}

function cerrarVentanaEmergentePublicacion() {
    document.getElementById("modal1").style.display = "none";
}

// Mostrar y cerrar modal de reporte
function mostrarVentanaEmergenteReporte(idPublicacion) {
    document.getElementById('idPublicacion').value = idPublicacion;
    document.getElementById('modal2').style.display = 'block';
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
           <button class="repor" onclick="mostrarVentanaEmergenteReporte(${publicacion.idPublicacion})">Reportar</button>
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
    const idPublicacion = document.getElementById('idPublicacion').value; // Obtener el ID de la publicación
    const motivo = document.getElementById('opcionesSelect').value; // Obtener el motivo seleccionado

    // Verificar si los campos requeridos están completos
    if (!idPublicacion || !motivo) {
        console.error("Faltan datos para reportar la publicación.");
        return; // Salir si faltan datos
    }

    // Obtener la fecha actual en formato ISO 8601
    const fechaReporte = new Date().toISOString();

    const url = 'https://localhost:44380/api/Publicaciones/reportar';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idPublicacion: parseInt(idPublicacion),
                idUsuarioReportador: parseInt(idUsuario),
                motivo: motivo,
                fechaReporte: fechaReporte // Enviar la fecha actual
            })
        });

        if (response.ok) {
            console.log("Reporte enviado con éxito.");
            alert("Publicación reportada con éxito.");
            cerrarVentanaEmergenteReporte(); // Cerrar el modal de reporte
        } else {
            const errorData = await response.json();
            console.error("Error al reportar publicación:", errorData.Message);
            alert("Hubo un error al reportar la publicación. Inténtalo nuevamente.");
        }
    } catch (error) {
        console.error('Error en la solicitud de reporte:', error);
        alert("Hubo un error al procesar la solicitud. Inténtalo nuevamente.");
    }
}

// Función para enviar un comentario
async function enviarComentario() {
    const idPublicacion = document.getElementById('idPublicacionComentario').value;
    const contenido = document.getElementById('contenidoComentario').value;
    const token = localStorage.getItem('token');

    // Verifica que idPublicacion y contenido estén definidos
    if (!idPublicacion || !contenido) {
        console.error("Faltan datos: idPublicacion o contenido.");
        return;
    }

    try {
        const response = await fetch('https://localhost:44380/api/Comentario/crear-comentario', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comentario: contenido, // Asegúrate de que el nombre de la propiedad es "comentario"
                idPublicacion: parseInt(idPublicacion)
            })
        });

        if (response.ok) {
            console.log("Comentario enviado con éxito.");
            cerrarVentanaComentario(); // Cerrar el modal
            await cargarPublicaciones(); // Recargar publicaciones para ver el nuevo comentario
        } else {
            console.error("Error al enviar comentario:", response.statusText);
            const errorData = await response.json();
            console.error("Detalles del error:", errorData);
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

//eliminar publicacion 
async function eliminarPublicacion(idPublicacion) {
    const token = localStorage.getItem('token');

    if (!idPublicacion) {
        console.error("ID de publicación no válido");
        return; // Salir si no se tiene un ID válido
    }

    try {
        const response = await fetch(`https://localhost:44380/api/Publicaciones/eliminar-publicacion?idPublicacion=${idPublicacion}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log("Publicación eliminada.");
            cargarPublicaciones(); // Recargar publicaciones después de eliminar
            cerrarVentanaEliminar(); // Cerrar el modal de confirmación
        } else {
            console.error("Error al eliminar publicación:", response.statusText);
        }
    } catch (error) {
        console.error("Error en la solicitud de eliminación:", error);
    }
}

function confirmarEliminacion() {
    const idPublicacion = document.getElementById('idPublicacionEliminar').value;
    eliminarPublicacion(idPublicacion); // Llamamos a eliminarPublicacion con el ID
}


// Variables para almacenar IDs de publicaciones y comentarios seleccionados
let idPublicacionSeleccionada = null;
let idComentarioSeleccionado = null;

// Función para mostrar el modal para añadir un comentario
function mostrarVentanaComentario(idPublicacion) {
    document.getElementById('idPublicacionComentario').value = idPublicacion;
    document.getElementById('modal3').style.display = 'block';
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
async function cargarComentarios(idPublicacion) {
    try {
        const response = await fetch(`https://localhost:44380/api/Comentario/publicacion/${idPublicacion}`);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        const comentarios = await response.json();
        const listaComentarios = document.getElementById("listaComentarios");
        listaComentarios.innerHTML = "";

        // Asegurarse de que los comentarios sean de la publicación correcta
        const comentariosDeLaPublicacion = comentarios.filter(comentario => comentario.idPublicacion === idPublicacion);

        if (comentariosDeLaPublicacion.length > 0) {
            comentariosDeLaPublicacion.forEach(comentario => {
                // Formatear la fecha de creación
                const fechaFormateada = new Date(comentario.fechaCreacion).toLocaleString();

                listaComentarios.innerHTML += `
                    <div class="comentario">
                        <p><strong>${comentario.nombreUsuarioComentador}</strong> - ${fechaFormateada}</p>
                        <p>${comentario.contenido}</p>
                       <button onclick="mostrarVentanaEditarComentario(${comentario.idComentario}, '${comentario.contenido}')">Editar</button>
                    <button onclick="mostrarVentanaEliminarComentario(${comentario.idComentario})">Eliminar</button> </div>`;
            });
        } else {
            listaComentarios.innerHTML = "<p>No hay comentarios disponibles aún. ¡Sé el primero en comentar!</p>";
        }
    } catch (error) {
        console.error("Error al cargar comentarios:", error);
    }
}

// Mostrar el modal de edición con el contenido actual del comentario
function mostrarVentanaEditarComentario(idComentario, contenido) {
    document.getElementById('idComentarioEditar').value = idComentario;
    document.getElementById('contenidoComentarioEditar').value = contenido;
    document.getElementById("modalEditarComentario").style.display = "block";
    document.getElementById("fondoModal").style.display = "block"; // Mostrar fondo
}

// Cerrar el modal de edición
function cerrarVentanaEditarComentario() {
    document.getElementById("modalEditarComentario").style.display = "none";
    document.getElementById("fondoModal").style.display = "none"; // Ocultar fondo
}


// Función para enviar la edición de un comentario
async function enviarEdicionComentario() {
    const idComentario = document.getElementById('idComentarioEditar').value;
    const contenidoComentario = document.getElementById('contenidoComentarioEditar').value;
    const idUsuario = localStorage.getItem('id'); // ID del usuario que edita
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('https://localhost:44380/api/Comentario/actualizar-comentario', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idComentario: parseInt(idComentario), // ID del comentario
                idPublicacion: parseInt(idPublicacionSeleccionada), // ID de la publicación
                contenido: contenidoComentario // Nuevo contenido del comentario
            })
        });

        if (response.ok) {
            console.log("Comentario editado.");
            cargarComentarios(idPublicacionSeleccionada); // Recargar comentarios después de editar
            cerrarVentanaEditarComentario();
        } else {
            console.error("Error al editar el comentario:", response.statusText);
        }
    } catch (error) {
        console.error("Error en la solicitud de edición:", error);
    }
}

// Mostrar el modal de confirmación de eliminación
function mostrarVentanaEliminarComentario(idComentario) {
    document.getElementById('idComentarioEliminar').value = idComentario;
    document.getElementById("modalEliminarComentario").style.display = "block";
    document.getElementById("fondoModal").style.display = "block"; // Mostrar fondo
}

// Cerrar el modal de eliminación
function cerrarVentanaEliminarComentario() {
    document.getElementById("modalEliminarComentario").style.display = "none";
    document.getElementById("fondoModal").style.display = "none"; // Ocultar fondo
}
// Función para eliminar un comentario
async function eliminarComentario(idComentario) {
    const token = localStorage.getItem('token');

    if (!idComentario) {
        console.error("ID de comentario no válido");
        return; // Salir si no se tiene un ID válido
    }

    try {
        const response = await fetch(`https://localhost:44380/api/Comentario/eliminar-comentario?idComentario=${idComentario}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log("Comentario eliminado.");
            cargarComentarios(idPublicacionSeleccionada); // Recargar comentarios después de eliminar
            cerrarVentanaEliminarComentario(); // Cerrar el modal de confirmación
        } else {
            console.error("Error al eliminar el comentario:", response.statusText);
        }
    } catch (error) {
        console.error("Error en la solicitud de eliminación:", error);
    }
}

function confirmarEliminacionComentario() {
    const idComentario = document.getElementById('idComentarioEliminar').value;
    eliminarComentario(idComentario); // Llamamos a eliminarComentario con el ID
}

// Llama a la función al cargar la página
cargarPublicaciones();
