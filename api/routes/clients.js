const express = require('express')
const createError = require('http-errors')

const Client = require('../db').Client

const router = express.Router()
router.use('/:client_id/projects', require('./projects'))

router.param('client_id', (req, res, next, client_id) => {
  Client.findById(client_id)
    .then(doc => {
      if (doc){
        req.client = doc
        next()
      }
      else {
        next(createError(404))
      }
    })
    .catch(err => next(err))
})

router.get('/', (req, res, next) => {
  Client.find({})
    .then(docs => res.json(docs))
    .catch(err => next(err))
})

router.get('/:client_id', (req, res, next) => {
  res.json(req.client)
})

router.post('/', (req, res, next) => {
  new Client(req.body.client).save()
    .then(doc => res.json(doc))
    .catch(err => next(err))
})

router.put('/:client_id', (req, res, next) => {
  Object.assign(req.client, req.body.client)

  req.client.save()
    .then(doc => res.json(doc))
    .catch(err => next(err))
})

router.delete('/:client_id', (req, res, next) => {
  Client.findOneAndRemove(req.client._id)
    .then(doc => res.json(doc))
    .catch(err => next(err))
})

module.exports = router

