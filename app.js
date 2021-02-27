// requrie express module to deal with apis
const express = require('express')

// extract app function from express
const app = express();

// make data streams with JSON type 
app.use(express.json());

// get logs Router 
const logsRouter = require('./routers/requestsLogs')

// get todoRouter to define base api for it
const todoRouter = require('./routers/todoRouter');

// get userRouter to define base api for it
const userRouter = require('./routers/userRouter');


// here make middlewhere to allow other ports and servers to request on it. it shouldn't be same port
app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin , X-Requested-With , Content-Type , Accept , authorization '
    );

    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, PUT, OPTIONS'
    );

    next();
})

// This If I want to store all user actions on database ( methods like get,patch....) and Url requested
// Also what time of these requests .. but will not allow it in order not to fill atlas mongoDB with
//      much data

// define logs router base api 

//app.use('/api', logsRouter)

////////////////////////////////

// define main url for todoRouter
app.use('/api/todo', todoRouter);

// define main url for userRouter
app.use('/api/user', userRouter);



// export app to be used in different files
module.exports = app;