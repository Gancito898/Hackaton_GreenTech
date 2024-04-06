function hacerPeticion(url) {
    // Ejemplo de uso
const direccionIP = '192.168.137.252'; // Dirección IP a la que quieres hacer la petición
const url = `http://${direccionIP}/datos`; // Construir la URL completa
hacerPeticion(url);
    fetch(url)
        .then(response => {
            // Verificar si la solicitud fue exitosa (código de estado 200)
            if (response.ok) {
                // Leer la respuesta como texto
                return response.text();
            } else {
                console.log("La solicitud no fue exitosa. Código de estado:", response.status);
            }
        })
        .then(data => {
            // Imprimir los datos recibidos
            console.log(data);
        })
        .catch(error => {
            console.error("Error al hacer la solicitud:", error);
        });
}


