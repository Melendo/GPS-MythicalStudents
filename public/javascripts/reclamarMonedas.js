$(document).ready(function() {
    $("#btnReclamarRecompensa").on('click', function() {
        var nuevasMonedas = obtenerNuevasMonedas();

        $.ajax({
            url: '/cuestionario/reclamar' + nuevasMonedas,
            type: 'GET',
            success: function(response) {
                reproducirSonido();
                Swal.fire({
                    title: response.mensaje,
                    icon: "success",
                    timer: 1800,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didClose: function() {
                        window.location.href = '/';
                    }
                });
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

function reproducirSonido() {
    var sound = document.getElementById("sonidoMoneda");
    sound.play();
    generarMonedas();
}

function generarMonedas() {
    var container = $(".coin-container");

    // Generar un número aleatorio de monedas entre 5 y 10
    var numCoins = Math.floor(Math.random() * 6) + 5;

    // Generar monedas y agregarlas al contenedor
    for (var i = 0; i < numCoins; i++) {
        var coin = $("<div class='coin'></div>");
        container.append(coin);

        // Posicionar la moneda en una ubicación aleatoria dentro del contenedor
        var posX = Math.random() * container.width();
        var posY = Math.random() * container.height();
        coin.css({
            left: posX,
            top: posY
        });

        // Animar la moneda para que se desplace hacia arriba y se desvanezca
        coin.animate({
            top: "-=100px",
            opacity: 0
        }, 1000, function() {
            // Eliminar la moneda del DOM después de la animación
            $(this).remove();
        });
    }
}