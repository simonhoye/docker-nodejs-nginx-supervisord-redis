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
    console.log('err: ', JSON.stringify(err, null, 3))
    if (Array.isArray(err) && err.length) {
      console.error('400 Bad Request', 'Encountered errors', JSON.stringify(err, null, 3))
      return next(res.status(400).send({ error: err.join(', ') }))
    }
    // ...Save to redis...
    console.log('save: ', JSON.stringify(newRecord, null, 3))
    
    res.location(req.protocol + '://' + req.get('Host') + req.baseUrl + '/rewards/' + newRecord.id)
    res.status(201); // Created
    res.json(member)
  })
}

module.exports = { getForMember, postMember }