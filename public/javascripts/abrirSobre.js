$(document).ready(function() {

    $("#btnAbrirSobre").on('click', function() {
        var numeros = $("#sobre-container").data('numeros');
        var album = $("#sobre-container").data('album');
        var sobre = $("#sobre-container").data('sobre');
        var consultas = [];

        numeros.forEach(function(numero) {
            consultas.push(consultarNombre(numero, album));
        });
        
        Promise.all(consultas)
        .then(function(resultados) {
            var nombresCromos = resultados.map(function(resultado) {
                return resultado.nombre;
            });

            localStorage.setItem('nombresCromos', JSON.stringify(nombresCromos));
            window.location.href = '/animacionSobre/' + sobre;
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
                    resolve({ nombre: response.nombre });
                },
                error: function(error) {
                    console.error("Error al consultar el nombre del cromo:", error);
                    reject();
                }
            });
        });
    }
});