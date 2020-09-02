const express = require('express');
const userDB = require('./userDb')
const postDB = require('../posts/postDb')
const router = express.Router();

router.post('/', validateUser(), (req, res, next) => {
  userDB.insert(req.body)
  .then(postUser => {
     if (postUser) {
        res.status(201).json({data: postUser})
      } else {
        res.status(400).json({ message: 'User coul not be created.'})
      }
  })
  .catch (error => {
    next(error) 
  })  
});

router.post('/:id/posts', validateUserId(), validatePost(), (req, res) => {
    postDB.insert(req.body)
    .then(newPost => {
      res.status(201).json({ data: newPost })
    })
    .catch (error => {
      console.log(error)
      res.status(500).json({message: 'could not do it'})
  })
})

router.get('/', (req, res, next) => {
  userDB.get()
  .then(users => {
    if (users) {
      res.status(200).json({ data: users })
    } else {
      res.status(404).json({ message: 'Could not retrieve users' })
    }
  })
  .catch (error => {
    next(error)
  })
})

router.get('/:id', validateUserId(), (req, res, next) => {
  if (req.user) {
    res.status(200).json({ data: req.user })
  } else {
    res.status(404).json({ message: 'User by that ID could not be found' })
  }
})

router.get('/:id/posts', validateUserId(), (req, res, next) => {
  const posts = userDB.getUserPosts(req.params.id)
  if (posts) {
    res.status(200).json({ data: posts })
  } else {
    res.status(404).json({ message: 'Could not find posts by that user' })
  }
})

router.delete('/:id', validateUserId(), (req, res, next) => {
    userDB.remove(req.params.id)
    .then(deleted => {
      if (deleted) {
        res.status(200).json({ data: user })
      } else {
        res.status(400).json({ message: 'User could not be deleted' })
      }
    })
    .catch (error => {
      next(error)
    })
})

router.put('/:id', validateUserId(), validateUser(), (req, res, next) => {
  const id = req.params.id
  userDB.update(id, req.body)
  .then(updatedUser => {
    res.status(201).json({ data: updatedUser })
  })
  .catch (error => {
    next(error)
  })
})

//custom middleware

function validateUserId() {
  return (req, res, next) => {
    userDB.getById(req.params.id)
      .then(user => {
        req.user = user
        next()
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ message: "invalid user id" })
      })
  }
}

function validateUser() {
  return (req, res, next) => {
    postDB.get()
    .then(req => {
        if (req.body) {
        req.body = req.body
        next()
      } else if (!req.name) {
        res.status(400).json({ message: "missing user data" })
      } else {
        res.status(400).json({ message: "missing required name field" })
      }
    })
    .catch(error => {
      console.log(error)
    })
  }
}

function validatePost() {
  return (req, res, next) => {
    postDB.get()
    .then(req => {
      if (req.body.text && req.body) {
        req.body = req.body
        next()
      } else if (!req.body) {
        res.status(400).json({ error: "Missing post data" })
      } else if (!req.body.text) {
        res.status(400).json({ message: "Missing required text field" })
      }
    })
    .catch (error => {
      next(error)
    })
  }
}


module.exports = router;
