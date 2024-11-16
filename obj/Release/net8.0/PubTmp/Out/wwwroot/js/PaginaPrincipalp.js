
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el token desde las cookies
    const token = getCookie('token');

    if (token) {
        try {
            // Decodificar el token
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Payload del token:', payload);

            // Obtener el rol desde el token decodificado
            const roleName = payload.roleName;

            // Mostrar botones según el rol
            mostrarBotonesPorRol(roleName);
        } catch (error) {
            console.error('Error al procesar el token:', error);
        }
    } else {
        console.error('Token no encontrado.');
    }
});

// Función para mostrar botones según el rol
function mostrarBotonesPorRol(roleName) {
    const menu = document.getElementById('menu');

    // Mostrar botones básicos (disponibles para todos)
    const perfilButton = crearBoton('perfil.png', 'Perfil', () => {
        window.location.href = '/Home/Perfil';
    });
    const publicacionButton = crearBoton('publicacion.png', 'Hacer publicación', () => {
        mostrarVentanaEmergentePublicacion();
    });

    menu.appendChild(perfilButton);
    menu.appendChild(publicacionButton);

    // Mostrar botones específicos por rol
    if (roleName === 'Admin') {
        const adminButton = crearBoton('admin.png', 'Admin', () => {
            window.location.href = '/Home/Admin';
        });
        menu.appendChild(adminButton);
    } else if (roleName === 'Moderador') {
        const moderadorButton = crearBoton('moderar.png', 'Moderador', () => {
            window.location.href = '/Home/Moderador2';
        });
        menu.appendChild(moderadorButton);
    } else if (roleName === 'Gerente') {
        const gerenteButton = crearBoton('gerente.png', 'Gerente', () => {
            window.location.href = '/Home/Gerente';
        });
        menu.appendChild(gerenteButton);
    }

    // Si es rol general, no se agregan botones adicionales.
}

// Función para crear botones con iconos
function crearBoton(imagenSrc, texto, onClick) {
    const button = document.createElement('button');
    button.innerHTML = `
        <img src="/css/imagenes/${imagenSrc}" height="80" width="80">
        ${texto}
    `;
    button.addEventListener('click', onClick);
    return button;
}

// Función para obtener cookies por nombre
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(row => row.startsWith(name + '='));
    return cookie ? cookie.split('=')[1] : null;
}
function borrarCookiesYSalir() {
    // Borrar todas las cookies de sesión
    const cookies = document.cookie.split(";");

    cookies.forEach(cookie => {
        const cookieName = cookie.split("=")[0];
        // Establecer la fecha de expiración en el pasado para borrar la cookie
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    });

    // Redirigir a la página de inicio
    window.location.href = '@Url.Action("Index", "Home")';
}


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
    const token = getCookie('token');

    try {
        const response = await fetch(`https://udapphosting-001-site1.ktempurl.com/api/Publicaciones/${idPublicacion}`, {
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
    const token = getCookie('token'); // Cambiado de localStorage a cookies
    const idUsuario = getCookie('id'); // Cambiado de localStorage a cookies
    const titulo = document.getElementById('titulo').value;
    const url = 'https://udapphosting-001-site1.ktempurl.com/api/Publicaciones/hacer-publicacion';

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

async function cargarPublicaciones() {
    const token = getCookie('token');
    const idUsuario = parseInt(getCookie('id')); // Asegúrate de que sea un número


    if (!idUsuario || isNaN(idUsuario)) {
        console.error('El ID de usuario no se obtuvo correctamente');
        return;
    }

    const url = 'https://udapphosting-001-site1.ktempurl.com/api/Publicaciones/pagina-principal';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error("Error al obtener publicaciones:", response.statusText);
            return;
        }

        const publicaciones = await response.json();
        console.log('Respuesta completa de publicaciones:', publicaciones); // Verificar estructura

        const contenedorPublicaciones = document.getElementById('publicacionesContainer');
        contenedorPublicaciones.innerHTML = '';

        publicaciones.forEach(publicacion => {

            const esCreador = publicacion.idUsuarioPublicador ? idUsuario === parseInt(publicacion.idUsuarioPublicador) : false;


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
                        ${esCreador ? `
                            <button class="editar" onclick="mostrarVentanaEditar(${publicacion.idPublicacion}, '${publicacion.titulo}')">Editar</button>
                            <button class="eliminar" onclick="mostrarVentanaEliminar(${publicacion.idPublicacion})">Eliminar</button>
                        ` : ''}
                    </div>
                </div>`;
            contenedorPublicaciones.insertAdjacentHTML('beforeend', publicacionHTML);
        });

    } catch (error) {
        console.error('Error al cargar las publicaciones:', error);
    }
}



// Función para dar like a una publicación
async function darLike(idPublicacion) {
    const token = getCookie('token'); // Cambiado de localStorage a cookies
    const idUsuario = getCookie('id'); // Cambiado de localStorage a cookies
    const url = 'https://udapphosting-001-site1.ktempurl.com/api/Publicaciones/toggle-like';

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
                if (typeof data.numeroLikes === 'number') {
                    // Usar el valor devuelto por la API si está disponible
                    likeCountSpan.textContent = data.numeroLikes;
                } else {
                    // Ajuste manual basado en el estado de like
                    const currentLikes = parseInt(likeCountSpan.textContent);
                    const newLikes = data.likeStatus ? currentLikes = currentLikes + 1 : currentLikes + 1;
                    likeCountSpan.textContent = newLikes;
                }
            }
        } else {
            console.error("Error al dar like:", response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud de like:', error);
    }
    }


// Función para reportar una publicación
async function reportarPublicacion() {
    const token = getCookie('token'); // Cambiado de localStorage a cookies
    const idUsuario = getCookie('id'); // Cambiado de localStorage a cookies
    const idPublicacion = document.getElementById('idPublicacion').value; // Obtener el ID de la publicación
    const motivo = document.getElementById('opcionesSelect').value; // Obtener el motivo seleccionado

    // Verificar si los campos requeridos están completos
    if (!idPublicacion || !motivo) {
        console.error("Faltan datos para reportar la publicación.");
        return; // Salir si faltan datos
    }

    // Obtener la fecha actual en formato ISO 8601
    const fechaReporte = new Date().toISOString();

    const url = 'https://udapphosting-001-site1.ktempurl.com/api/Publicaciones/reportar';

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
    const token = getCookie('token'); // Cambiado para obtener el token desde cookies

    // Verifica que idPublicacion y contenido estén definidos
    if (!idPublicacion || !contenido) {
        console.error("Faltan datos: idPublicacion o contenido.");
        return;
    }

    try {
        const response = await fetch('https://udapphosting-001-site1.ktempurl.com/api/Comentario/crear-comentario', {
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

// Función para enviar la edición de una publicación
async function enviarEdicion() {
    const idPublicacion = document.getElementById('idPublicacionEditar').value;
    const nuevoTitulo = document.getElementById('tituloEditar').value;
    const idUsuario = getCookie('id'); // Cambiado para obtener el ID de usuario desde cookies
    const token = getCookie('token'); // Cambiado para obtener el token desde cookies

    try {
        const response = await fetch(`https://udapphosting-001-site1.ktempurl.com/api/Publicaciones/actualizar-publicacion`, {
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

// Función para eliminar una publicación
async function eliminarPublicacion(idPublicacion) {
    const token = getCookie('token'); // Obtiene el token desde las cookies

    if (!idPublicacion) {
        console.error("ID de publicación no válido");
        return; // Salir si no se tiene un ID válido
    }

    try {
        const response = await fetch(`https://udapphosting-001-site1.ktempurl.com/api/Publicaciones/eliminar-publicacion?idPublicacion=${idPublicacion}`, {
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
} async function cargarComentarios(idPublicacion) {
    const token = getCookie('token');
    const idUsuario = getCookie('id');
    try {
        const response = await fetch(`https://udapphosting-001-site1.ktempurl.com/api/Comentario/publicacion/${idPublicacion}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        const comentarios = await response.json();
        const listaComentarios = document.getElementById("listaComentarios");
        listaComentarios.innerHTML = "";

        const comentariosDeLaPublicacion = comentarios.filter(comentario => comentario.idPublicacion === idPublicacion);

        if (comentariosDeLaPublicacion.length > 0) {
            comentariosDeLaPublicacion.forEach(comentario => {
                const esCreadorComentario = idUsuario == comentario.idUsuario; // Verifica si es el creador
                const fechaFormateada = new Date(comentario.fechaCreacion).toLocaleString();

                listaComentarios.innerHTML += `
                    <div class="comentario">
                        <p><strong>${comentario.nombreUsuarioComentador}</strong> - ${fechaFormateada}</p>
                        <p>${comentario.contenido}</p>
                        ${esCreadorComentario ? `
                            <button onclick="mostrarVentanaEditarComentario(${comentario.idComentario}, '${comentario.contenido}')">Editar</button>
                            <button onclick="mostrarVentanaEliminarComentario(${comentario.idComentario})">Eliminar</button>
                        ` : ''}
                    </div>`;
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
    const idUsuario = getCookie('id'); // Obtiene el ID del usuario desde las cookies
    const token = getCookie('token'); // Obtiene el token desde las cookies

    // Verificar si idPublicacionSeleccionada está definido y el ID del comentario es válido
    if (!idComentario || !idUsuario || !token) {
        console.error("Datos incompletos para editar el comentario.");
        return;
    }

    try {
        const response = await fetch('https://udapphosting-001-site1.ktempurl.com/api/Comentario/actualizar-comentario', {
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
    const token = getCookie('token'); // Obtener el token desde las cookies

    if (!idComentario || !token) {
        console.error("Datos incompletos para eliminar el comentario.");
        return; // Salir si no se tiene un ID válido o token
    }

    try {
        const response = await fetch(`https://udapphosting-001-site1.ktempurl.com/api/Comentario/eliminar-comentario?idComentario=${idComentario}`, {
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

// Función para confirmar la eliminación de un comentario
function confirmarEliminacionComentario() {
    const idComentario = document.getElementById('idComentarioEliminar').value;
    eliminarComentario(idComentario); // Llamamos a eliminarComentario con el ID
}


// Llama a la función al cargar la página
cargarPublicaciones();
