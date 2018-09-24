'use strict';

const RestaurantDB = require('./lib/db.driver')().RestaurantDB,
    APP_CONF = require('../env/env').APP_CONF,
    Q = require('q');  

module.exports.Restaurants = () => {

    const RestauransDB = new RestaurantDB(APP_CONF.DB_CONF);

    const getRestaturants = (restaurantType, pageIndex, orderBy) => {

        return RestauransDB.getRestaturants(restaurantType, pageIndex, 20, orderBy);
    }

    const trunkateTables = () => {
        return Q.allSettled([
            RestauransDB.truncateViolations(),
            RestauransDB.truncateRest(),
            RestauransDB.truncateInspections()    
        ]);
    }

    return {
        getRestaturants: getRestaturants,
        trunkateTables: trunkateTables
    }

}