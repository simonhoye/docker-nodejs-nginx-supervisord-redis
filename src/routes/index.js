const express = require('express'),
      redis = require('redis'),
      client = redis.createClient(6379,'redis')

const router = module.exports = express.Router()

router.route('/')
	.get((req, res, next) => {
    client.incr('counter', (err, counter) => {
      if(err) return next(err)
      res.send('This page has been viewed ' + counter + ' times!')
    })
  })
