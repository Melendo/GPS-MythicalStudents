$(document).ready(function() {

    $("#formularioCrearColeccion").submit(function(event) {
        event.preventDefault();
        nombre = $('#nombreColección').val();
        descripcion = $('#descripcionColección').val();
        imagen = $('#imagenColección').val();
        categorias = $('#categoriasColección').val();
        
        validarFormCrearColeccion(nombre, descripcion, imagen, categorias);
    })

    function validarFormCrearColeccion(nombre, descripcion, imagen, categorias) {
        if (consultarNombreColeccion(nombre)) {
            return false;
        } 
        else {
            insertarColeccion(nombre, descripcion, imagen, categorias);
            return true;
        }
    }
    
    function consultarNombreColeccion(nombre) {
        // Realizar la solicitud AJAX al router     
        $.ajax({
            url: "/crearColeccion/consultarNombre",
            type: "GET",
            data: nombre,
            success: function (existe) {
                if (existe) {
                    //alert("Existe en la base de datos, se siente")
                    return true;
                }
                else {
                    //alert("No existe en la base de datos")
                    return false;
                }
            },
            error: function (error) {
                console.log(nombre);
                alert("Error al realizar la consulta: PETICION DE NOMBRE", error);
                return false;
            }
        });
    }
    
    function insertarColeccion(nombre, descripcion, imagen, categorias) {
        // Obtiene los datos del formulario
        var formData = {
            nombre, descripcion, imagen, categorias
        };
        
        // Envía la solicitud AJAX al servidor
        $.ajax({
            type: 'POST',
            url: '/crearColeccion/insertarColeccion', // Ajusta la URL según tu servidor
            data: formData,
            success: function (insertado) {
                
                // Maneja la respuesta del servidor (si es necesario)
                alert('¡Coleccion Creada con Exito!');
            },
            error: function (error) {
                // Maneja cualquier error que ocurra durante la solicitud AJAX
                console.error(error);
                alert('Ha ocurrido un error al crear la coleccion.\n');
            }
        });
    }
})

