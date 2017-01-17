const express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    app = express(),
    cluster = require('cluster'),
    notifier = require('node-notifier'),
    router = require('./src/routes')

if (cluster.isMaster) {

  const cpuCount = require('os').cpus().length
  Array(cpuCount).fill(0).forEach(()=>cluster.fork())
  // Replace the dead worker. Sorry Abe, we're not sentimental
  cluster.on('exit', worker => cluster.fork())

} else {
  app.use('/', router);
  app.use(bodyParser.json())
  http.createServer(app).listen(process.env.PORT, () =>
    console.log('Listening on port ' + process.env.PORT)
  )

}