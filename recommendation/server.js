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
            person1 = data[0].Likes_Dislikes;

            let person1Likes = [];
            let person1Disikes = [];

            let person2Likes = [];
            let person2Disikes = [];

            person1.map(restaurants => {
                if(restaurants.rating === 'LIKE'){
                    person1Likes.push(restaurants);
                }
                else{
                    person1Disikes.push(restaurants)
                }
            });

            person2.map(restaurants => {
                if(restaurants.rating === 'LIKE'){
                    person2Likes.push(restaurants);
                }
                else{
                    person2Disikes.push(restaurants)
                }
            });

            res.send(person1Likes);

        }).catch(function (err) {
            console.log(err)
        })
});



// Intersetion Functions
intersectionSame = () => {

}

intersectionDifferent = () => {

}


// Start the API server
app.listen(PORT, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
