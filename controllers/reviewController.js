const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});

exports.createReview = catchAsync(async (req, res) => {
    if (!req.body.tour) {
        req.body.tour = req.params.tourId;
    }
    if (!req.body.user) {
        req.body.user_id = req.user._id;
    }

    const newReview = await Review.create(req.body);
    newReview.__v = undefined;
    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    });
})
