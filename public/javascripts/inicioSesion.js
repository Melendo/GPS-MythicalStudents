$(document).ready(function() {
    $('#formularioInicioSesion').submit(function(e) {
        e.preventDefault();

        // Obtener los datos del formulario
        var formData = {
            email: $('#email1').val(),
            contraseña: $('#contraseña1').val()
        };

        // Realizar la solicitud AJAX para iniciar sesión
        $.ajax({
        type: 'POST',
        url: '/inicioSesion',
        data: formData,
        success: function(response) {
            // Verificar la respuesta del servidor y redirigir en consecuencia
            if (response.success) {
                $('.alerta').hide();
                window.location.href = response.redirect;
            }
            else {
                $('.alerta').empty();
                response.mensajeError.forEach(function(error) {
                    $('.alerta').append(error.msg);
                    $('.alerta').append('<br>');
                });
                $('.alerta').show();
            }
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX:', error);
        }
        });
    });
});