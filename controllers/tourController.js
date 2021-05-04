const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../data.json`)
);

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
}

exports.getTourById = (req, res) => {
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

exports.createTour = (req, res) => {
    const newId = tours[tours.length -1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/data.json`, JSON.stringify(tours), err => {
        res.status(201);
    });

    res.send('done');
}

exports.updateTour = (req, res) => {
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

exports.deleteTour = (req, res) => {
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
