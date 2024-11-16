// Funci�n para establecer una cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// Funci�n para obtener una cookie
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring((name + '=').length);
        }
    }
    return null;
}

// Funci�n para comprobar si la cookie existe
function cookieExists(name) {
    return getCookie(name) !== null;
}
const botonAceptarCookies = document.getElementById('btn-aceptar-cookies');
const avisoCookies = document.getElementById('aviso-cookies');
const fondoAvisoCookies = document.getElementById('fondo-aviso-cookies');

dataLayer = [];

// Verifica si la cookie ya existe
if (!cookieExists('cookies-aceptadas')) {
    avisoCookies.classList.add('activo');
    fondoAvisoCookies.classList.add('activo');
} else {
    dataLayer.push({ 'event': 'cookies-aceptadas' });
}

// Maneja el clic en el bot�n de aceptar cookies
botonAceptarCookies.addEventListener('click', () => {
    avisoCookies.classList.remove('activo');
    fondoAvisoCookies.classList.remove('activo');

    // Guarda la cookie con una duraci�n de 365 d�as
    setCookie('cookies-aceptadas', 'true', 365);

    dataLayer.push({ 'event': 'cookies-aceptadas' });
});
