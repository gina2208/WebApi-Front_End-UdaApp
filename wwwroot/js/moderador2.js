// Funciones para manejar cookies
function setCookie(name, value, days = 1) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; Secure`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function eraseCookie(name) {
    document.cookie = `${name}=; Max-Age=-99999999; path=/`;
}

// Función para obtener publicaciones reportadas

async function obtenerPublicacionesReportadas() {
    const idUsuario = getCookie('id');
    const token = getCookie('token');

    if (!idUsuario || !token) {
        alert("ID de usuario o token no encontrados.");
        return;
    }

    try {
        const response = await fetch(`https://udapphosting-001-site1.ktempurl.com/api/Moderador/listar-publicaciones-reportadas?idUsuario=${idUsuario}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const publicacionesResponse = await response.json();

            // Verificar si la respuesta contiene un array en `reportesDto`
            if (publicacionesResponse.exito && Array.isArray(publicacionesResponse.reportesDto)) {
                mostrarPublicacionesReportadas(publicacionesResponse.reportesDto);
            } else {
                console.error("La respuesta de la API no contiene un array:", publicacionesResponse);
                alert("Error en la estructura de respuesta de la API.");
            }
        } else {
            alert("Error al obtener publicaciones reportadas. Código de estado: " + response.status);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

// Función para mostrar publicaciones reportadas en el contenedor
function mostrarPublicacionesReportadas(reportesDto) {
    const contenedor = document.getElementById("reportes-container");
    contenedor.innerHTML = "";

    reportesDto.forEach((reporte) => {
        const publicacionDiv = document.createElement("div");
        publicacionDiv.className = "publicacionR";
        publicacionDiv.innerHTML = `
            <h3>${reporte.tituloPublicacion}</h3>
            <p><strong>Fecha de Publicación:</strong> ${new Date(reporte.fechaPublicacion).toLocaleDateString()}</p>
            <p><strong>Motivo Reporte:</strong> ${reporte.motivoReporte}</p>
            <p><strong>Usuario Publicador:</strong> ${reporte.nombreUsuarioPublicacador}</p>
            <div class="botonesR">
               <button onclick="confirmarEliminarPublicacion(${reporte.idPublicacionReportada})">Eliminar Publicación</button>
                <button onclick="confirmarEliminarReporte(${reporte.idReporte})">Eliminar Reporte</button>
            </div>
        `;
        contenedor.appendChild(publicacionDiv);
    });
}


// Funciones para mostrar y cerrar los modales
function mostrarVentanaEmergenteReportes() {
    document.getElementById("modal").style.display = "block";
    obtenerPublicacionesReportadas(); // Llamar a obtener las publicaciones reportadas al abrir el modal
}

function cerrarVentanaEmergenteReportes() {
    document.getElementById("modal").style.display = "none";
}

function mostrarVentanaEmergenteDescargarReportes() {
    document.getElementById("descargarReportesModal").style.display = "block";
}

function cerrarModalDescargarReportes() {
    document.getElementById("descargarReportesModal").style.display = "none";
}

// Funciones para confirmar eliminación de publicaciones y reportes
function confirmarEliminarPublicacion(idPublicacion) {
    if (!idPublicacion) {
        console.error("ID de publicación no válido:", idPublicacion);
        alert("Error: No se pudo obtener el ID de la publicación a eliminar.");
        return;
    }

    window.idPublicacionAEliminar = idPublicacion;
    console.log("Publicación seleccionada para eliminar, ID:", idPublicacion);
    document.getElementById("eliminarPublicacionModal").style.display = "block";
}


function cerrarModalEliminarPublicacion() {
    document.getElementById("eliminarPublicacionModal").style.display = "none";
}

function confirmarEliminarReporte(idReporte) {
    window.idReporteAEliminar = idReporte;
    document.getElementById("eliminarReporteModal").style.display = "block";
}

function cerrarModalEliminarReporte() {
    document.getElementById("eliminarReporteModal").style.display = "none";
}
async function eliminarPublicacion() {
    const idPublicacion = window.idPublicacionAEliminar;

    if (!idPublicacion) {
        console.error("No se encontró el ID de la publicación a eliminar.");
        alert("Error: No se encontró la publicación a eliminar.");
        return;
    }

    try {
        const idUsuario = getCookie('id'); // Obtener el ID del moderador desde las cookies
        const token = getCookie('token'); // Obtener el token desde las cookies


        const response = await fetch(`https://webapiudapp.somee.com/api/Moderador/eliminar-publicacion-mod?idPublicacion=${idPublicacion}&idUsuario=${idUsuario}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert("Publicación eliminada correctamente.");
        } else {
            const errorText = await response.text();
            console.error("Error al eliminar la publicación:", errorText);
            alert("Error al eliminar la publicación: " + errorText);
        }

        cerrarModalEliminarPublicacion();
        obtenerPublicacionesReportadas(); // Actualizar la lista

    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Ocurrió un error al intentar eliminar la publicación.");
    }
}


// Función para eliminar un reporte
async function eliminarReporte() {
    try {
        const idUsuario = getCookie('id'); // Obtener el ID del moderador desde las cookies
        const token = getCookie('token'); // Obtener el token desde las cookies


        const response = await fetch(`https://webapiudapp.somee.com/api/Moderador/eliminar-reporte-mod?idReporte=${window.idReporteAEliminar}&idUsuario=${idUsuario}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Enviar el token en la autorización
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert("Reporte eliminado correctamente.");
            cerrarModalEliminarReporte();
            obtenerPublicacionesReportadas(); // Actualizar publicaciones reportadas
        } else {
            const errorText = await response.text();
            console.error("Error al eliminar el reporte:", errorText);
            alert("Error al eliminar el reporte.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}



