const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantsSchema = new Schema({
    name: String,
    id: { type: String, required: true },
    image_url: String,
    categories: [{
        alias: String,
        title: String
    },
    {
        alias: String,
        title: String
    }
    ]
});

const Restaurants = mongoose.model("Restaurants", restaurantsSchema);

module.exports = Restaurants;
