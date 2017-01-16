const redis = require('redis'),
	  client = redis.createClient(6379,'redis'),
      validate = require('./validators'),
      hydrate = require('./hydrators')

const getForMember = (req, res, next) => {
  let rewards = client.get(req.body.member_id)
      res.json(rewards)
}

const postMember = (req, res, next) => {
  if (!req.body) { return next(new errors.BadRequestError()) }

  // Validate JSON body using whatever method you choose
  var newReward = hydrate.member(req.body)
  if (!validate.member(newReward)) {
    req.log.error('Invalid reward body')
    return next(new errors.UnprocessableEntityError('Invalid reward resource body', {errors: validate.errors}))
  }

  // ...Save to redis...

  res.location(req.protocol + '://' + req.get('Host') + req.baseUrl + '/rewards/' + newReward.id)
  res.status(201); // Created
  res.json(newReward)
}

module.exports = { getForMember, postMember }