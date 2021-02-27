// requrie mongoose module
const mongoose = require('mongoose')


// define schema for todo module in mongoDb 
const schema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    details: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 500
    },
    createdAt: {
        required: true,
        type: Date
    },

    updatedAt: {
        required: true,
        type: Date,
        default: Date.now()
    },
    done: {
        type: Boolean,
        default: false
    }
})

// make todo model in database
const Todo = mongoose.model('Todo', schema);

// export model to be used in diff file
module.exports = Todo;