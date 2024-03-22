$(document).ready(function() {

    $("#comprar").on('click', function() {
        var id = $(this).data('id');
        $.ajax({
            url: "/comprarSobre/" + id,
            type: "POST",
            data: { },
            success: function(response) {
                if (response.success) {
                    var msg = response.mensaje + "\nObtenidos los siguientes cromos: \n";
                    response.nombres.array.forEach(nom => {
                        msg + nom + " del album " + response.album + "\n";
                    });
                    alert(msg);
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
