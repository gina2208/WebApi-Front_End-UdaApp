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

// Función para mostrar el modal
function mostrarVentanaEmergente(tipoReporte) {
    const modal = document.getElementById("modal");
    const reportDescription = document.getElementById("report-description");

    switch (tipoReporte) {
        case 'reportadas':
            reportDescription.textContent = '¿Desea descargar y enviar por correo el reporte de publicaciones reportadas?';
            break;
        case 'populares':
            reportDescription.textContent = '¿Desea descargar y enviar por correo el reporte de publicaciones con más likes?';
            break;
        case 'usuarios':
            reportDescription.textContent = '¿Desea descargar y enviar por correo el reporte de usuarios registrados?';
            break;
        default:
            reportDescription.textContent = '¿Desea descargar el reporte?';
    }

    // Guardar el tipo de reporte para la acción posterior
    modal.dataset.tipoReporte = tipoReporte;
    modal.style.display = "block";
}

// Función para cerrar el modal
function cerrarVentanaEmergente() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// Función para descargar el reporte
async function descargarReporte(tipoReporte) {
    const idUsuario = getCookie('id');  // Obtener ID de usuario desde cookies
    const token = getCookie('token');  // Obtener token desde cookies

    if (!idUsuario || !token) {
        alert('ID de usuario o token no encontrados. Inicie sesión nuevamente.');
        return;
    }

    let url;
    switch (tipoReporte) {
        case 'reportadas':
            url = `https://webapiudapp.somee.com/api/Reporte/descargar-reporte-publicaciones-reportadas?idUsuario=${idUsuario}`;
            break;
        case 'populares':
            url = `https://webapiudapp.somee.com/api/Reporte/descargar-reporte-publicaciones-populares?idUsuario=${idUsuario}`;
            break;
        case 'usuarios':
            url = `https://webapiudapp.somee.com/api/Reporte/descargar-reporte-usuarios?idUsuario=${idUsuario}`;
            break;
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
            link.click();
        } else {
            console.error('Error al descargar el reporte:', response.statusText);
        }
    } catch (error) {
        console.error('Error en la descarga del reporte:', error);
    }
}

// Función para enviar el reporte por correo
async function enviarReportePorCorreo(tipoReporte) {
    const idUsuario = getCookie('id');  // Obtener ID de usuario desde cookies
    const token = getCookie('token');  // Obtener token desde cookies

    if (!idUsuario || !token) {
        alert('ID de usuario o token no encontrados. Inicie sesión nuevamente.');
        return;
    }

    let url;
    switch (tipoReporte) {
        case 'reportadas':
            url = `https://webapiudapp.somee.com/api/Reporte/enviar-reporte-reportadas?idUsuario=${idUsuario}`;
            break;
        case 'populares':
            url = `https://webapiudapp.somee.com/api/Reporte/enviar-reporte-likeadas?idUsuario=${idUsuario}`;
            break;
        case 'usuarios':
            url = `https://webapiudapp.somee.com/api/Reporte/enviar-reporte-usuarios?idUsuario=${idUsuario}`;
            break;
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
        }
    } catch (error) {
        console.error('Error al enviar el reporte:', error);
    }
}

// Función para manejar la acción en el modal
async function confirmarAccion() {
    const tipoReporte = document.getElementById("modal").dataset.tipoReporte;
    await descargarReporte(tipoReporte);
    await enviarReportePorCorreo(tipoReporte);
    cerrarVentanaEmergente();
}

// Asignar evento al botón de descarga y envío en el modal
document.querySelector('.desca').addEventListener('click', confirmarAccion);
