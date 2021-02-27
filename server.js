// launch mongoDB server
require('./db-connection');

// require app from app.js in backend folder to launch server
const app = require('./app')

// launch server on environment or on port 3000 in case of localhost
//define port first
const port = process.env.PORT || 3000;

// launch server using app
app.listen(port, () => {
    console.log("server is running on " + port)
})