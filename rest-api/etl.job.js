'use strict';

const EtlRunner = require('./lib/etl.runner')().EtlRunner,
    RestaurantDB = require('./lib/db.driver')().RestaurantDB,
    APP_CONF = require('../env/env').APP_CONF,
    Q = require('q');  

module.exports.etlJob = () => {

    const RestauransDB = new RestaurantDB(APP_CONF.DB_CONF),
        ETL = new EtlRunner(APP_CONF.CSV_UR);

    const start = () => {

        ETL.startJob(5000, (restaurantsInserts, violationInserts, inspectionInserts) => {
            let promises = [];

            promises.push(RestauransDB.insertResturants(restaurantsInserts));    
            promises.push(RestauransDB.insertInspections(inspectionInserts));   
            promises.push(RestauransDB.insertViolations(violationInserts));
            
            return Q.allSettled(promises);  
        });

        return true;
    }

    const stop = () => {
        ETL.stopJob();    
    }

    return {
        start: start,
        stop: stop,
        getStatus: () => ETL.getStatus()
    }

}