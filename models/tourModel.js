const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        maxlength: [30, 'A tour name must have less than or equal to 30 characters'],
        minlength: [5, 'A tour name must have more or equal to 5 characters'],
        validate: [validator.isAlpha, 'Tour Name should only contain Alphabets']
    },
    slug: String,
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Ratings must be aboce 1.0'],
        max: [5, 'Ratings must be below 5.0']
    },
    difficulty: {
        type: String,
        required: false,
        enum: {
            values: ['easy', 'medium', 'hard'],
            message: 'Difficulty only accepts easy, medium, hard'
        }
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            message: 'Discount price {VALUE} should be below the regular price',
            validator: function(value) {
                return value < this.price;
            }
        }
    },
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
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Perform Embedding

// tourSchema.pre('save',async function(next) {
//     const guidesPromise = this.guides.map(async (id) => {
//         return await User.findById(id);
//     });
//     this.guides = await Promise.all(guidesPromise);
//     next();
// });

tourSchema.virtual('durationWeeks').get(function() {
    return this.durations / 7;
});

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    this.start = Date.now();
    next();
});

tourSchema.pre('find', function(next) {
    this.find({ secretTour: { $ne: true } });
    next();
});

tourSchema.pre('findOne', function(next) {
    this.findOne({ secretTour: { $ne: true } });
    next();
});

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    })
    next();
});

tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} seconds`);
    console.log(docs);
    next();
});

tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});


// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// })

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
