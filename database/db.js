const mongoose = require('mongoose');

module.exports = () => mongoose.connect(process.env.DB_URI).then(() => {
    console.log("Database connection established");
}).catch(err => {
    console.error("Database connection error");
    process.exit(1);
});