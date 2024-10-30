// Función para mostrar la ventana emergente de edición
function mostrarVentanaEmergenteEditar() {
    const modal = document.getElementById("modal1");
    modal.style.display = "block";
}

// Función para mostrar la ventana emergente de eliminación
function mostrarVentanaEmergenteEliminar() {
    const modal = document.getElementById("modal2");
    modal.style.display = "block";
}

// Función para cerrar la ventana emergente de edición
function cerrarVentanaEmergenteEditar() {
    const modal = document.getElementById("modal1");
    modal.style.display = "none";
}

// Función para cerrar la ventana emergente de eliminación
function cerrarVentanaEmergenteEliminar() {
    const modal = document.getElementById("modal2");
    modal.style.display = "none";
}

// Función para realizar una solicitud a la API con autorización
async function fetchApiData(url) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Token no disponible. Inicia sesión nuevamente.");
        return;
    }

    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Corregido para añadir Bearer token
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Función para cargar los datos del perfil del usuario en el HTML
async function cargarPerfilUsuario() {
    const url = 'https://localhost:44380/api/Usuario/Obtener-usuario-token';
    const data = await fetchApiData(url);

    if (data) {
        // Asigna los datos a los elementos correspondientes en el HTML
        document.querySelector('.cedula').innerText = data.cedula;
        document.querySelector('.correo').innerText = data.email;
        document.querySelector('.nombre').innerText = `${data.nombre} ${data.apellido}`;
        document.getElementById('idUsuario').value = data.idUsuario;
        document.getElementById('nombreUsuario').value = data.nombre;
        document.getElementById('cedulaUsuario').value = data.cedula;
        document.getElementById('correoUsuario').value = data.email;
    } else {
        console.error("No se pudieron obtener los datos del usuario.");
    }
}
