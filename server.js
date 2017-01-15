const express = require('express'),
    http = require('http'),
    redis = require('redis'),
    app = express()

const client = redis.createClient(
    process.env.REDIS_PORT,
    'redis'
)

app.get('/', (req, res, next) =>
  client.incr('counter', (err, counter) => {
    if(err) return next(err)
    res.send('This page has been viewed ' + counter + ' times!')
  })
)

http.createServer(app).listen(process.env.EXPRESS_PORT, () =>
  console.log('Listening on port ' + (process.env.EXPRESS_PORT))
)