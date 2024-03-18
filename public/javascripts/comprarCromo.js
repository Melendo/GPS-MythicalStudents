$(document).ready(function() {

    $("#comprar").on('click', function() {
        //var idSobre = #('#sobre').val();
        $.ajax({
            url: "/comprarCromo",
            type: "POST",
            data: { idSobre }, // Debes enviar los datos en un objeto
            success: function(response) {
                if (response.success) {
                    alert(response.mensaje);
                }
                else {
                    alert(response.mensaje);
                }
            },
            error: function(error) {
                console.error("Error al realizar el proceso de compra de cromo:", error);
            }
        });
    })

});
