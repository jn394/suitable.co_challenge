$(document).ready(function () {

    $.ajax({
        method: "GET",
        url: "/teammates"
    })
        .then(function (data) {
            console.log(data);

            for (i = 0; i < data.length; i++) {
                $('.teammate').append(`<option> ${data[i].name} </option>`);
            }

        });

    $.ajax({
        method: "GET",
        url: "/restaurants"
    })
        .then(function (data) {
            console.log(data);

            for (i = 0; i < data.length; i++) {
                $('#restaurants').append(`<option> ${data[i].name} </option>`);
            }

        });



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

    $('#predictBTN').on("click", function () {
        event.preventDefault();

        console.log($('#teammate3').val());
        console.log($('#restaurants').val());

        $.ajax({
            method: "GET",
            url: "/prediction/" + $('#teammate3').val() + "/" + $('#restaurants').val()
        })
            .then(function (data) {
                console.log(data);
                $("#prediction").append(data.predict);
            });

    })

});