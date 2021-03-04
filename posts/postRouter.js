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

router.get('/:id', validatePostId(), (req, res) => {
  res.status(200).json({ data: req.post })
})

router.delete('/:id', validatePostId(), (req, res) => {
  postDB.remove(req.params.id)
    .then(deleted => {
      if (deleted) {
        res.status(200).json({success: 'the post has been deleted'})
      } else {
        res.status(400).json({ message: 'post could not be deleted' })
      }
    })
    .catch(error => {
    res.status(500).json({error: 'something went wrong', error})
  })
})

router.put('/:id', validatePostId(), (req, res) => {
  postDB.update(req.params.id, req.body)
  .then(user => {
    console.log(user)
    res.status(201).json({success: 'the post has been changed'})
  })
  .catch(error => {
    res.status(500).json({error: 'something went wrong', error})
  })
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
