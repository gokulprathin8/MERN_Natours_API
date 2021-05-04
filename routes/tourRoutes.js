const fs = require('fs');
const express = require('express');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../data.json`)
);

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
}

const getTourById = (req, res) => {
    const id = req.params.id * 1
    const tour = tours.find((element) => element.id === id);

    if (!tour) {
        return res.status(404).json({
            message: 'no data found'
        });
    }

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedTime,
        data: {
            tour
        }
    })
}

const createTour = (req, res) => {
    const newId = tours[tours.length -1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/data.json`, JSON.stringify(tours), err => {
        res.status(201);
    });

    res.send('done');
}

const updateTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'Update successful'
        }
    });
}

const deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
}

const router = express.Router();

router
    .route('/')
    .get(getAllTours)
    .post(createTour)

router
    .route('/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour)

module.exports = router;
