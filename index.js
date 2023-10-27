const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.get('/', (req, res, next) => {
    res.send("Server is working fine.");
});

app.use('/api/v1/customer', routes.customerRouter);
app.use('/api/v1/worker/', routes.workerRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;