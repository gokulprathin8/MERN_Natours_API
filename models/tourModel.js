const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    durations: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    summery: {
        type: String,
        required: [true, 'A tour must have a summery'],
        trim: true,
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    startDates: [Date]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

tourSchema.virtual('durationWeeks').get(function() {
    return this.durations / 7;
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
