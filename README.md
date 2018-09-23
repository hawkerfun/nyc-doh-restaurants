Welcome to ETL Solution for NYC DOH Restaurants
==================================================

This project is build regarding Inteview task ETL Job and Search in proceeded data of NYC DOH Restaurants.

NOTE: Pardon for typos.

What's Technologies Behind
----------
This project was build by using folowing technologies:

* Node.js, Express - as back-end service and ETL Job runner
* Angular 6 - as Front-end
* AWS RDS MySQL - as Data store
* AWS CodeBuild - as CI tool for Continues Delivery [file: buildspec.yml]
* AWS CodePipeLine - as CI Archistration tool for Continueus Delivery
* AWS BeanStalk - as Application host service [file: template.yml]


What's Here
-----------
* .ebextensions/ - this directory contains the configuration files that
  AWS Elastic Beanstalk will deploy
* buildspec.yml - this file is used by AWS CodeBuild to package your project.
* package.json - this file contains various metadata relevant to your Node.js
  application such as dependencies
* server.js - this file contains the code for your Express application
* public/ - this directory contains compiled Angular App
* tests/ - this directory contains unit tests
* template.yml - this file contains the description of AWS resources used by AWS
  CloudFormation to deploy your infrastructure


Start Locally
---------------

1. Install Node.js on your computer.  For details on available installers visit
   https://nodejs.org/en/download/.

2. Install NPM dependencies:

        $ npm install

3. Build Front-End Application:

        $ npm run-script build-front-end

4. Start the development server:

        $ npm start        

5. Open http://127.0.0.1:3000/ in a web browser to view your application.

Solutions
------------------

### *Implemented Solution*

This ptoject was build by following below architecture:
![AWS_ETL_Solution](https://s3.amazonaws.com/aws-codestar-us-east-1-363614408566-nyc-doh-restaur-pipe/architecture/AWS_ETL_Solution.png)

The point of this task is to examinate skills of wed development, that solution was selected since it requires build ETL job from scratch. This architecture contans EC2 instance that host NodeJs app and RDS MySQL data store for procedded data. 

### *DataBase Schema*
For data store there were selected AWS RDS service with MySQL server. [db.t2.micro]

The Database schema is following:
![DB_Schema](https://s3.amazonaws.com/aws-codestar-us-east-1-363614408566-nyc-doh-restaur-pipe/architecture/DB_schema.png)

* Restaurants Table contains all unique restaurants info, such as Name[DBA], Unique ID [CAMIS], Address data and Phone. 
* Inspections Tbale contains all information regarding inspections, such as Grade, Score, Dates, Violation Codes. It contains all inspections, so we can build the history of inspections, since each inspection is related to Restaturants table through `CAMIS` field. So it One[Restaurants] to Many[Inspections] relationship
* Violations Table contains all information regarding violation information. It place as a separe table for Inspections table optimization and remove data duplication. It has One[Violations] to Many[Inspections] relationship.

###### Top 10 Thai restaurants SQL query

In order to get all top 10 Thai restarants from Database, we can execute this equery. 

```
select Rest.DBA, Rest.BUILDING, Rest.STREET, Rest.BORO, Rest.ZIPCODE, Rest.PHONE, Inspection.GRADE, Inspection.SCORE, Inspection.GRADE_DATE 
FROM  Rest

Left Join Inspection
ON Inspection.CAMIS = Rest.CAMIS

WHERE Rest.CUISINE_DESCRIPTION = 'Thai' AND Inspection.id IN
(SELECT id FROM Inspection WHERE Inspection.GRADE <= 'B' AND Inspection.GRADE <> ' ' AND Inspection.GRADE_DATE <> ' ' GROUP BY Inspection.CAMIS Order by Inspection.GRADE_DATE DESC)

GROUP BY Rest.CAMIS

Order by Inspection.SCORE DESC

LIMIT 0, 10;
```

**However you can test this queries on Front-End App with diferent parameters**

For example type `Thai` or `Pizza` or `American` or `Russian` for Restaurant type. 

### *CI PipeLine and Monitoring*

This application is hosted by AWS Elastic BeanStalk and uses AWS CodeBuild for run all Unit Tests and AWS CodeDeploy for deploy archistration.

![CodeDeployScreen.png](https://s3.amazonaws.com/aws-codestar-us-east-1-363614408566-nyc-doh-restaur-pipe/architecture/CodeDeployScreen.png)

### *Alternative Solutions*

###### Serverless solution with AWS Glue

As alternative solution we can use AWS Glue service as ETL job worker, that will analyze csv file, generate ETL job code and will host ETL Job process. For data store was selected AWS DynamoDb with global secondary index on properties for optimized serch queries
![AWS_ETL_Solution](https://s3.amazonaws.com/aws-codestar-us-east-1-363614408566-nyc-doh-restaur-pipe/architecture/AWS_Glue_ETL_Solution.png)

###### Serverless solution without AWS Glue

Alternative solution 2 is different from previous by removing AWS Glue service. Etl job runner is designed by microservice using Lambda Functions. Since Lambda will be hostin ETL proccess, it will require long execution time for lamdas (which is coast effective) and will require to incrise Write Copacity Units for DynamoDB table, that will increase price for DynamoDB.  

![AWS_ETL_Solution](https://s3.amazonaws.com/aws-codestar-us-east-1-363614408566-nyc-doh-restaur-pipe/architecture/AWS_ETL_Solution_Serverless.png)

If this architecture will be implemented with DynamoDB table, by folowing schema
```
  Restaurants:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: Restaurants
      AttributeDefinitions:
        - AttributeName: ID
          AttributeType: S
        - AttributeName: CUISINE_DESCRIPTION
          AttributeType: S
        - AttributeName: GRADE
          AttributeType: S 
        - AttributeName: SCORE
          AttributeType: N          
      KeySchema:
        - AttributeName: ID
          KeyType: HASH
        - AttributeName: SCORE
          KeyType: RANGE  
      ProvisionedThroughput:
        ReadCapacityUnits: 1
        WriteCapacityUnits: 1700
      GlobalSecondaryIndexes: 
        - 
          IndexName: "RestaurantTypeIndex"
          KeySchema: 
            - 
              AttributeName: "CUISINE_DESCRIPTION"
              KeyType: "HASH"
            - 
              AttributeName: "GRADE"
              KeyType: "RANGE"
          Projection: 
            ProjectionType: "ALL"
          ProvisionedThroughput: 
            ReadCapacityUnits: "1"
            WriteCapacityUnits: "200" 
```
The table will allow to make write request for 1700 per second, which will take around 5 minutes for 500K item inserts. The price for this table will be `$919.04 / month` which is `$0.25` per each $500k inserts. So that's wy this solution doesn't worth implementation.

