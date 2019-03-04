const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teammatesSchema = new Schema({
    id: { type: String, required: true },
    name: String
});

const Teammates = mongoose.model("Teammates", teammatesSchema);

module.exports = Teammates;
