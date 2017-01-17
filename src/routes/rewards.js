const redis = require('redis'),
	  client = redis.createClient(6379,'redis'),
      memberModel = require('../models/member'),
      Member = memberModel.Member

const getForMember = (req, res, next) => {
  let rewards = client.get(req.params.member_id)
      res.json(rewards)
}

const postMember = (req, res, next) => {
  if (!req.body) {
      console.error('400 Bad Request')
      return next(res.status(400).send({ error: '400 Bad Request' }))
  }
  var newRecord = Member(req.body)
  return memberModel.validate(newRecord, (err, member) => {
    if (Array.isArray(err) && err.length) {
      return next(res.status(400).send({ error: err.join(', ') }))
    }
    // ...Save to redis...
    res.location(req.protocol + '://' + req.get('Host') + req.baseUrl + '/rewards/' + newRecord.id)
    res.setHeader('Content-Type', 'application/json');
    res.status(201); // Created
    res.json(JSON.stringify(member, null ,3))
  })
}

module.exports = { getForMember, postMember }