const express = require('express');
const postDB = require('./postDb')
const router = express.Router();

router.get('/', (req, res, next) => {
    postDB.get()
    .then(post => {
        if (post) {
        res.status(200).json({ data: post })
      } else {
        res.status(404).json({ message: 'Could not retrieve posts' })
      }
    })
    .catch(error => {
        next(error)
    })
})

router.get('/:id', validatePostId(), (req, res, next) => {
  res.status(200).json({ data: req.post })
})

router.delete('/:id', validatePostId(), (req, res, next) => {
  const deletePost = postDB.remove(req.params.id)
  if (deletePost) {
    res.status(200).json({ data: deletePost })
  } else {
    res.status(400).json({ message: 'Post could not be deleted' })
  }
})

router.put('/:id', validatePostId(), (req, res, next) => {
  if (req.body.text) {
    const editPost = postDB.update(req.params.id, req.body)
    res.status(201).json({ data: editPost })
  } else {
    res.status(400).json({ message: 'Please provide a valid input' })
  }
})

// custom middleware

function validatePostId() {
  return (req, res, next) => {
    postDB.getById(req.params.id)
      .then(post => {
        if (post) {
          req.post = post
          next()
        } else {
          res.status(404).json({message: 'Post by the ID not found'})
        }
      })
      .catch(next)
  }
}

module.exports = router;
