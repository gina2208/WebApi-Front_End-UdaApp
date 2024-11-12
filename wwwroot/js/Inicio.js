document.querySelector('form').addEventListener('submit', iniciarSesion);

async function iniciarSesion(event) {
    event.preventDefault();

    clearErrorMessages();

    const email = document.getElementById("Email").value;
    const contrasena = document.getElementById("Contrasena").value;

    const data = {
        Email: email,
        Contrasena: contrasena
    };

    showLoadingState(true);

    try {
        const response = await fetch('https://localhost:44380/api/Usuario/Login', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || "Error en la solicitud");
        }

        const responseData = await response.json();

        if (responseData.exito) {
            setCookie('id', responseData.usuario.id);
            setCookie('token', responseData.token);
            console.info(getCookie("AuthToken"));
            window.location.href = '/Home/PaginaPrincipal';
        } else {
            document.getElementById("EmailError").innerText = responseData.mensaje;
        }
    } catch (error) {
        debug.error("Error en la solicitud:", error);
        document.getElementById("EmailError").innerText = "Error al iniciar sesión. Intenta de nuevo.";
    } finally {
        showLoadingState(false);
    }
}

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

function clearErrorMessages() {
    document.getElementById("EmailError").innerText = "";
    document.getElementById("ContrasenaError").innerText = "";
}

// Funciones para manipular cookies
function setCookie(name, value, days = 1) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function eraseCookie(name) {
    document.cookie = `${name}=; Max-Age=-99999999; path=/`;
}

async function authorize(url, options = {}) {
    const token = getCookie('token');

    if (!token) {
        throw new Error("Token de autenticación no disponible. Inicia sesión nuevamente.");
    }

    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error("Error en la solicitud autorizada");
    }

    return await response.json();
}
