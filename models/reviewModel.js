const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review is a required field!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Rating is a required field']
    },
    tour_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a Tour!']
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a User!']
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: 'tour_id',
    // }).populate({
    //     path: 'user_id',
    // });

    this.populate({
        path: 'user_id',
    });
    next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
