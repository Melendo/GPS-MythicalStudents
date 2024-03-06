$(document).ready(function() {

    $("#formularioCrearColeccion").submit(function(event) {
        event.preventDefault();
        var nombre = $('#nombreColeccion').val();
        var descripcion = $('#descripcionColeccion').val();
        var imagen = $('#imagenColeccion')[0].files[0];
        var categorias = $('#categoriasColeccion').val();
        categorias = categorias.join(','); // Convertir a cadena separada por comas
        validarFormCrearColeccion(nombre, descripcion, imagen, categorias);
    })

    function validarFormCrearColeccion(nombre, descripcion, imagen, categorias) {
        if (consultarNombreColeccion(nombre)) {
            insertarColeccion(nombre, descripcion, imagen, categorias);
        }
        else {
            alert("El nombre de la colección ya existe en la base de datos");
        }
    }
    
    function consultarNombreColeccion(nombre) {
        $.ajax({
            url: "/crearColeccion/consultarNombre",
            type: "GET",
            data: { nombre: nombre },
            success: function(existe) {
                if (existe) {
                    return false;
                }
                else {
                    return true;
                }
            },
            error: function(error) {
                console.error("Error al hacer get:", error);
                alert("Error al realizar la consulta: PETICION DE NOMBRE", error);
                return false;
            }
        });
    }
    
    function insertarColeccion(nombre, descripcion, imagen, categorias) {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('imagen', imagen);
        formData.append('categorias', categorias);
        
        $.ajax({
            type: 'POST',
            url: '/crearColeccion/insertarColeccion',
            processData: false,
            contentType: false,
            data: formData,
            success: function(insertado) {
                alert('¡Colección creada con éxito!');
            },
            error: function(error) {
                console.error("Error al insertar la colección:", error);
                alert('Ha ocurrido un error al crear la colección.\n');
            }
        });
    }
});
