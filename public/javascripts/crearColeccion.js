
function validarFormCrearColeccion() {
    var nombre = $("#nombreColección").val();
    if (!consultarNombreColeccion(nombre)) 
        return false;
    else {
        insertarColeccion();
        return true;
    }
}

function consultarNombreColeccion(nombre) {
    // Realizar la solicitud AJAX al router     
    $.ajax({
        url: "/crearColeccion/consultarNombre?",
        type: "GET",
        success: function (reservas) {
            if (reservas.length > 0) {
                alert("Ya existe una coleccion con ese nombre");
                return false;
            }
            else
                return true;
        },
        error: function (error) {
            alert("Error al realizar la consulta: PETICION DE NOMBRE", error);
            return false;
        }
    });
}

function insertarColeccion() {
    // Obtiene los datos del formulario
    var formData = {
        nombre: $('#nombreColección').val(),
        imagen: $('#imagenColección').val(),
        descripcion: $('#descripcionColección').val(),
        categorias: $('#categoriasColección').val()
    };

    // Envía la solicitud AJAX al servidor
    $.ajax({
        type: 'POST',
        url: '/crearColeccion/insertarColeccion', // Ajusta la URL según tu servidor
        data: formData,
        success: function (response) {
            // Maneja la respuesta del servidor (si es necesario)
            alert('¡Coleccion Creada con Exito!');
        },
        error: function (xhr, status, error) {
            // Maneja cualquier error que ocurra durante la solicitud AJAX
            console.error(error);
            alert('Ha ocurrido un error al crear la coleccion.\n');
        }
    });
}
