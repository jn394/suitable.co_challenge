$(document).ready(function () {

    // $.ajax({
    //     method: "GET",
    //     url: "/similarities"
    // })
    //     .then(function () {
    //         console.log('Similarities have been calulated!');
    //     });

    $("#simiBTN").on("click", function () {
        console.log("I just been clicked");
        event.preventDefault();

        console.log($('#teammate1').val());

        $.ajax({
            method: "GET",
            url: "/similarities/" + $('#teammate1').val() + "/" + $('#teammate2').val()
        })
            .then(function (data) {
                console.log(data);
            });

    });

});