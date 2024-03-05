
function validarFormCrearColeccion() {

    var nombre = $("#nombreColección").val();
    if (!consultarNombreColeccion(nombre)) {
        return false;
    }
    return true;
}





function consultarNombreColeccion(nombre) {
    // Realizar la solicitud AJAX al backend    
    $.ajax({
        url: "/crearColeccion/consultarNombre?nombre=" + nombre,
        type: "GET",
        success: function (reservas) {
            if (reservas.length > 0)
                return false;
            else
                return true;
        },
        error: function (error) {
            console.error("Error al realizar la consulta: PETICION DE NOMBRE", error);
        }
    });
}

$('#formularioCrearColeccion').submit(function (event) {

    event.preventDefault(); // Evita que el formulario se envíe de manera convencional

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
            alert('Ha ocurrido un error al crear la coleccion.\n' + error);
        }
    });
});
