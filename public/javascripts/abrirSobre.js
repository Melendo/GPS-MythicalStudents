$(document).ready(function() {

    $("#btnAbrirSobre").on('click', function() {
        var numeros = $("#sobre-container").data('numeros');
        var album = $("#sobre-container").data('album');
        numeros.forEach(function(numero) {
            consultarNombre(numero, album);
        });
        window.location.href = '/tienda';
    });

    function consultarNombre(numero, album) {
        $.ajax({
            url: '/abrirSobre/' + album + '/' + numero,
            type: 'GET',
            success: function(response) {
                alert("¡Felicidades! Has obtenido el cromo '" + response.nombre + "'");
            },
            error: function(error) {
                console.error("Error al consultar el nombre del cromo:", error);
            }
        });
    }

});