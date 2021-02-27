// get module express to make router
const express = require("express")
// make router for todo
const todoRouter = new express.Router();

// base route api for todoRouter     '/api/todo'

// module to generate token if user logged in successfully
var jwt = require('jsonwebtoken');

// require mongodb users model to deal with database of user collection
// to check user id
const usersModel = require('../models/userModel')

// require mongodb todos model to deal with database
const todosModel = require('../models/todoModel')


// to write routes without duplication of writing base route

// base route: '/api/todo'


// make error handler function to display error messages

function errorHandler(err, req, res) {


    // return message error as json object
    res.json({ error: err.message })

}

// make authentication middle where before any requests to avoid redunduncy
todoRouter.use((req, res, next) => {

    try {

        // get token from authorization in request headers
        const { authorization } = req.headers;

        if (authorization == '') {
            res.status(401).json({ error: "authentication failed" })
        }

        if (authorization == null) {
            throw Error('authentication failed')
        }

        //get id from token signature
        var user = jwt.verify(authorization, 'verySecret', function (err, userTokenSignature) {

            if (!userTokenSignature) throw Error('authentication failed') // if user not exists throw error


            const userDetails = usersModel.findOne({ _id: userTokenSignature.id }, { password: 0, _id: 1, __v: 0 }).exec().then(

                (userDate) => {

                    // if success .. authorization success then next()
                    // can pass id of user in request
                    req.userId = userTokenSignature.id;
                    next();
                },
                (err) => {

                    throw err;
                }
            );

        });

    }
    catch (err) {

        errorHandler(err, req, res)

    }


})


//   post new todo by userid from token ,body,title, tags
todoRouter.post('/', async (req, res) => {

    try {

        // get values inside request body
        const { details, title } = req.body

        // get id of user
        const userId = req.userId;

        // add new post to todos model collection
        todoCreated = await todosModel.create({ userId, details, title, createdAt: Date.now() });

        res.statusCode = 200
        res.json({ Success: "Todo created successfully" })

    } catch (err) {

        // res.statusCode = 500
        errorHandler(err, req, res);
    }

})


//  return  sepcific todo by id __and user who own it by specific user  id in token signature 
todoRouter.get('/:id', (req, res) => {

    if (req.params.id == null) {
        next();
    }

    try {

        async function getAllTodos() {

            let userTodos = {};

            // if want to ignore values type that here {_id: 0, createdAt: 0, updatedAt: 0}
            userTodos = await todosModel.findOne({ userId: req.userId, _id: req.params.id }, { userId: 0 }).exec();


            res.statusCode = 200
            // this is old return .. return username as property and array of todos as property
            // res.json({ username: checkUser.username, todos: userTodos })

            // here I will return array of todos only
            res.json(userTodos)
        }

        getAllTodos();

    } catch (err) {

        errorHandler(err, req, res);
    }

})


// task 7 return user todos of specific user by id in token signature 
todoRouter.get('/', async (req, res) => {

    try {

        let userTodos = {};

        // here to make logic if user made query request by if condition
        if (Object.keys(req.query).length != 0) {

            // // here make logic of getting todo by date
            if (req.query.startDate) {

                if (req.query.endDate) {


                    userTodos = await todosModel.
                        find({ userId: req.userId, createdAt: { $gt: req.query.startDate, $lt: req.query.endDate } }).
                        sort({ createdAt: 1 }).exec();
                } else {

                    userTodos = await todosModel.find({ userId: req.userId, createdAt: { $gt: req.query.startDate } }).exec();
                }
            }

            // here make logic of getting todo by title
            if (req.query.title) {

                const title = req.query.title;// if want to ignore values type that here {_id: 0, createdAt: 0, updatedAt: 0}
                userTodos = await todosModel.find({ userId: req.userId, title: title }, { userId: 0 }).exec();
            }
        } else {
            // if want to ignore values type that here {_id: 0, createdAt: 0, updatedAt: 0}
            userTodos = await todosModel.find({ userId: req.userId }, { userId: 0 }).sort({ createdAt: -1 }).exec();
        }


        res.statusCode = 200
        // this is old return .. return username as property and array of todos as property
        // res.json({ username: checkUser.username, todos: userTodos })

        // here I will return array of todos only
        res.json(userTodos)

    } catch (err) {

        errorHandler(err, req, res);
    }

})





//  edit todo by id in paramater only if this todo belongs to this user
// validate by id in user token signature
todoRouter.patch('/:id', async (req, res) => {

    try {

        // get values from request body
        const { done, title, details } = req.body

        // get todo id from paramaters
        const { id } = req.params


        // check if id of user is the same of owner of todo
        const checkOwner = await todosModel.findOne({ _id: id }).exec();

        // check if user id is same of userId in token
        if (!(req.userId == checkOwner.userId)) throw Error("not user's todos");

        if (title && details) {

            const modifiedTodo = await todosModel.updateOne({ _id: id }, { title: title, details: details }).exec();


        }
        else {
            const modifiedTodo = await todosModel.updateOne({ _id: id }, { done }).exec();

        }


        res.statusCode = 200
        res.json({ Success: "todo modified successfully" })

    } catch (err) {

        errorHandler(err, req, res);
    }

})




//  delete todo by id in paramater only if this todo belongs to this user
// validate by id in user token signature
todoRouter.delete('/:id', async (req, res) => {

    try {

        // get todo id from paramaters
        const { id } = req.params

        // check if id of user is the same of owner of todo
        const checkOwner = await todosModel.findOne({ _id: id }).exec();

        // check if user id is same of userId in token
        if (!(req.userId == checkOwner.userId)) throw Error("you can't delete that todo because it is not yours")

        const deletedTodo = await todosModel.remove({ _id: id }).exec();


        res.statusCode = 200
        res.json({ Success: "todo delete successfully" })

    } catch (err) {

        errorHandler(err, req, res);
    }

})



// export todoRouter to be ued in other files
module.exports = todoRouter;