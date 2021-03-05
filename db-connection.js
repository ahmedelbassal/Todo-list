// get mongoose module
const mongoose = require('mongoose')

// connect to database     // LOCAL DATABASE mongodb://localhost:27017/todoApp
//  mongodb+srv://AhmedBassal:ZlZN50Nc0wav0uqL@cluster0.2oocx.mongodb.net/todoApp?retryWrites=true&w=majority
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true

}).then(() => {

    console.log('connected to mongoDb')

}).catch((err) => {

    console.log(err)

});


