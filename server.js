var express = require('express');
var port = process.env.PORT || 3000;
var app = express(),
path = require('path'),
publicDir = path.join(__dirname,'public/dist/front-end');

var etlJob = require('./rest-api/etl.job');

app.use(express.static(publicDir))

app.get('/run-etl', function (req, res) {
    runner = etlJob.start();
    res.send('Etl job started');
});

app.listen(port);
module.exports = app;
