$(document).ready(function() {
    $("#btnReclamarRecompensa").on('click', function() {
        var nuevasMonedas = obtenerNuevasMonedas();

        $.ajax({
            url: '/cuestionario/reclamar' + nuevasMonedas,
            type: 'GET',
            success: function(response) {
                alert(response.mensaje);
                window.location.href = '/';
            },
            error: function(error) {
                console.error("Error al reclamar la recompensa:", error);
            }
        });
    });
});

function obtenerNuevasMonedas() {
    return 100; //modificar segun este puesto en la iu
}
