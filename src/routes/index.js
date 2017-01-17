const express = require('express'),
	  jsonParser = require('body-parser').json(),
      redis = require('redis'),
	  client = redis.createClient(6379,'redis'),
      rewards = require('./rewards')

const router = module.exports = express.Router()

router.route('/')
    // GET /
	.get((req, res, next) => {
      client.incr('counter', (err, counter) => {
        if(err) return next(err)
        res.send('This page has been viewed ' + counter + ' times!')
      })
    })
    
router.route('/rewards/:member_id')
    // GET /rewards
    .get(rewards.getForMember)
    // POST /rewards
    .post(jsonParser, rewards.postMember)