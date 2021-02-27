// This model if want to check all users actions on database and store it in forms of 
// mthodes and urlRequested on database and what timme requested 


// require mongoose module
const mongoose = require('mongoose')

// create schema for logs model
const schema = new mongoose.Schema({
    urlRequested: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    currentTime: {
        type: Date,
        default: Date.now
    }
})

// create model for logs
const Log = mongoose.model('Log', schema);

// export log to be used in other files
module.exports = Log