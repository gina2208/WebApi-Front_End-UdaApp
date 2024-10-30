document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevenir el envío del formulario tradicional

    // Limpiar mensajes de error previos
    clearErrorMessages();

    const data = {
        Cedula: document.getElementById('Cedula').value.trim(),
        Nombre: document.getElementById('Nombre').value.trim(),
        Apellido: document.getElementById('Apellido').value.trim(),
        Telefono: document.getElementById('Telefono').value.trim(),
        Direccion: document.getElementById('Direccion').value.trim(),
        Email: document.getElementById('Email').value.trim(),
        Contrasena: document.getElementById('Contrasena').value.trim()
    };

    // Validar los campos antes de enviar
    const errores = validateForm(data);
    if (errores.length > 0) {
        // Mostrar errores si existen
        displayErrorMessages(errores);
        return; // No enviar el formulario si hay errores
    }

    // Mostrar el mensaje de carga y deshabilitar el botón de enviar
    showLoadingState(true);

    try {
        const response = await fetch('https://localhost:44380/api/Usuario/Registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Redirigir en caso de éxito
            alert(result.Mensaje || "Registro exitoso");
            window.location.href = '/Home/Inicio';
        } else {
            // Mostrar error general si la respuesta no es exitosa
            displayErrorMessages([{ campo: 'General', mensaje: result.Mensaje || "Error en el registro." }]);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Ocurrió un error durante el registro. Intente de nuevo más tarde.');
    } finally {
        // Ocultar el mensaje de carga y habilitar el botón de enviar
        showLoadingState(false);
    }
});

// Función para mostrar u ocultar el mensaje de carga
function showLoadingState(isLoading) {
    const loadingElement = document.getElementById('loading');
    const submitButton = document.querySelector('.registrarse');

    if (isLoading) {
        loadingElement.style.display = 'block'; // Mostrar el mensaje de carga
        submitButton.disabled = true; // Desactivar el botón
    } else {
        loadingElement.style.display = 'none'; // Ocultar el mensaje de carga
        submitButton.disabled = false; // Reactivar el botón
    }
}

// Función para limpiar mensajes de error
function clearErrorMessages() {
    document.querySelectorAll('.text-danger').forEach(elem => elem.textContent = '');
}

// Función para mostrar mensajes de error
function displayErrorMessages(errors) {
    for (const error of errors) {
        const errorElement = document.getElementById(`${error.campo}Error`);
        if (errorElement) {
            errorElement.textContent = error.mensaje;
        }
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
