const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const morgan = require('morgan');
const express = require('express');
const AppError = require('./utils/appError');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const globalErrorHandler = require('./controllers/errorController');


const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const testRouter = require('./routes/testRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try in an hour!'
});

app.use(xss());
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '20kb' }));
app.use('/api', limiter);
app.use(express.static(`${__dirname}/public`))

// Sanitize Data
app.use(mongoSanitize());


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

app.all('*', (req, res, next) => {
    // const error = new Error(`The endpoint ${req.originalUrl} is not defined. If you believe this is wrong. Please contact system administrator.`);
    // error.status = 'fail';
    // error.statusCode = 404;

    next(new AppError(`The endpoint ${req.originalUrl} is not defined. If you believe this is wrong. Please contact system administrator.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
