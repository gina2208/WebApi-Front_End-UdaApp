
// Función para abrir el modal de asignar rol
function abrirRoleModal(usuarioId) {
    // Establecer el ID del usuario seleccionado en un campo oculto o una variable global
    document.getElementById("roleModal").dataset.usuarioId = usuarioId;
    document.getElementById("roleModal").style.display = "block";
}

// Función para cerrar el modal de asignar rol
function cerrarRoleModal() {
    document.getElementById("roleModal").style.display = "none";
}

// Función para abrir el modal de suspender usuario
function abrirSuspendModal(usuarioId) {
    // Establecer el ID del usuario seleccionado en un campo oculto o una variable global
    document.getElementById("suspendModal").dataset.usuarioId = usuarioId;
    document.getElementById("suspendModal").style.display = "block";
}

// Función para cerrar el modal de suspender usuario
function cerrarSuspendModal() {
    document.getElementById("suspendModal").style.display = "none";
}

// Función para asignar rol a un usuario
async function asignarRol() {
    const usuarioId = document.getElementById("roleModal").dataset.usuarioId;
    const rolSeleccionado = document.getElementById("rolSelect").value;

    if (!usuarioId) {
        alert("Debe seleccionar un usuario.");
        return;
    }
    if (!rolSeleccionado) {
        alert("Debe seleccionar un rol.");
        return;
    }

    try {
        const response = await fetch(`https://udapphosting-001-site1.ktempurl.com/api/admin/usuarios/${encodeURIComponent(usuarioId)}/cambiar-rol`, {
            method: 'PUT', // Método PUT
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(rolSeleccionado) // Enviar solo el string 'rolSeleccionado'
        });

        const data = await response.json();
        if (response.ok && data.exito) {
            alert(data.mensaje || "Rol asignado correctamente.");
            cerrarRoleModal();
            cargarUsuarios();
        } else {
            alert("Error al asignar el rol: " + (data.mensaje || "Operación fallida"));
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error al procesar la solicitud.");
    }
}

// Función para confirmar la suspensión de un usuario
async function confirmarSuspension() {
    const usuarioId = document.getElementById("suspendModal").dataset.usuarioId;

    if (!usuarioId) {
        alert("Debe seleccionar un usuario para suspender.");
        return;
    }

    try {
        const response = await fetch(`https://udapphosting-001-site1.ktempurl.com/api/admin/usuarios/${encodeURIComponent(usuarioId)}/cambiar-estado-suspension`, {
            method: 'PUT', // Método PUT
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        if (response.ok && data.exito) {
            alert(data.mensaje || "Usuario suspendido correctamente.");
            cerrarSuspendModal();
            cargarUsuarios(); // Recargar la lista de usuarios después de suspender
        } else {
            alert("Error al suspender al usuario: " + (data.mensaje || "Operación fallida"));
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error al procesar la solicitud.");
    }
}

// Función para cargar la lista de usuarios
async function cargarUsuarios() {
    try {
        const response = await fetch('https://udapphosting-001-site1.ktempurl.com/api/admin/usuarios', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Datos recibidos de la API:", data);

            // Verifica que data.usuarios sea un array antes de llamarlo en mostrarUsuarios
            if (data.exito && Array.isArray(data.usuarios)) {
                mostrarUsuarios(data.usuarios);
            } else {
                alert("Error al cargar los usuarios: " + (data.mensaje || "Formato de datos incorrecto"));
            }
        } else {
            alert("Error al cargar los usuarios: Código de estado " + response.status);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error al procesar la solicitud.");
    }
}

// Función para mostrar los usuarios en la tabla
function mostrarUsuarios(usuarios) {
    const tablaUsuarios = document.getElementById("userTable");
    tablaUsuarios.innerHTML = "";

    usuarios.forEach(usuario => {
        // Filtrar solo usuarios activos (no suspendidos)
        if (!usuario.estadoSuspension) {
            const fila = document.createElement("tr");
            fila.dataset.usuarioId = usuario.idUsuario;
            fila.innerHTML = `
                <td>${usuario.idUsuario}</td>
                <td>${usuario.nombreUsuario}</td>
                <td>${usuario.email}</td>
                <td>${usuario.nombreRol}</td>
                <td>
                    <button onclick="abrirRoleModal(${usuario.idUsuario})">Asignar Rol</button>
                    <button class="suspend" onclick="abrirSuspendModal(${usuario.idUsuario})">Suspender</button>
                </td>
            `;
            fila.onclick = function () {
                document.querySelectorAll(".user-list tr").forEach(row => row.classList.remove("selected"));
                fila.classList.add("selected");
            };
            tablaUsuarios.appendChild(fila);
        }
    });
}

// Llamar a cargarUsuarios cuando la página se cargue
document.addEventListener("DOMContentLoaded", cargarUsuarios);
