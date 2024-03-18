$(document).ready(function() {

    $("#comprar").on('click', function() {
        
        $.ajax({
            url: "/comprarSobre/" + id,
            type: "POST",
            data: { },
            success: function(response) {
                if (response.success) {
                    alert(response.mensaje);
                }
                else {
                    alert(response.mensaje);
                }
            },
            error: function(error) {
                console.error("Error al realizar el proceso de compra de sobre:", error);
            }
        });
    })

});
