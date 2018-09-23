'use strict';

const   es = require('event-stream'),
        request = require('request'),
        papaparse = require('papaparse');


module.exports = () => {

    class EtlRunner {

        constructor(source_path) {
            this.dataSource = source_path;
            this.stream = null;
            this.linesTransformed = 0;

            this.restauransCAMIS = [];
            this.violationCodes = [];
            this.inspectionsHistory = [];

            this.isCompleted = false;
            this.etlStatus = 'stopped';
        }

        /*get inCompleted() {
            return this.inCompleted;
        }
        set inCompleted(value) {
            this.inCompleted = value;
        }*/

        getStatus() {
            return this.etlStatus;
        }

        isCompleted() {
            return this.isCompleted;    
        }

        __parseCSVLine(csvLine) {
            const parsedLine = papaparse.parse(csvLine);
            const data = parsedLine.data[0];
            
            if(this.linesTransformed && data) {

                return data;

                /*this.__addNewRestaurant(data, restaurantsInserts);
                this.__addNewViolationCode(data, violationInserts);
                this.__addNewViolationCode(data, inspectionInserts);*/
                /*return {
                    "parsedRestaurant" : this.__addNewRestaurant(data),
                    "parsedViolation" : this.__addNewViolationCode(data),  
                    "parsedInspection" : this.__addNewInspection(data)   
                }*/
            }

            return null;
        }

        __previoslySavedItem(entityName, value) {
            if (this[entityName].indexOf(value) === -1) {
                this[entityName].push(value);
                return false
            }

            return true;
        }

        __addNewRestaurant(prasedLine, restaurants) {
            const restaurantsInserts = restaurants.slice(); //let's make it imutable;
            if (this.__previoslySavedItem('restauransCAMIS', prasedLine[0])) {
                const restaurantData = [
                    prasedLine[0] ? prasedLine[0] : null,
                    prasedLine[1] ? prasedLine[1] : null,
                    prasedLine[2] ? prasedLine[2] : null,
                    prasedLine[3] ? prasedLine[3] : null,
                    prasedLine[4] ? prasedLine[4] : null, 
                    prasedLine[5] ? prasedLine[5] : null,  
                    prasedLine[6] ? prasedLine[6] : null,
                    prasedLine[7] ? prasedLine[7] : null
                ];
                restaurantsInserts.push(restaurantData);
                //this.restauransCAMIS.push(data[0]);    
            }

            return restaurantsInserts;
        }

        __addNewViolationCode(prasedLine, violations) {
            const violationInserts = violations.slice(); //let's make it imutable;
            let violation_code = prasedLine[10] ? prasedLine[10] : null;
            if(this.__previoslySavedItem('violationCodes', violation_code)) {
                const violationData = [
                    violation_code,
                    prasedLine[11] ? prasedLine[11] : null
                ];

                violationInserts.push(violationData);    
            }

            return violationInserts;
        }

        __addNewInspection(prasedLine, inspections) {
            const inspectionInserts = inspections.slice(); //let's make it imutable;
            inspectionInserts.push([
                prasedLine[0] ? prasedLine[0]: null,
                prasedLine[8] ? prasedLine[8] : ' ',
                prasedLine[9] ? prasedLine[9] : ' ',
                prasedLine[10] ? prasedLine[10] : null,
                prasedLine[12] ? prasedLine[12] : ' ',
                !isNaN(parseInt(prasedLine[13], 10)) ? parseInt(prasedLine[13], 10) : 0,
                prasedLine[14] ? prasedLine[14] : ' ',
                prasedLine[15] ? prasedLine[15] : ' ',
                prasedLine[16] ? prasedLine[16] : ' ',
                prasedLine[17] ? prasedLine[17] : ' ' 
            ]);

            return inspectionInserts;  
        }

        initStream() {
            return request.get(this.dataSource); 
        }

        resumeStream() {
            this.stream.resume();    
        }

        pauseStream() {
            this.stream.pause();    
        }
        

        transform(numRows, insertItems) {
            let restaurantsInserts = [];
            let violationInserts = [];
            let inspectionInserts = [];

            return es.mapSync( line => {
                
                const parsedCsvLine = this.__parseCSVLine(line);

                if (parsedCsvLine) {

                    restaurantsInserts = this.__addNewRestaurant(parsedCsvLine, restaurantsInserts);
                    violationInserts = this.__addNewViolationCode(parsedCsvLine, violationInserts);
                    inspectionInserts = this.__addNewInspection(parsedCsvLine, inspectionInserts);
                }

                if(this.linesTransformed > 20000) {
                    this.isCompleted = true;
                    this.etlStatus = 'stopped';
                    this.stream.destroy();
                }

                if (!(++this.linesTransformed % numRows)) {
                
                    this.pauseStream();

                    insertItems(restaurantsInserts, violationInserts, inspectionInserts)
                        .then(() => {
                            restaurantsInserts = [];
                            violationInserts = [];
                            inspectionInserts = [];

                            console.log("Inserted ", this.linesTransformed);
                            this.resumeStream();
                        })
                        .catch((err) => {
                            throw err
                        });

                }
            }).on('end', function(){
                console.log('Read entire file.');
                this.isCompleted = true;
                this.etlStatus = 'stopped';
            })
            .on('close', function (err) {
                console.log('Stream has been destroyed and file has been closed');
            });    
        }

        startJob(numRows, insertItems) {
            this.etlStatus = 'running';
            this.stream = this.initStream()
                .pipe(es.split())
                .pipe(this.transform(numRows, insertItems));    
        }

        stopJob() {
            this.isCompleted = true;
            this.etlStatus = 'stopped';
            this.stream.destroy();    
        }

        getProceedeLines() {
            return this.linesTransformed;
        }


    }
    
    return {
        EtlRunner: EtlRunner
    }
}