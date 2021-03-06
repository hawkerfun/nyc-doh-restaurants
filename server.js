var express = require('express');
var port = process.env.PORT || 3000;
var url = require('url')
var app = express(),
path = require('path'),
publicDir = path.join(__dirname,'public/dist/front-end');

var Restaurants = require('./rest-api/restaurantsDb').Restaurants();
var etlJobClass = require('./rest-api/etl.job').etlJob;
var etlJob = etlJobClass();

app.use(express.static(publicDir))

app.get('/run-etl', function (req, res) {

    if(etlJob.getStatus() === 'running') {
        res.send({message: "Etl Job is Already Running"});    
    }

    etlJob = etlJobClass();
    etlJob.start();
    res.send({message:'Etl job started'});
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

app.get('/count-proceeded-lines-etl', function(req, res) {
    res.send({telProceedeLines: etlJob.getProceedeLines()});        
});

app.get('/get-restaurants-longpoll', function(req, res) {
    const longPoll = () => {
        setTimeout(() => {
            Restaurants.getRestaturants('', 0, 'SCORE')
                .then((data) => {
                    if(!data.length) {
                        longPoll();    
                    } else {
                        res.send({restaurants: data});
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.send({message: err});   
                })  
        },1000);
    }

    longPoll();    
});

app.get('/trunkate-tables', function (req, res) {
    Restaurants.trunkateTables()
        .then(() => {
            res.send({message: 'Successfully Trunkated'});
        })
        .catch((err) => {
            console.log(err);
            res.send({message: err});   
        })


});

app.get('/get-restaurants', function (req, res) {
    const restaurantType = req.query.type || '';
    const pageIndex = req.query.pageIndex || 0;
    const orderBy = req.query.orderBy || 'SCORE';
    Restaurants.getRestaturants(restaurantType, pageIndex, orderBy)
        .then((data) => {
            //console.log(data);
            res.send({restaurants: data});
        })
        .catch((err) => {
            console.log(err);
            res.send({message: err});   
        })


});

app.listen(port);
module.exports = app;
