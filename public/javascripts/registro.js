$(document).ready(function() {
    $('#formularioRegistro').submit(function(e) {
        e.preventDefault();

        // Obtener los datos del formulario
        var formData = {
            email: $('#email1').val(),
            contraseña1: $('#contraseña1').val(),
            contraseña2: $('#contraseña2').val(),
            nombre: $('#nombre').val(),
            apellido1: $('#apellido1').val(),
            apellido2: $('#apellido2').val(),
            nombreUsuario: $('#nombre_usuario').val()
        };

        // Realizar la solicitud AJAX para iniciar sesión
        $.ajax({
        type: 'POST',
        url: '/registro',
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

                $('html, body').animate({
                    scrollTop: $('.alerta').offset().top
                }, 20);
            }
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX:', error);
        }
        });
    });
});