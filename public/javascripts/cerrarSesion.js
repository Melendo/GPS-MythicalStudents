$(document).ready(function() {
    $('#cerrarSesion').on('click', function(event) {
        event.preventDefault();

        // Realiza la solicitud AJAX para cerrar la sesión
        $.ajax({
        url: '/cerrarSesion', // Ruta de la API para cerrar sesión
        method: 'GET',
        success: function(response) {
            // Redirecciona a la página de inicio de sesión u otra página deseada
            window.location.href = '/';
        },
        error: function(error) {
            console.error('Error al cerrar sesión:', error);
            // Puedes manejar el error según tus necesidades
        }
        });
    });
});