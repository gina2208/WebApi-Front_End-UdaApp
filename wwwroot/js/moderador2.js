﻿// Funciones para manejar cookies
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
    const idUsuario = getCookie('id'); // Obtener el ID del usuario desde las cookies
    const token = getCookie('token'); // Obtener el token desde las cookies

    if (!idUsuario) {
        alert("ID de usuario no encontrado.");
        return;
    }

    try {
        const response = await fetch(`https://udapphosting-001-site1.ktempurl.com/api/Moderador/listar-publicaciones-reportadas?idUsuario=${idUsuario}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Autorización si es necesaria
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const publicaciones = await response.json();
            mostrarPublicacionesReportadas(publicaciones); // Llamada a la función para mostrar las publicaciones
        } else {
            alert("Error al obtener publicaciones reportadas.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

// Función para mostrar publicaciones reportadas en el contenedor
function mostrarPublicacionesReportadas(publicaciones) {
    const contenedor = document.getElementById("reportes-container");
    contenedor.innerHTML = ""; // Limpiar contenido previo

    publicaciones.forEach((publicacion) => {
        const publicacionDiv = document.createElement("div");
        publicacionDiv.className = "publicacionR";
        publicacionDiv.innerHTML = `
            <h3>${publicacion.titulo}</h3>
            <p>${publicacion.contenido}</p>
            <p><strong>Fecha de Publicación:</strong> ${new Date(publicacion.fechaPublicacion).toLocaleDateString()}</p>
            <p><strong>Motivo Reporte:</strong> ${publicacion.motivoReporte}</p>
            <p><strong>Usuario:</strong> ${publicacion.usuarioNombre}</p>
            <div class="botonesR">
                <button onclick="confirmarEliminarPublicacion(${publicacion.idPublicacion})">Eliminar Publicación</button>
                <button onclick="confirmarEliminarReporte(${publicacion.idReporte})">Eliminar Reporte</button>
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
    window.idPublicacionAEliminar = idPublicacion;
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

// Función para eliminar una publicación
async function eliminarPublicacion() {
    try {
        const response = await fetch(`https://udapphosting-001-site1.ktempurl.com/api/Moderador/eliminar-publicacion-mod`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idPublicacion: window.idPublicacionAEliminar })
        });

        if (response.ok) {
            alert("Publicación eliminada correctamente.");
            cerrarModalEliminarPublicacion();
            obtenerPublicacionesReportadas(); // Actualizar publicaciones reportadas
        } else {
            alert("Error al eliminar la publicación.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

// Función para eliminar un reporte
async function eliminarReporte() {
    try {
        const response = await fetch(`https://udapphosting-001-site1.ktempurl.com/api/Moderador/eliminar-reporte-mod`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idReporte: window.idReporteAEliminar })
        });

        if (response.ok) {
            alert("Reporte eliminado correctamente.");
            cerrarModalEliminarReporte();
            obtenerPublicacionesReportadas(); // Actualizar publicaciones reportadas
        } else {
            alert("Error al eliminar el reporte.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

// Función para descargar reportes en PDF
async function descargarReportes() {
    try {
        const response = await fetch(`https://udapphosting-001-site1.ktempurl.com/api/Reporte/descargar-reporte-publicaciones-reportadas`, {
            method: 'GET'
        });

        if (response.ok) {
            alert("Reportes descargados correctamente.");
            cerrarModalDescargarReportes();
        } else {
            alert("Error al descargar los reportes.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}
