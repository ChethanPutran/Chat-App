//Importing neccessary modules
const path = require('path');
const express = require('express');

//Getting public folder path
const publicPath = path.join(__dirname + "/../public");

var app = express();
app.use(express.static(publicPath));

const port = 3000 || process.env.PORT;







//Listening on perticular port
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
