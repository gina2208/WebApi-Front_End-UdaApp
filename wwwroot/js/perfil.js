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
            'Authorization': `Bearer ${token}`,
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
        document.querySelector('.telefono').innerText = data.telefono; // Asegúrate de que este campo exista
        document.querySelector('.direccion').innerText = data.direccion; // Asegúrate de que este campo exista

        // Llenar los campos del formulario de edición
        document.getElementById('idUsuario').value = data.idUsuario;
        document.getElementById('nombreUsuario').value = data.nombre;
        document.getElementById('cedulaUsuario').value = data.cedula;
        document.getElementById('telefonoUsuario').value = data.telefono; // Llenar teléfono
        document.getElementById('direccionUsuario').value = data.direccion; // Llenar dirección
        document.getElementById('correoUsuario').value = data.email;
        // Para la contraseña, puedes mantenerla oculta o limpiarla, según lo que necesites
    } else {
        console.error("No se pudieron obtener los datos del usuario.");
    }
}


// Función para actualizar el perfil del usuario
async function actualizarPerfilUsuario(event) {
    event.preventDefault(); // Evita el envío del formulario

    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Token no disponible. Inicia sesión nuevamente.");
        return;
    }

    // Obtener datos del formulario
    const cedula = document.getElementById("cedulaUsuario").value;
    const nombre = document.getElementById("nombreUsuario").value;
    const apellido = document.getElementById("apellidoUsuario").value;
    const telefono = document.getElementById("telefonoUsuario").value;
    const direccion = document.getElementById("direccionUsuario").value;
    const email = document.getElementById("correoUsuario").value;
    const contrasena = document.getElementById("contrasenaUsuario").value;

    // Obtener idUsuario y idRol del localStorage
    const idUsuario = localStorage.getItem('id'); // Suponiendo que 'id' es la clave para idUsuario
    const idRol = localStorage.getItem('rol'); // Suponiendo que 'rol' es la clave para idRol
    const estadoSuspension = false; // Se establece por defecto en false

    const url = 'https://localhost:44380/api/Usuario/Actualizar-usuario';

    const requestBody = {
        cedula,
        nombre,
        apellido,
        telefono,
        direccion,
        email,
        contrasena,
        idUsuario: parseInt(idUsuario), // Convertir a número entero
        idRol: parseInt(idRol), // Convertir a número entero
        estadoSuspension: estadoSuspension
    };

    const options = {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`, // Aseguramos que el token esté en la cabecera
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch(url, options);

        if (response.ok) {
            alert("Perfil actualizado exitosamente.");
            cerrarVentanaEmergenteEditar(); // Cierra el modal de edición
            cargarPerfilUsuario(); // Recarga el perfil con los datos actualizados
        } else {
            throw new Error(`Error: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        alert("Ocurrió un error al actualizar el perfil. Intente nuevamente.");
    }
}
