
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

    if (!usuarioId || !rolSeleccionado) {
        alert("Debe seleccionar un usuario y un rol.");
        return;
    }

    try {
        const response = await fetch(`https://localhost:44380/api/admin/usuarios/${usuarioId}/cambiar-rol`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({ rol: rolSeleccionado })
        });

        if (response.ok) {
            alert("Rol asignado correctamente.");
            cerrarRoleModal();
            cargarUsuarios(); // Recargar la lista de usuarios después de asignar el rol
        } else {
            alert("Error al asignar el rol.");
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
        const response = await fetch(`https://localhost:44380/api/admin/usuarios/${usuarioId}/cambiar-estado-suspension`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            alert("Usuario suspendido correctamente.");
            cerrarSuspendModal();
            cargarUsuarios(); // Recargar la lista de usuarios después de suspender
        } else {
            alert("Error al suspender al usuario.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error al procesar la solicitud.");
    }
}

// Función para cargar la lista de usuarios
async function cargarUsuarios() {
    try {
        const response = await fetch('https://localhost:44380/api/admin/usuarios', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });

        if (response.ok) {
            const usuarios = await response.json();
            mostrarUsuarios(usuarios);
        } else {
            alert("Error al cargar los usuarios.");
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
        const fila = document.createElement("tr");
        fila.dataset.usuarioId = usuario.id;
        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.rol}</td>
            <td>
                <button onclick="abrirRoleModal(${usuario.id})">Asignar Rol</button>
                <button class="suspend" onclick="abrirSuspendModal(${usuario.id})">Suspender</button>
            </td>
        `;
        fila.onclick = function () {
            document.querySelectorAll(".user-list tr").forEach(row => row.classList.remove("selected"));
            fila.classList.add("selected");
        };
        tablaUsuarios.appendChild(fila);
    });
}

// Llamar a cargarUsuarios cuando la página se cargue
document.addEventListener("DOMContentLoaded", cargarUsuarios);
