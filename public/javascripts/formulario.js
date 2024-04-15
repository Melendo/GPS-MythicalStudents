$(document).ready(function() {

    //Mostrar contraseñas
    function mostrarPassword(id) {
        var contra = $("#" + id);
        if (contra.attr("type") === "password") {
            contra.attr("type", "text");
            $("#show-password" + id.charAt(id.length - 1)).text("Ocultar");
        } else {
            contra.attr("type", "password");
            $("#show-password" + id.charAt(id.length - 1)).text("Mostrar");
        }
    }
    
    $("#show-password1").on("click", function() {
        mostrarPassword("contraseña1");
    });

    $("#show-password2").on("click", function() {
        mostrarPassword("contraseña2");
    });

    // Verificar contraseña
    function validarContrasena(contra) {
        var longitudValida = contra.length >= 4;

        var tieneMayuscula = /[A-Z]/.test(contra);
        var tieneMinuscula = /[a-z]/.test(contra);
        var tieneNumero = /\d/.test(contra);

        return longitudValida && tieneMayuscula && tieneMinuscula && tieneNumero;
    }
    

    function mensajePassword(inputId, mensajeId) {
        var contra = $('#' + inputId).val();
        var mensaje = "";

        if (!validarContrasena(contra)) {
            mensaje = "La contraseña debe tener al menos una minúscula, una mayúscula, un número y ser de al menos 4 caracteres de longitud.";
        }

        $('#' + mensajeId).text(mensaje);
    }

    $('#contraseña1').on('input', function() {
        mensajePassword('contraseña1', 'mensaje-validacion1');
    });

    $('#contraseña2').on('input', function() {
        mensajePassword('contraseña2', 'mensaje-validacion2');
        verificarCoincidenciaContraseñas();
    });

    // Verificar coincidencia de contraseñas
    function verificarCoincidenciaContraseñas() {
        var contraseña1 = $('#contraseña1').val();
        var contraseña2 = $('#contraseña2').val();
        var mensaje = "";

        if (contraseña1 !== contraseña2) {
            mensaje = "Las contraseñas no coinciden.";
        }

        $('#mensaje-validacion2').text(mensaje);
    }

    // Verificar correo
    function validarCorreo(inputId, mensajeId) {
        var email = $('#' + inputId).val();
        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        var mensaje = "";
      
        if (!emailPattern.test(email)) {
            mensaje = "Por favor, introduce una dirección de correo electrónico válida.";
        }
    
        $('#' + mensajeId).text(mensaje);
    }
    
    $('#email1').on('input', function(event) {
        validarCorreo('email1', 'correo-valido1');
    });
    $('#email2').on('input', function(event) {
        validarCorreo('email2', 'correo-valido1');
    });
});