const express = require('express')
const userDB = require('./userDb')
const postDB = require('../posts/postDb')
const shortid = require('shortid')
const router = express.Router()

router.post('/', validateUser, (req, res) => {
    userDB.insert({name: req.body.name,
    id: req.body.id})
    .then(user => {
      if (user) {
        res.status(201).json({data: user})
      } else {
        res.status(400).json({message: 'aint gonna happen'})
      }
      
    })
    .catch(error => {
      res.status(500).json({ error: 'something went wrong', error})
  })
})

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  postDB.insert({
    text: req.body.text,
    user_id: req.params.id
  })
    .then(newPost => {
        res.status(201).json({ data: newPost })
    })
    .catch(error => {
    console.log(error)
    res.status(500).json({message: 'nope'})
  })
})

router.get('/', (req, res) => {
    userDB.get()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(error => {
        res.status(500).json({error: 'something went wrong', error})
      })
})

router.get('/:id', validateUserId, (req, res) => {
  userDB.getById(req.params.id)
  .then(users => {
    res.status(200).json(users)
  })
  .catch(error => {
    res.status(500).json({error: 'something went wrong', error})
  })
})

router.get('/:id/posts', validateUserId, (req, res) => {
  userDB.getUserPosts(req.params.id)
  .then(posts => {
    if (posts) {
        res.status(200).json(posts)
      } else {
        res.status(404).json({ message: 'Could not find posts by that user' })
      }
  })
  .catch(error => {
    res.status(500).json({message: "ain't happening", error})
  })
})

router.delete('/:id', validateUserId, (req, res,) => {
    userDB.remove(req.params.id)
    .then(deleted => {
      if (deleted) {
        res.status(200).json({success: 'the user has been deleted'})
      } else {
        res.status(400).json({ message: 'User could not be deleted' })
      }
    })
    .catch(error => {
    res.status(500).json({error: 'something went wrong', error})
  })
})

router.put('/:id', validateUser, validateUserId, (req, res) => {
  userDB.update(req.params.id, req.body)
  .then(user => {
    console.log(user)
    res.status(201).json({success: 'the user has been changed'})
  })
  .catch(error => {
    res.status(500).json({error: 'something went wrong', error})
  })
})

//custom middleware

function validateUserId(req, res, next) {
    userDB.getById(req.params.id)
      .then(user => {
        if (user) {
         req.user = user;
        next() 
        } else {
          res.status(400).json({error:'user cannot be found'})
          next()
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ message: "nope" })
      })
  }

function validateUser(req, res, next) {
  if (req.body.name) {
    next();
  } else {
    res.status(400).json({error: 'Missing user data'})
  }
}

function validatePost(req, res, next) {
  if (req.body.text) {
    next();
  } else {
    res.status(400).json({error: 'missing userdata'})
    next()
  }
}

module.exports = router