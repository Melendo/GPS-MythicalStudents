// Generar números aleatorios entre un rango específico
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

document.addEventListener('DOMContentLoaded', function() {
    var envelope = document.getElementById('envelope');
    var lightsContainer = document.querySelector('.lights-container');
    var vistaCromo = document.querySelector('.cromo-container');
    var nombreCromoTexto = document.querySelector('.nombre-cromo-texto');
    var imagenCromo = document.querySelector('.imagen-cromo');
    var buttonSiguiente = document.querySelector('.btnSiguiente');
    var nuevo = document.querySelector('.nuevo');

    // Función para iniciar la animación de vibración
    function startVibration() {
        envelope.style.animation = 'vibrate 0.1s infinite alternate';
    }

    // Función para desaparecer el sobre después de la vibración
    function hideEnvelope() {
        envelope.style.animation = 'enlargeAndDisappear 1s forwards';
        lightsContainer.style.animation = 'fadeLights 1s forwards'; // Desvanecer las luces
        setTimeout(fadeConfetti, 1000); // Retraso de 1000 milisegundos (1 segundo) para el desvanecimiento del confeti)
        // Llama a mostrarAlertas después de que la animación haya terminado
        setTimeout(function() {
            trasAnimacion();
        }, 1000); // Espera 2 segundos (1000ms de desaparición + 1000ms de confeti)
    }

    // Función para crear confeti
    function createConfetti() {
        for (let i = 0; i < 100; i++) {
            var confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * window.innerWidth + 'px'; // Cambiado
            confetti.style.animationDelay = Math.random() * 2 + 's'; // Retardo aleatorio para cada confeti
            document.body.appendChild(confetti); // Cambiado
        }
    } 
    
    // Función para desvanecer el confeti
    function fadeConfetti() {
        var confetti = document.querySelectorAll('.confetti');
        confetti.forEach(function(confetto) {
            confetto.style.animation = 'fadeConfetti 1s forwards';
        });
    }

    function trasAnimacion() {
        vistaCromo.style.display = 'block';
        var idCromos = JSON.parse(localStorage.getItem('idCromos'));
        var nuevosCromos = JSON.parse(localStorage.getItem('cromosNuevos'));
        if (idCromos && idCromos.length > 0) {
            mostrarCromos(idCromos, nuevosCromos);
        } else {
            window.location.href = '/tienda';
        }
    }
    
    function mostrarCromos(idCromos, nuevosCromos) {
        var index = 0;

        function mostrarSiguienteCromo() {
            if (index < idCromos.length) {
                obtenerNombreCromo(idCromos[index], function(nombre) {
                    nombreCromoTexto.textContent = nombre;
                });
                
                if (nuevosCromos[index] === 1) {
                    nuevo.src = "/images/nuevo.png";
                    nuevo.style.display = 'block';
                } else {
                    nuevo.style.display = 'none';
                }

                imagenCromo.src = "/animacionSobre/imagen/" + idCromos[index];
                index++;
            } else {
                window.location.href = '/tienda';
            }
        }

        // Mostrar el primer nombre al cargar la página
        mostrarSiguienteCromo();

        // Agregar botón para avanzar al siguiente nombre
        buttonSiguiente.addEventListener('click', mostrarSiguienteCromo);
    }

    function obtenerNombreCromo(idCromo, callback) {
        $.ajax({
            url: '/animacionSobre/nombre/' + idCromo,
            type: 'GET',
            success: function(response) {
                callback(response);
            },
            error: function(error) {
                console.error("Error al consultar el nombre del cromo:", error);
            }
        });
    }

    // Iniciar la animación al cargar la página
    var lights = document.querySelectorAll('.light');
    lights.forEach(function(light) {
        // Generar posiciones aleatorias para cada luz
        var randomLeft = getRandomNumber(0, window.innerWidth) + 'px';
        var randomTop = getRandomNumber(0, window.innerHeight) + 'px';
        light.style.display = 'block';
        light.style.left = randomLeft;
        light.style.top = randomTop;
    });
    startVibration();
    createConfetti();
    setTimeout(hideEnvelope, 3000); // 3000ms es la duración de la vibración
    console.log(JSON.parse(localStorage.getItem('cromosNuevos')));
});
