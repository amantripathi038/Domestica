require('dotenv').config();

const app = require('./index');
require('./database/db')();

// Uncaught Exception is when you throw an error and did not catch anywhere.
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Listening on PORT: ${process.env.PORT}`);
});

// Unhandled promise rejection is similar, when you fail to catch a Promise.reject.
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err, err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});