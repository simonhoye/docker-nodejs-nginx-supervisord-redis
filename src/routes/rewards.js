const redis = require('redis'),
      bluebird = require('bluebird'),
	    purchasesModel = require('../models/purchases'),
      Purchases = purchasesModel.Purchases,
	    memberModel = require('../models/member'),
      Member = memberModel.Member

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
const client = redis.createClient(6379, 'redis')

const getRewardsForMember = (req, res, next) => {
  let key = `checkouts${req.params.member_id}`
  return client.getAsync(key).then(checkouts => {
    if (parseInt(checkouts) >= 10) {
      let pkey = `purchases${req.params.member_id}`
      return client.getAsync(pkey).then(r => {
        client.set(key, 0)
        let purchases = new Purchases(JSON.parse(r))
        res.json({
          reward: purchases.rand()
        })
      })
    } else {
      res.json({
        reward: null,
        checkouts: checkouts
      })
      return next
    }
  })
}

const getPurchasesForMember = (req, res, next) => {
  let key = `purchases${req.params.member_id}`
  return client.getAsync(key).then(purchases => {
    res.json(JSON.parse(purchases))
  })
}

const putPurchases = (req, res, next) => {
  if (!Array.isArray(req.body) || !req.body.length) {
    console.log('400 Bad Request', req.body)
    return next.call({}, res.status(400).send({ error: '400 Bad Request' }))
  }
  
  return appendPurchases(req.params.member_id, req.body).then(list => {
    let counterKey = `checkouts${req.params.member_id}`
    client.incr(counterKey, err => {
      if(err) return next(err)
    })

    res.status(202) // Accepted
    res.json([...list])
  })
}

const appendPurchases = (memberId, newPurchases) => {
  let key = `purchases${memberId}`
  return client.getAsync(key).then(r => {
    let response = JSON.parse(r),
	      purchases = new Purchases(newPurchases)
    if (Array.isArray(response)) {
      purchases.union(response)
    }
    client.set(key, JSON.stringify([...purchases]))
    return purchases
  })
}

const postMember = (req, res, next) => {
  if (!req.body) {
    console.error('400 Bad Request')
    return next.call({}, res.status(400).send({ error: '400 Bad Request' }))
  }
  let newRecord = Member(req.body)
  return memberModel.validate(newRecord, (err, newMember) => {
    if (Array.isArray(err) && err.length) {
      res.status(400).send({ error: err.join(', ') })
      return next
    }
    newMember.created = +new Date
    let key = `member${newMember.id}`
    client.getAsync(key).then(res => {
      let member;
      if (res) {
        member = JSON.parse(res)
      }
      if ('object' !== typeof member) {
        member = Object.assign(newMember)
      }
      client.set(key, JSON.stringify(member))
      return newMember
	  }).then(member => {
	    return appendPurchases(member.id, member.items)
    }).then(savedPurchases => {
      let counterKey = `checkouts${newMember.id}`
      client.incr(counterKey, err => {
        if(err) return next(err)
      })
      res.status(201)
      res.json(newMember)
    })
  })
}

module.exports = { getRewardsForMember, getPurchasesForMember, postMember, putPurchases }