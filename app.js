const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const testRouter = require('./routes/testRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
   req.requestedTime = new Date().toISOString();
   next();
});

app.post('/test', (req, res)=> {
    res.send('You can post to this endpoint');
});

app.get('/test', testRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `The endpoint ${req.originalUrl} is not defined. If you believe this is wrong. Please contact system administrator.`
    // });

    const error = new Error(`The endpoint ${req.originalUrl} is not defined. If you believe this is wrong. Please contact system administrator.`);
    eror.status = 'fail';
    error.statusCode = 404;

    next(error);
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
});

module.exports = app;
