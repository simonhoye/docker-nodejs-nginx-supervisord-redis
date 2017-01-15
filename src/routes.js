const express = require('express')
const errors = require('express-api-server').errors
const jsonParser = require('body-parser').json()

const router = module.exports = express.Router()

router.route('/rewards')
    // GET /rewards
    .get((req, res, next) => {
        let rewards // ...Get resources from redis...
        res.json(rewards)
    })
    // POST /rewards
    .post(jsonParser, (req, res, next) => {
        if (!req.body) { return next(new errors.BadRequestError()) }

        // Validate JSON body using whatever method you choose
        var newReward = filter(req.body)
        if (!validate(newReward)) {
            req.log.error('Invalid reward body')
            return next(new errors.UnprocessableEntityError('Invalid reward resource body', {errors: validate.errors}))
        }

        // ...Save to redis...

        res.location(req.protocol + '://' + req.get('Host') + req.baseUrl + '/rewards/' + newReward.id)
        res.status(201); // Created
        res.json(newReward)
    })