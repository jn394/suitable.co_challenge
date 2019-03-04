$(document).ready(function () {

    // $.ajax({
    //     method: "GET",
    //     url: "/similarities"
    // })
    //     .then(function () {
    //         console.log('Similarities have been calulated!');
    //     });

    $("#simiBTN").on("click", function () {
        event.preventDefault();

        console.log($('#teammate1').val());
        console.log($('#teammate2').val());

        $("#similarity").empty();

        $.ajax({
            method: "GET",
            url: "/similarities/" + $('#teammate1').val() + "/" + $('#teammate2').val()
        })
            .then(function (data) {
                console.log(data);
                $("#similarity").append(data.sim);
            });

    });

});