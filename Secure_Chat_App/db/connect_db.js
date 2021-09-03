const mongoose = require('mongoose');
require('dotenv').config();
url = process.env.DATABASE_URL
try {
    mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}).then((db) => console.log("Database connection sucessfull:)"));

mongoose.connection.on('error', (err) => {
    console.log('Database connection error:', err);
});
} catch (err) {
    console.log("Error" + e);
}
