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
