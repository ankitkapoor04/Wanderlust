const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String, // Correct Mongoose type
        trim: true, // Optional: Removes extra spaces
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Use `Date.now` without parentheses
    },
});

module.exports = mongoose.model("Review", reviewSchema);
