const Tour = require('../models/tourModel');

exports.aliasTopTours = async (req, res, next) => {
    console.log('test')
    req.query.limit = '5';
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = 'name,price,summery';
    next();
}

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString  = queryString;

    }

    filter() {
        const queryObject = {...this.queryString};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(element => delete queryObject[element]);

        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryStr));
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v')
        }
        return this;
    }

    pagination() {
        const page = this.queryString.page * 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}


exports.getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().pagination();
        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            statusCode: err.status,
            message: err.message,
        })
    }
}

exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id).populate('review');
        res.status(201).json({
            status: 'success',
            data: {
                tour: tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}

const catchAsyncErrors = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(error => next(error));
    }
}

exports.createTour =  catchAsyncErrors(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    });

});

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: tour
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$name' },
                    sumDurations: { $sum: '$durations' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            },
            // {
            //     $match: { _id: { $ne: 'THE SEA EXPLORER 2' } }
            // }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            error: err.message
        })
    }
}

exports.getMonthlyPlan= async (req, res) => {
    try {

        const year = req.params.year * 1;
        const plan = await  Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStats: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: {
                    numTourStats: 1
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: plan
        });


    } catch (err) {
        res.status(400).json({
            status: 'fail',
            error: err.message
        })
    }
}
