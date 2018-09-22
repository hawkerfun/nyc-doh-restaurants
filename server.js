var express = require('express');
var port = process.env.PORT || 3000;
var app = express(),
path = require('path'),
publicDir = path.join(__dirname,'public/dist/front-end');

var etlJobClass = require('./rest-api/etl.job').etlJob;
var etlJob = etlJobClass();

app.use(express.static(publicDir))

app.get('/run-etl', function (req, res) {

    if(etlJob.getStatus() === 'running') {
        res.send({message: "Etl Job is Already Running"});    
    }

    etlJob = etlJobClass();

    runner = etlJob.start();
    res.send('Etl job started');
});

app.get('/stop-etl', function (req, res) {
    runner = etlJob.stop();
    res.send({message: "Etl Job stopped"});
});

app.get('/get-etl-status', function (req, res) {
    res.send({etlStatus: etlJob.getStatus()});
});

app.get('/iscompleted-etl', function (req, res) {
    const longPoll = () => {
        setTimeout(() => {
            console.log(etlJob.getStatus());
            if(etlJob.getStatus() === 'stopped') {
                res.send({message: "Etl Job stopped"});
            } else {
                longPoll();
            }   
        },1000);
    }

    longPoll();

});

app.listen(port);
module.exports = app;
