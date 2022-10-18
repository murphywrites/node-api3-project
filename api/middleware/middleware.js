const Users = require('../users/users-model')


function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} ${req.get('Origin')}`)
  next()
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const { id } = req.params
  console.log(id)
  Users.getById(id).then(user => {
  if (user) {
    req.user = user
    next()
  } else {
    res.status(404).json({message: "user not found"})
  }
}
).catch(err => {
  res.status(500).json({message: "there was really an error"})
})
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if(req.body.name) {
    console.log(req.body.name)
    next();
  } else {
    res.status(400).json({message: "missing required name field"})
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if(req.body.text) {
    next();
  } else {
    res.status(400).json({message: "missing required text field"})
  }
}


// do not forget to expose these functions to other modules

module.exports = {validateUserId, logger, validateUser, validatePost}


// - `validateUserId()`

//   - this middleware will be used for all user endpoints that include an `id` parameter in the url (ex: `/api/users/:id` and it should check the database to make sure there is a user with that id.
//   - if the `id` parameter is valid, store the user object as `req.user` and allow the request to continue
//   - if the `id` parameter does not match any user id in the database, respond with status `404` and `{ message: "user not found" }`

// - `validateUser()`

//   - `validateUser` validates the `body` on a request to create or update a user
//   - if the request `body` lacks the required `name` field, respond with status `400` and `{ message: "missing required name field" }`

// - `validatePost()`

//   - `validatePost` validates the `body` on a request to create a new post
//   - if the request `body` lacks the required `text` field, respond with status `400` and `{ message: "missing required text field" }`