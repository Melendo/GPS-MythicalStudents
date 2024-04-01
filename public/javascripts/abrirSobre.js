$(document).ready(function() {

    $("#btnAbrirSobre").on('click', function() {
        var numeros = $("#sobre-container").data('numeros');
        var album = $("#sobre-container").data('album');
        var consultas = [];

        numeros.forEach(function(numero) {
            consultas.push(consultarNombre(numero, album));
        });
        
        Promise.all(consultas)
            .then(function() {
                window.location.href = '/tienda';
            })
            .catch(function(error) {
                console.error("Error al abrir el sobre:", error);
            });

    });

    function consultarNombre(numero, album) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: '/abrirSobre/' + album + '/' + numero,
                type: 'GET',
                success: function(response) {
                    alert("¡Felicidades! Has obtenido el cromo '" + response.nombre + "'");
                    resolve();
                },
                error: function(error) {
                    console.error("Error al consultar el nombre del cromo:", error);
                    reject();
                }
            });
        });
    }
});