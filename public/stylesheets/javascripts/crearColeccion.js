$(document).ready(function () {

    function validarFormCrearColeccion() {

        var nombre = $("#nombreColección").val();
        if (!consultarNombreColeccion(nombre)) {
            return false;
        }
        return true;
    }

    function consultarNombreColeccion(nombre) {
        // Realizar la solicitud AJAX al backend
        var queryString = $.param(nombre);

        $.ajax({
            url: "/crearColeccion/consultarNombre?" + queryString,
            type: "GET",
            data: nombre,
            success: function (reservas) {
                if (reservas.length > 0)
                    return false;
                else
                    return true;
            },
            error: function (error) {
                console.error("Error al realizar la consulta:", error);
            }
        });
    }

    $('#formularioCrearColeccion').submit(function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de manera convencional

        // Obtiene los datos del formulario
        var formData = {
            nombre: $('#nombre').val(),
            imagen: $('#imagen').val(),
            descripcion: $('#descripcion').val(),

        };

        // Envía la solicitud AJAX al servidor
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/insertarColeccion', // Ajusta la URL según tu servidor
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
});