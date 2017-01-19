const express = require('express'),
      bodyParser = require('body-parser'),
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
  .get(rewards.getRewardsForMember)
  // POST /rewards
  .post(bodyParser.json(), rewards.postMember)

router.route('/purchases/:member_id')
  // GET /purchases
  .get(rewards.getPurchasesForMember)
  // PUT /purchases
  .put(bodyParser.json(), rewards.putPurchases)