$(document).ready(function() {

    $("#formularioCrearColeccion").submit(function(event) {
        event.preventDefault();
        var nombre = $('#nombreColección').val();
        var descripcion = $('#descripcionColección').val();
        var imagen = $('#imagenColección').val();
        var categorias = $('#categoriasColección').val();
        
        validarFormCrearColeccion(nombre, descripcion, imagen, categorias);
    })

    function validarFormCrearColeccion(nombre, descripcion, imagen, categorias) {
        consultarNombreColeccion(nombre)
            .then(function(existe) {
                if (!existe) {
                    insertarColeccion(nombre, descripcion, imagen, categorias);
                } else {
                    alert("El nombre de la colección ya existe en la base de datos");
                    // Aquí puedes mostrar algún mensaje de error al usuario si lo deseas
                }
            })
            .catch(function(error) {
                console.error("Error al validar el formulario:", error);
                // Aquí puedes manejar el error de la manera que desees
            });
    }
    
    function consultarNombreColeccion(nombre) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: "/crearColeccion/consultarNombre",
                type: "GET",
                data: { nombre: nombre }, // Debes enviar los datos en un objeto
                success: function(existe) {
                    resolve(existe);
                },
                error: function(error) {
                    reject(error);
                }
            });
        });
    }
    
    function insertarColeccion(nombre, descripcion, imagen, categorias) {
        var formData = {
            nombre: nombre,
            descripcion: descripcion,
            imagen: imagen,
            categorias: categorias
        };
        
        $.ajax({
            type: 'POST',
            url: '/crearColeccion/insertarColeccion',
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
