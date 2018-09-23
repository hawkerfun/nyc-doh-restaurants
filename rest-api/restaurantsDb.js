'use strict';

const RestaurantDB = require('./lib/db.driver')().RestaurantDB,
    APP_CONF = require('../env/env').APP_CONF,
    Q = require('q');  

module.exports.Restaurants = () => {

    const RestauransDB = new RestaurantDB(APP_CONF.DB_CONF);

    const getRestaturantsByType = (restaurantType) => {

        return RestauransDB.getRestaturantsByType(restaurantType, 0, 20);
    }

    const getRestaturants = () => {
        return RestauransDB.getRestaturants(0, 20);
    }

    return {
        getRestaturants: getRestaturants,
        getRestaturantsByType: getRestaturantsByType
    }

}