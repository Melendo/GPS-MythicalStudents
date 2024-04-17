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
    var buttonAnterior = document.querySelector('.btnAnterior');
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
        var aux = 0;
        var imagenCromo = document.querySelector('.imagen-cromo');
        var flechaDerecha = document.createElement('img');
        var flechaIzquierda = document.createElement('img');
    
        // Configurar la flecha derecha
        flechaDerecha.src = "/images/flecha.png";
        flechaDerecha.classList.add('flecha');
        flechaDerecha.classList.add('flecha-derecha');
    
        // Configurar la flecha izquierda
        flechaIzquierda.src = "/images/flecha_izquierda.png";
        flechaIzquierda.classList.add('flecha');
        flechaIzquierda.classList.add('flecha-izquierda');
        //flechaIzquierda.style.transform = 'rotate(180deg)'; // Rotar la flecha hacia el otro lado
    
        // Insertar las flechas en el documento
        document.body.appendChild(flechaIzquierda);
        document.body.appendChild(flechaDerecha);

     // Función para mostrar el siguiente cromo
 // Función para mostrar el siguiente cromo
// Función para mostrar el siguiente cromo
    function mostrarSiguienteCromo() {



        if (index < idCromos.length) {

            console.log(index);
            if (index < 1){

                flechaIzquierda.style.opacity = 0;
                flechaIzquierda.style.display = "none";
            }else{
 
                flechaIzquierda.style.opacity = 1;
                flechaIzquierda.style.display = "block";
            }
            
            if (index + 1 === idCromos.length){
                flechaDerecha.src ="/images/tick.png";
            }else{
                flechaDerecha.src = "/images/flecha.png";
            }

            if (nuevosCromos[index] === 1) {
  
                
                
                setTimeout(function() {
                    nuevo.src = "/images/nuevo.png";
                    nuevo.style.display = 'block';
                    nuevo.classList.remove('fade-out');
                    nuevo.classList.add('fade-in');
                }, 500); // Espera 2.5 segundos en total (0.5s para la transición + 2s para el tamaño agrandado)
     

                
                // Agregar la clase 'normal' primero para establecer el tamaño inicial
                nuevo.classList.add('normal');

                // Después de un breve retraso, agregar la clase 'enlarged' para agrandar la imagen
                setTimeout(function() {
                    nuevo.classList.add('enlarged');
                }, 1000); // Espera 100ms antes de agregar la clase 'enlarged'

                // Después de un tiempo, quitar la clase 'enlarged' para revertir el tamaño
                setTimeout(function() {
                    nuevo.classList.remove('enlarged');
                    // Agregar la clase 'shrink-animation' para animar el regreso al tamaño normal
                    nuevo.classList.add('shrink-animation');
                }, 2000); // Espera 2 segundos antes de quitar la clase 'enlarged'

                // Después de la animación de regreso al tamaño normal, quitar la clase 'shrink-animation'
                setTimeout(function() {
                    nuevo.classList.remove('shrink-animation');
                }, 2500); // Espera 2.5 segundos en total (0.5s para la transición + 2s para el tamaño agrandado)

                createConfetti();


                    // Función para aplicar la animación de rotación a la imagen
                function aplicarAnimacion() {
                    nombreCromoTexto.classList.remove('fade-in');
                    nombreCromoTexto.classList.add('fade-out');
                    imagenCromo.style.animation = 'rotateY 4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                    nombreCromoTexto.style.animation = 'rotateY 4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                    
                }
                
                // Función para resetear la animación de rotación
                function resetearAnimacion() {
                    // Eliminar la regla de animación
                    imagenCromo.style.animation = 'none';
                    nombreCromoTexto.style.animation = 'none';


                    // Esperar un breve momento antes de volver a aplicar la animación
                    setTimeout(aplicarAnimacion, 100);
                    
                }
            
                // Llamar a la función para aplicar la animación cuando sea necesario
                aplicarAnimacion();
                
                // Llamar a la función para resetear la animación después de usarla
                resetearAnimacion();
            



                flechaIzquierda.classList.add('fade-out');
                flechaDerecha.classList.add('fade-out');



                    setTimeout(function() {
                        // Eliminar la clase fade-out y agregar la clase fade-in después de 3 segundos
                        flechaIzquierda.classList.remove('fade-out');
                        flechaDerecha.classList.remove('fade-out');
                    
                        flechaIzquierda.classList.add('fade-in');
                        flechaDerecha.classList.add('fade-in');

                        
                        nombreCromoTexto.classList.remove('fade-out');
                        nombreCromoTexto.classList.add('fade-in');  // para que vuelva a aparecer el nombre
                    }, 3000);

                    nombreCromoTexto.classList.remove('fade-in');  // para que vuelva a aparecer el nombre

            } else {
                nuevo.style.display = 'none';
                fadeConfetti();
            }


            

            if (aux > 0){
                // Desvanecer la imagen y el texto actuales solo si no es el primer cromo
                if (index > 0) {
                    imagenCromo.classList.remove('fade-in');
                    imagenCromo.classList.add('fade-out');

                    nombreCromoTexto.classList.remove('fade-in');                
                    nombreCromoTexto.classList.add('fade-out');


                            // Mostrar la nueva imagen y el nuevo texto con fade in
                    setTimeout(function() {
                        // Solo se activa la transición si no es el primer cromo
                        
                            imagenCromo.src = "/animacionSobre/imagen/" + idCromos[index - 1];
                            imagenCromo.classList.remove('fade-out');
                            imagenCromo.classList.add('fade-in');
                            
                            obtenerNombreCromo(idCromos[index-1], function(nombre) {
                                nombreCromoTexto.textContent = nombre;
                            });
                            
                            if (nuevosCromos[index - 1] != 1) {
                                nombreCromoTexto.classList.remove('fade-out');
                                nombreCromoTexto.classList.add('fade-in');
                            }

                            
                        
                    }, 500); // Esperar 500 milisegundos antes de mostrar la nueva imagen y texto
                }
                else{
                    imagenCromo.classList.remove('fade-in');                    
                    imagenCromo.classList.add('fade-out');


                    nombreCromoTexto.classList.remove('fade-in');
                    nombreCromoTexto.classList.add('fade-out');
                    
                   

                    setTimeout(function() {
                        // Solo se activa la transición si no es el primer cromo
                        
                            imagenCromo.src = "/animacionSobre/imagen/" + idCromos[0];
                            imagenCromo.classList.remove('fade-out');
                            imagenCromo.classList.add('fade-in');

                            obtenerNombreCromo(idCromos[0], function(nombre) {
                                nombreCromoTexto.textContent = nombre;
                            });
                            
                            if (nuevosCromos[index] != 1) {
                                nombreCromoTexto.classList.remove('fade-out');
                                nombreCromoTexto.classList.add('fade-in');
                            }
                        
                    }, 500); // Esperar 500 milisegundos antes de mostrar la nueva imagen y texto
                    //imagenCromo.src = "/animacionSobre/imagen/" + idCromos[0];
                }
            }
            else{

                imagenCromo.src = "/animacionSobre/imagen/" + idCromos[0];
                obtenerNombreCromo(idCromos[index], function(nombre) {
                    nombreCromoTexto.textContent = nombre;
                });

                aux++;
            }

            if (nuevosCromos[index] === 1) {
                nuevo.classList.remove('fade-in');
                nuevo.classList.add('fade-out');
            }
            index++;
        } else {
            window.location.href = '/tienda';
        }
    }

 
        // Mostrar el primer nombre al cargar la página
        mostrarSiguienteCromo();

     // Configurar el evento clic para la flecha derecha
    flechaDerecha.addEventListener('click', function() {
        console.log("Flecha derecha clickeada");
        mostrarSiguienteCromo();
    });

  
    // Configurar el evento clic para la flecha izquierda
    flechaIzquierda.addEventListener('click', function() {
        if (index > 1){
            console.log("Flecha izquierda clickeada");
            index -= 2; // Retroceder dos posiciones para mostrar el cromo anterior
            mostrarSiguienteCromo();
        }

    });
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
