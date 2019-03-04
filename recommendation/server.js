// Requiring all the data
const teammates = require('../seed/out/teammates.json')
const ratings = require('../seed/out/ratings.json')
const restaurants = require('../seed/out/restaurants.json')


// Our newest addition to the dependency family
const express = require('express');
const mongoose = require('mongoose');

const PORT = 3000;

// Requiring all models to create collections
const Teammates = require("./models/Teammates");
const Restaurants = require("./models/Restaurants");
const Ratings = require("./models/Ratings");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/recommendDB", { useNewUrlParser: true });

// // Save a new Example using the data object
// Teammates.create(teammates)
//     .then(function () {
//         // If saved successfully, print the new Example document to the console
//         console.log("Teammates have been imported!!");
//     })
//     .catch(function (err) {
//         // If an error occurs, log the error message
//         console.log(err.message);
//     });

// Restaurants.create(restaurants)
//     .then(function () {
//         // If saved successfully, print the new Example document to the console
//         console.log("Restaurants have been imported!!");
//     })
//     .catch(function (err) {
//         // If an error occurs, log the error message
//         console.log(err.message);
//     });

// Ratings.create(ratings)
//     .then(function () {
//         // If saved successfully, print the new Example document to the console
//         console.log("Ratings have been imported!!");
//     })
//     .catch(function (err) {
//         // If an error occurs, log the error message
//         console.log(err.message);
//     });


// app.get("/similarities/:id/:id2", function (req, res) {
//     Teammates.find({})
//         .then(function (data) {
//             console.log(req.params.id);
//             console.log(req.params.id2);
//             res.send(data);
//         })
//         .catch(function (err) {
//             // If an error occurs, send it back to the client
//             res.send(err);
//         });
// });


// app.get("/similarities/:id/:id2", function (req, res) {
//     Teammates.aggregate([
//         {
//             $lookup: {
//                 from: "ratings",
//                 localField: "id",
//                 foreignField: "teammateId",
//                 as: "Likes/Dislikes"
//             }
//         }
//     ])
//         .exec().then(function (data) {
//             res.send(data)
//         }).catch(function (err) {
//             console.log(err)
//         })
// });

// app.get("/similarities/:id/:id2", function (req, res) {

//     let teammate1 = {};
//     let teammate2 = {};

//     Teammates.find({
//         $or: [
//             { 'name': req.params.id },
//             { 'name': req.params.id2 }
//         ]
//     })
//         .then(function (data) {
//             teammate1 = data[0];
//             teammate2 = data[1];
//             console.log(teammate1);
//             console.log('------------------------');
//             console.log(teammate2);

//         })
//         .catch(function (err) {
//             // If an error occurs, send it back to the client
//             res.send(err);
//         });

// });

app.get("/similarities/:id/:id2", function (req, res) {
    let person1 = [];
    let person2 = [];

    Teammates.aggregate([
        {
            $match: {
                $or: [
                    { 'name': req.params.id },
                    { 'name': req.params.id2 }
                ]
            }
        },
        {
            $lookup: {
                from: "ratings",
                localField: "id",
                foreignField: "teammateId",
                as: "Likes_Dislikes"
            }
        }
    ])
        .exec().then(function (data) {

            person1 = data[0].Likes_Dislikes;
            person2 = data[1].Likes_Dislikes;

            let person1Likes = [];
            let person1DisLikes = [];

            let person2Likes = [];
            let person2DisLikes = [];

            person1.map(restaurants => {
                if (restaurants.rating === 'LIKE') {
                    person1Likes.push(restaurants);
                }
                else {
                    person1DisLikes.push(restaurants)
                }
            });

            person2.map(restaurants => {
                if (restaurants.rating === 'LIKE') {
                    person2Likes.push(restaurants);
                }
                else {
                    person2DisLikes.push(restaurants)
                }
            });

            let p1L_N_p2L = intersection(person1Likes, person2Likes);
            let p1D_N_p2D = intersection(person1DisLikes, person2DisLikes);
            let p1L_N_p2D = intersection(person1Likes, person2DisLikes);
            let p1D_N_p2L = intersection(person1DisLikes, person2Likes);
            let p1_U_p2 = union(person1, person2);

            let sim = similarity(p1L_N_p2L, p1D_N_p2D, p1L_N_p2D, p1D_N_p2L, p1_U_p2);

            res.send({ sim });

        }).catch(function (err) {
            console.log(err)
        })
});

// Intersetion Function
intersection = (array1, array2) => {
    let newArray = [];
    for (i = 0; i < array1.length; i++) {
        for (j = 0; j < array2.length; j++) {
            if (array1[i].restaurantId === array2[j].restaurantId) {
                newArray.push(array1[i].restaurantId);
            }
        }
    }
    return newArray.length;
};

// Union Function
union = (array1, array2) => {
    let newArray = [];

    for (i = 0; i < array1.length; i++) {
        var match = false;
        for (j = 0; j < array2.length; j++) {
            if (array1[i].restaurantId === array2[j].restaurantId) {
                match = true;
                break;
            }
        }
        if (!match) {
            newArray.push(array1[i].restaurantId)
        }
    }
    return newArray.length;
};


// Similarity Function
// similarity = (p1L_N_p2L, p1D_N_p2D, p1L_N_p2D, p1D_N_p2L, p1_U_p2) => {
//     let num = Math.sign((p1L_N_p2L + p1D_N_p2D - p1L_N_p2D - p1D_N_p2L)*(p1L_N_p2L + p1D_N_p2D - p1L_N_p2D - p1D_N_p2L));
//     return ((num) / p1_U_p2).toFixed(2);
// }

similarity = (p1L_N_p2L, p1D_N_p2D, p1L_N_p2D, p1D_N_p2L, p1_U_p2) => {
    let topNum = Math.abs(p1L_N_p2L + p1D_N_p2D - p1L_N_p2D - p1D_N_p2L) * Math.sign(p1L_N_p2L + p1D_N_p2D - p1L_N_p2D - p1D_N_p2L);
    let botNum = p1_U_p2;

    if ((topNum === 0) && (botNum === 0)) {
        return 1;
    }
    else if ((topNum / botNum) === 0) {
        return (topNum / botNum);
    }
    else if ((topNum / botNum) > 1){
        return 1;
    }
    else if ((topNum / botNum) < -1){
        return -1;
    }
    else {
        return (topNum / botNum).toFixed(2);
    }
}


// Start the API server
app.listen(PORT, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
