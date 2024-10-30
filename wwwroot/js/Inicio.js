
async function iniciarSesion(event) {
    event.preventDefault(); 


    const email = document.getElementById("Email").value;
    const contrasena = document.getElementById("Contrasena").value;

 
    const data = {
        Email: email,
        Contrasena: contrasena
    };

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

        
        if (responseData.exito) {
            
            window.location.href = '@Url.Action("PaginaPrincipal", "Home")';


        } else {
         
            document.getElementById("EmailError").innerText = responseData.mensaje;
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        document.getElementById("EmailError").innerText = "Error al iniciar sesión. Intenta de nuevo.";
    }
}