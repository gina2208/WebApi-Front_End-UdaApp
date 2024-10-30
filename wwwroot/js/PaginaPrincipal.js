function mostrarMenu() {
    var menu = document.getElementById("menu");
    if (menu.style.display === "none") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}

function mostrarVentanaEmergentePublicacion() {
    var modal = document.getElementById("modal1");
    modal.style.display = "block";
}
function mostrarVentanaEmergenteReporte() {
    var modal = document.getElementById("modal2");
    modal.style.display = "block";
}
function mostrarVentanaEmergenteComentarios() {
    var modal = document.getElementById("modal3");
    modal.style.display = "block";
}
function mostrarVentanaEmergenteComentariosVisual() {
    var modal = document.getElementById("modal4");
    modal.style.display = "block";
}
function cerrarVentanaEmergentePublicacion() {
    var modal = document.getElementById("modal1");
    modal.style.display = "none";
}

function cerrarVentanaEmergenteReporte() {
    var modal = document.getElementById("modal2");
    modal.style.display = "none";
}
function cerrarVentanaEmergenteComentarios() {
    var modal = document.getElementById("modal3");
    modal.style.display = "none";
}
function cerrarVentanaEmergenteComentariosVisual() {
    var modal = document.getElementById("modal4");
    modal.style.display = "none";
}
function agregarIdUsuario() {
    var idUsuario = document.getElementById("idUsuario").value; // Obtener el valor del ID de usuario
    document.getElementById("idUsuario").value = idUsuario; // Asignar el valor al campo oculto antes de enviar el formulario
}
function reportarPublicacion(idPublicacion) {
    var modal = document.getElementById("modal2");
    modal.style.display = "block";

    // Establecer el valor del campo de ID de publicación
    document.getElementById("idPublicacion").value = idPublicacion;
}
