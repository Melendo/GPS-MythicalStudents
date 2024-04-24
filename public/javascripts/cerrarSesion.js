$(document).ready(function() {
    $('#cerrarSesion').on('click', function(event) {
        event.preventDefault();
        console.log("Hola holita");

        $.ajax({
        url: '/cerrarSesion',
        method: 'GET',
        success: function(response) {
            window.location.href = '/';
        },
        error: function(error) {
            console.error('Error al cerrar sesión:', error);
        }
        });
    });
});