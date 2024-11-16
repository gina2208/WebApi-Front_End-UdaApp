// Funciones para manejar cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // Retorna null si la cookie no existe
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

// Función para mostrar el modal
function mostrarVentanaEmergente(tipoReporte) {
    const modal = document.getElementById("modal");
    const reportDescription = document.getElementById("report-description");

    // Establecer el mensaje según el tipo de reporte
    switch (tipoReporte) {
        case 'reportadas':
            reportDescription.textContent = '¿Desea proceder con el reporte de publicaciones reportadas?';
            break;
        case 'populares':
            reportDescription.textContent = '¿Desea proceder con el reporte de publicaciones más populares?';
            break;
        case 'usuarios':
            reportDescription.textContent = '¿Desea proceder con el reporte de usuarios registrados?';
            break;
        default:
            reportDescription.textContent = '¿Desea proceder con esta acción?';
    }

    // Guardar el tipo de reporte en el modal
    modal.dataset.tipoReporte = tipoReporte;

    // Mostrar el modal
    modal.style.display = "block";
}

// Función para cerrar el modal
function cerrarVentanaEmergente() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// Función para confirmar y realizar la descarga del reporte
async function confirmarDescarga() {
    const tipoReporte = document.getElementById("modal").dataset.tipoReporte;
    await descargarReporte(tipoReporte);
    cerrarVentanaEmergente();
}

// Función para confirmar y realizar el envío por correo
async function confirmarEnvioCorreo() {
    const tipoReporte = document.getElementById("modal").dataset.tipoReporte;
    await enviarReportePorCorreo(tipoReporte);
    cerrarVentanaEmergente();
}

// Función para descargar el reporte
async function descargarReporte(tipoReporte) {
    console.log('Tipo de reporte recibido para descargar:', tipoReporte);

    const idUsuario = getCookie('id'); // Obtén el ID del usuario desde cookies
    const token = getCookie('token'); // Obtén el token desde cookies

    // Verificar si el ID y el token existen
    if (!idUsuario || !token) {
        alert('ID de usuario o token no encontrados. Inicie sesión nuevamente.');
        return;
    }

    let url;
    switch (tipoReporte) {
        case 'reportadas':
            url = `https://udapphosting-001-site1.ktempurl.com/api/Reporte/descargar-reporte-publicaciones-reportadas?idUsuario=${idUsuario}`;
            break;
        case 'populares':
            url = `https://udapphosting-001-site1.ktempurl.com/api/Reporte/descargar-reporte-publicaciones-populares?idUsuario=${idUsuario}`;
            break;
        case 'usuarios':
            url = `https://udapphosting-001-site1.ktempurl.com/api/Reporte/descargar-reporte-usuarios?idUsuario=${idUsuario}`;
            break;
        default:
            console.error('Tipo de reporte no válido.');
            return;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${tipoReporte}-reporte.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error('Error al descargar el reporte:', response.statusText);
            alert('Hubo un problema al descargar el reporte.');
        }
    } catch (error) {
        console.error('Error en la descarga del reporte:', error);
        alert('Error en la descarga del reporte.');
    }
}

// Función para enviar el reporte por correo
async function enviarReportePorCorreo(tipoReporte) {
    console.log('Tipo de reporte recibido para enviar:', tipoReporte); // Debug log

    const idUsuario = getCookie('id'); // Obtén el ID del usuario desde cookies
    const token = getCookie('token'); // Obtén el token desde cookies

    // Verificar si el ID y el token existen
    if (!idUsuario || !token) {
        alert('ID de usuario o token no encontrados. Inicie sesión nuevamente.');
        return;
    }

    let url;
    switch (tipoReporte) {
        case 'reportadas':
            url = `https://udapphosting-001-site1.ktempurl.com/api/Reporte/enviar-reporte-reportadas?idUsuario=${idUsuario}`;
            break;
        case 'populares':
            url = `https://udapphosting-001-site1.ktempurl.com/api/Reporte/enviar-reporte-likeadas?idUsuario=${idUsuario}`;
            break;
        case 'usuarios':
            url = `https://udapphosting-001-site1.ktempurl.com/api/Reporte/enviar-reporte-usuarios?idUsuario=${idUsuario}`;
            break;
        default:
            console.error('Tipo de reporte no válido.');
            return;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log('Reporte enviado exitosamente.');
            alert('Reporte enviado por correo.');
        } else {
            console.error('Error al enviar el reporte:', response.statusText);
            alert('Hubo un problema al enviar el reporte.');
        }
    } catch (error) {
        console.error('Error al enviar el reporte:', error);
        alert('Error al enviar el reporte.');
    }
}
