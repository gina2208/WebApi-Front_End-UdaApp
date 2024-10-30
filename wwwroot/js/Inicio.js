document.querySelector('form').addEventListener('submit', iniciarSesion);

async function iniciarSesion(event) {
    event.preventDefault();

    // Limpiar mensajes de error previos
    clearErrorMessages();

    const email = document.getElementById("Email").value;
    const contrasena = document.getElementById("Contrasena").value;

    const data = {
        Email: email,
        Contrasena: contrasena
    };

    // Mostrar el estado de carga
    showLoadingState(true);

    try {
        // Realiza la solicitud a la API
        const response = await fetch('https://localhost:44380/api/Usuario/Login', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || "Error en la solicitud");
        }

        const responseData = await response.json();

        // Verificar si la respuesta indica éxito
        if (responseData.exito) {
            // Guardar el rol y token en el localStorage
            localStorage.setItem('id', responseData.usuario.id); // Guardar rol como int
            localStorage.setItem('token', responseData.token); // Guardar token como Bearer token

            // Redirigir al usuario a la página principal
            window.location.href = '/Home/PaginaPrincipal';
        } else {
            document.getElementById("EmailError").innerText = responseData.mensaje;
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        document.getElementById("EmailError").innerText = "Error al iniciar sesión. Intenta de nuevo.";
    } finally {
        // Ocultar el estado de carga
        showLoadingState(false);
    }
}

// Función para mostrar u ocultar el mensaje de carga
function showLoadingState(isLoading) {
    const loadingElement = document.getElementById('loading');
    const submitButton = document.querySelector('.ingresar');

    if (loadingElement) {
        loadingElement.style.display = isLoading ? 'block' : 'none';
    }

    if (submitButton) {
        submitButton.disabled = isLoading;
    }
}

// Función para limpiar mensajes de error
function clearErrorMessages() {
    document.getElementById("EmailError").innerText = "";
    document.getElementById("ContrasenaError").innerText = "";
}

// Función para mostrar mensajes de error
function displayErrorMessages(errors) {
    if (errors) {
        for (const error of errors) {
            const errorElement = document.getElementById(`${error.campo}Error`);
            if (errorElement) {
                errorElement.textContent = error.mensaje;
            }
        }
    } else {
        alert('Ocurrió un error en la validación.');
    }
}

// Función de validación de formulario
function validateForm(data) {
    const errors = [];

    // Validar que los campos no estén vacíos
    if (!data.Cedula) errors.push({ campo: 'Cedula', mensaje: 'La cédula es obligatoria.' });
    if (!data.Nombre) errors.push({ campo: 'Nombre', mensaje: 'El nombre es obligatorio.' });
    if (!data.Apellido) errors.push({ campo: 'Apellido', mensaje: 'El apellido es obligatorio.' });
    if (!data.Telefono) errors.push({ campo: 'Telefono', mensaje: 'El teléfono es obligatorio.' });
    if (!data.Direccion) errors.push({ campo: 'Direccion', mensaje: 'La dirección es obligatoria.' });
    if (!data.Email) errors.push({ campo: 'Email', mensaje: 'El email es obligatorio.' });
    if (!data.Contrasena) errors.push({ campo: 'Contrasena', mensaje: 'La contraseña es obligatoria.' });

    // Validaciones adicionales
    if (!EsNumero(data.Cedula)) errors.push({ campo: 'Cedula', mensaje: 'La cédula debe contener solo números.' });
    if (!EsTextoValido(data.Nombre)) errors.push({ campo: 'Nombre', mensaje: 'El nombre no debe contener números ni caracteres especiales.' });
    if (!EsTextoValido(data.Apellido)) errors.push({ campo: 'Apellido', mensaje: 'El apellido no debe contener números ni caracteres especiales.' });
    if (!EsNumero(data.Telefono)) errors.push({ campo: 'Telefono', mensaje: 'El teléfono debe contener solo números.' });
    if (!data.Email.endsWith('@ucundinamarca.edu.co')) errors.push({ campo: 'Email', mensaje: 'El email debe contener "@ucundinamarca.edu.co".' });
    if (data.Contrasena.length < 8) errors.push({ campo: 'Contrasena', mensaje: 'La contraseña debe tener al menos 8 caracteres.' });

    return errors;
}

// Funciones auxiliares para validaciones
function EsNumero(value) {
    return /^[0-9]+$/.test(value);
}

function EsTextoValido(value) {
    return /^[a-zA-Z\s]+$/.test(value); // Permite letras y espacios
}

// Función authorize para incluir el token en las solicitudes que lo requieran
async function authorize(url, options = {}) {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error("Token de autenticación no disponible. Inicia sesión nuevamente.");
    }

    // Añadir el encabezado Authorization con el Bearer token
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // Realizar la solicitud con el token
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error("Error en la solicitud autorizada");
    }

    return await response.json();
}
