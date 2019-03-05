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

// // Creating collections and import the JSON file
// Teammates.create(teammates)
//     .then(function () {
//         console.log("Teammates have been imported!!");
//     })
//     .catch(function (err) {
//         console.log(err.message);
//     });

// Restaurants.create(restaurants)
//     .then(function () {
//         console.log("Restaurants have been imported!!");
//     })
//     .catch(function (err) {
//         console.log(err.message);
//     });

// Ratings.create(ratings)
//     .then(function () {
//         console.log("Ratings have been imported!!");
//     })
//     .catch(function (err) {
//         console.log(err.message);
//     });

// Initial Request to get the teammates
app.get('/teammates', function (req, res) {
    Teammates.find({})
        .then(function (data) {
            res.send(data);
        })
})

// Initial Request to get the restaurants
app.get('/restaurants', function (req, res) {
    Restaurants.find({})
        .then(function (data) {
            res.send(data);
        })
})

// GET request for Similarities
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
        let match = false;
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

similarity = (p1L_N_p2L, p1D_N_p2D, p1L_N_p2D, p1D_N_p2L, p1_U_p2) => {
    let topNum = Math.abs(p1L_N_p2L + p1D_N_p2D - p1L_N_p2D - p1D_N_p2L) * Math.sign(p1L_N_p2L + p1D_N_p2D - p1L_N_p2D - p1D_N_p2L);
    let botNum = p1_U_p2;

    if ((topNum === 0) && (botNum === 0)) {
        return 1;
    }
    else if ((topNum / botNum) === 0) {
        return (topNum / botNum);
    }
    else if ((topNum / botNum) > 1) {
        return 1;
    }
    else if ((topNum / botNum) < -1) {
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
