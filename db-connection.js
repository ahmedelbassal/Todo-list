// get mongoose module
const mongoose = require('mongoose')


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


