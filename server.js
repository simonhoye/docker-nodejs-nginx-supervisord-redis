const express = require('express'),
    http = require('http'),
    redis = require('redis'),
    app = express(),
    cluster = require('cluster'),
    notifier = require('node-notifier')

if (cluster.isMaster) {

  const cpuCount = require('os').cpus().length
  Array(cpuCount).fill(0).forEach(()=>cluster.fork())
  // Replace the dead worker. Sorry Abe, we're not sentimental
  cluster.on('exit', worker => cluster.fork())

} else {
  const client = redis.createClient(6379,'redis')
  app.get('/', (req, res, next) =>
    client.incr('counter', (err, counter) => {
      if(err) return next(err)
      res.send('This page has been viewed ' + counter + ' times!')
    })
  )

  http.createServer(app).listen(process.env.PORT, () =>
    console.log('Listening on port ' + process.env.PORT)
  )

}