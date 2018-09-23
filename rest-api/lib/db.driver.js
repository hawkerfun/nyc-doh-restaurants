
'use strict';

const   mysql = require('mysql'),
        Q = require('q');

let RestaurantDBInstance = null;        

module.exports = () => {
    class DBDriver {

        constructor(conf) {
            this.connection = mysql.createConnection(conf);
        }

        __insertMultyRecords(sql, records) {
            if (!records.length) {
                return Q(false);
            }

            const defer = Q.defer();

            this.connection.query(sql, [records], function(err) {
                if (err) {
                    this.dropConnection(); 
                    defer.reject(err);
                };

                return defer.resolve(true);
            });        

            return defer.promise;
        }

        __executeQuery(sql) {
            const defer = Q.defer();

            this.connection.query(sql, function(err, results, fields) {
                if (err) {
                    this.dropConnection(); 
                    defer.reject(err);
                };

                return defer.resolve(results);
            });        

            return defer.promise;
        }

        dropConnection() {
            this.connection.end();
        }

    }

    class RestaurantDB extends DBDriver {

        constructor(dbconfigs) {

            //If Singleton Already Initialized
            if (RestaurantDBInstance) {
                return RestaurantDBInstance;
            }

            super(dbconfigs);
            this.violationsTable = "Violations";
            this.inspectionTable = "Inspection";
            this.restTable = "Rest";

            RestaurantDBInstance = this;

            return RestaurantDBInstance;
        }

        getRestaturants(restaurantType, start, limit, orderBy) {
            let whereCondition = '';

            if (restaurantType) {
                whereCondition = `WHERE ${this.restTable}.CUISINE_DESCRIPTION = ${mysql.escape(restaurantType)} AND ${this.inspectionTable}.id IN
                (SELECT id FROM ${this.inspectionTable} WHERE ${this.inspectionTable}.GRADE <= 'B' AND ${this.inspectionTable}.GRADE <> ' ' AND ${this.inspectionTable}.GRADE_DATE <> ' ' GROUP BY  ${this.inspectionTable}.CAMIS Order by ${this.inspectionTable}.GRADE_DATE DESC)`;
            }

            const sql = `SELECT ${this.restTable}.CAMIS, ${this.restTable}.DBA, ${this.restTable}.BUILDING, ${this.restTable}.STREET, ${this.restTable}.BORO, ${this.restTable}.ZIPCODE, ${this.restTable}.PHONE, ${this.inspectionTable}.GRADE, ${this.inspectionTable}.SCORE, ${this.inspectionTable}.GRADE_DATE
                        FROM ${this.restTable}
                        
                        Left Join ${this.inspectionTable}
                            ON ${this.inspectionTable}.CAMIS = ${this.restTable}.CAMIS
                        
                        ${whereCondition}    
                            
                        GROUP BY ${this.inspectionTable}.CAMIS, ${this.inspectionTable}.id 

                        Order by ${this.inspectionTable}.${orderBy} ${orderBy == 'GRADE' ? '' : 'DESC' }
                        LIMIT ${start}, ${limit};`

            return this.__executeQuery(sql);
        }

        truncateViolations() {
            const sql = `TRUNCATE TABLE ${this.violationsTable}`
            return this.__executeQuery(sql);
        }

        truncateRest() {
            const sql = `TRUNCATE TABLE ${this.restTable}`
            return this.__executeQuery(sql);
        }

        truncateInspections() {
            const sql = `TRUNCATE TABLE ${this.inspectionTable}`
            return this.__executeQuery(sql);
        }

        insertViolations(violations) {
            const sql = `INSERT INTO ${this.violationsTable} (VIOLATION_CODE, VIOLATION_DESCRIPTION) VALUES ?`;
            return this.__insertMultyRecords(sql, violations);
        }

        insertInspections(inspections) {
            const sql = `INSERT INTO ${this.inspectionTable} (CAMIS, INSPECTION_DATE, ACTION, VIOLATION_CODE, CRITICAL_FLAG, SCORE, GRADE, GRADE_DATE, RECORD_DATE, INSPECTION_TYPE) VALUES ?`;
            return this.__insertMultyRecords(sql, inspections);
        }

        insertResturants(restaurants) {
            const sql = `INSERT INTO ${this.restTable} (CAMIS, DBA, BORO, BUILDING, STREET, ZIPCODE, PHONE, CUISINE_DESCRIPTION) VALUES ?`;
            return this.__insertMultyRecords(sql, restaurants);
        }


    }

    return {
        RestaurantDB: RestaurantDB
    };
}