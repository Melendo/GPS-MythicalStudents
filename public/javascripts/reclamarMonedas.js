$(document).ready(function() {
    $("#btnReclamarRecompensa").on('click', function() {
        var nuevasMonedas = obtenerNuevasMonedas();

        $.ajax({
            url: '/cuestionario/' + nuevasMonedas,
            type: 'GET',
            success: function(response) {
                alert(response.mensaje);
                window.location.href = '/index';
            },
            error: function(error) {
                console.error("Error al reclamar la recompensa:", error);
            }
        });
    });
});

function obtenerNuevasMonedas() {
    return $("#monedas").val(); //modificar segun este puesto en la iu
}
