const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingsSchema = new Schema({
    teammateId: { type: String, required: true },
    restaurantId: String,
    rating: String
});

const Ratings = mongoose.model("Ratings", ratingsSchema);

module.exports = Ratings;
