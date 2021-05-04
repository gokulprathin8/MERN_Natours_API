const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const testRouter = require('./routes/testRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
   req.requestedTime = new Date().toISOString();
   next();
});

app.get('/test', testRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


app.post('/test', (req, res)=> {
    res.send('You can post to this endpoint');
});

module.exports = app;
