const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());
const port = 3000;

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/data.json`)
);

app.get('/api/v1/tours', (req, res) => {
   res.status(200).json({
       status: 'success',
       results: tours.length,
       data: {
           tours
       }
   })
});

app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1
    const tour = tours.find((element) => element.id === id);

    if (!tour) {
        return res.status(404).json({
            message: 'no data found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
});

app.post('/api/v1/tours', (req, res) => {
    const newId = tours[tours.length -1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/data.json`, JSON.stringify(tours), err => {
       res.status(201);
    });

    res.send('done');
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
});

app.delete('/api/v1/tours/:id', (req, res) => {
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

});

app.get('/test', (req, res) => {
   res.status(200).json({message: 'Hello from the server side'});
});

app.post('/test', (req, res)=> {
    res.send('You can post to this endpoint');
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
})
