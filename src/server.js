const express = require('express'),
      http = require('http'),
      app = express(),
      cluster = require('cluster'),
      router = require('./routes')

if (cluster.isMaster) {
  // Fork for each CPU
  const cpuCount = require('os').cpus().length
  Array(cpuCount).fill(0).forEach(() => cluster.fork())
  // Replace the dead worker. Sorry Abe, we're not sentimental
  cluster.on('exit', worker => cluster.fork())
} else {
  // In the worker pid
  if ('dev' === process.env.NODE_ENV) {
    app.use((req,res,next)=>{
      console.log(req.method + ' ' + req.url)
      return next
    })
  }
  app.use('/', router);
  http.createServer(app).listen(process.env.PORT, () =>
    console.log('Listening on port ' + process.env.PORT)
  )
}