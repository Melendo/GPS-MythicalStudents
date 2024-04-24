$(document).ready(function() {
    $('#formularioRegistro').submit(function(e) {
        e.preventDefault();

        // Obtener los datos del formulario
        const formData = new FormData();
        formData.append('nombre', $('#nombre').val());
        formData.append('apellido1', $('#apellido1').val());
        formData.append('apellido2', $('#apellido2').val());
        formData.append('nombreUsuario', $('#nombre_usuario').val());
        formData.append('email', $('#email1').val());
        formData.append('contrasena1', $('#contrasena1').val());
        formData.append('contrasena2', $('#contrasena2').val());
        formData.append('foto', $('#foto')[0].files[0]);

        // Realizar la solicitud AJAX para iniciar sesión
        $.ajax({
        type: 'POST',
        url: '/registro',
        processData: false,
        contentType: false,
        data: formData,
        success: function(response) {
            // Verificar la respuesta del servidor y redirigir en consecuencia
            if (response.success) {
                $('.alerta').hide();
                alert("Cuenta creada con exito!");
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