const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model')
const Posts = require('../posts/posts-model')
// The middleware functions also need to be required
const {validateUserId, validateUser, validatePost} = require('../middleware/middleware')

const router = express.Router();


router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get().then(users => {
    res.status(200).json(users)
  }
    
  ).catch(err => {
    res.status(500).json({message: "there was an error"})
  }
  )
});

router.get('/:id', validateUserId , (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  const user = req.body;
  Users.insert(user).then(user => {
    res.status(200).json(user)
  })
    .catch(err => {
      res.status(500).json({message: "error bad"})})
});

router.put('/:id',validateUserId, validateUser, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.body).then(update => {
    res.status(201).json(update)
  }).catch(err => {
    res.status(500).json({message: "error bad"})
  })
});

router.delete('/:id',validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
 const deletedUser = await Users.getById(req.params.id)
  Users.remove(req.params.id).then(user => {
    res.status(200).json(deletedUser)
  }).catch(err => {
    res.status(500).json({message: "error bad"})
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Users.getUserPosts(req.params.id).then(posts => {
    res.status(200).json(posts)
  }).catch( err => {
    res.status(500).json({message: "error bad"})
  }
  )
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const post = req.body
  console.log(post)
  Posts.insert({...post, "user_id":req.params.id}).then(post => {
    res.status(200).json(post)
  }).catch(err => {
    res.status(500).json({message: "error bad"})
  }
  )
});

// do not forget to export the router
module.exports = router