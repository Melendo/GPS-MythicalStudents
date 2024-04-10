$(document).ready(function() {

    $("#btnAbrirSobre").on('click', function() {
        var numeros = $("#sobre-container").data('numeros');
        var album = $("#sobre-container").data('album');
        var sobre = $("#sobre-container").data('sobre');
        var consultas = [];

        numeros.forEach(function(numero) {
            consultas.push(consultarID(numero, album));
        });
        
        Promise.all(consultas)
        .then(function(resultados) {
            var idCromos = resultados.map(function(resultado) {
                return resultado.id;
            });

            localStorage.setItem('idCromos', JSON.stringify(idCromos));
            window.location.href = '/animacionSobre/' + sobre;
        })
        .catch(function(error) {
            console.error("Error al abrir el sobre:", error);
        });

    });

    function consultarID(numero, album) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: '/abrirSobre/' + album + '/' + numero,
                type: 'GET',
                success: function(response) {
                    resolve({ id: response.id });
                },
                error: function(error) {
                    console.error("Error al consultar el ID del cromo:", error);
                    reject();
                }
            });
        });
    }
});