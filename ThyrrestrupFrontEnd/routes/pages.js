const express = require('express');
const authController = require('../controllers/auth');
const mssql = require("mssql");
const { Result } = require('odbc');
//const { rows } = require('mssql');



const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});


var request = new mssql.Request();

router.get("/fleet", (req, res)=>{
request.query("select * from Vehicles", (err, result) =>{
    var vehicleList = [];
    if(err){
    console.log("failed to query for vehicles: " + err)
    res.sendStatus(500)
    return
    }
    var vehicleList = [];
        for (var i = 0; i < result.recordset.length; i++){
            
            var vehicle = {
                'vehicleID' :result.recordset[i].vehicleID,
                'type' :result.recordset[i].type,
                'powerBILink' :result.recordset[i].powerBILink,
                'personID' :result.recordset[i].personID,
            }
            vehicleList.push(vehicle);
        }
        
        res.render('fleet', {"vehicleList": vehicleList});
    })

})
var request = new mssql.Request();

router.get("/vehicle", (req, res)=>{
    var vehicleDataList = [];
    request.query("select * from [dbo].[VehicleDatas] where vehicleID = 8", (err, result) =>{
        if(err){
        console.log("failed to query for vehicles: " + err)
        res.sendStatus(500)
        return
        }
            for (var i = 0; i < result.recordset.length; i++){
                
                var vehicleData = {
                    'feedLevel' :result.recordset[i].feedLevel,
                    'fuelLevel' :result.recordset[i].fuelLevel,
                    'hydraulicPressure' :result.recordset[i].hydraulicPressure,
                    'hydraulicTemperature' :result.recordset[i].hydraulicTemperature,
                    'motorTemperature' :result.recordset[i].motorTemperature,
                    'motorSpeed' :result.recordset[i].motorSpeed,
                    'timeSinceHydService' :result.recordset[i].timeSinceHydService,
                    'timeSinceMotService' :result.recordset[i].timeSinceMotService,
                    'mechanicalMotorTimer' :result.recordset[i].mechanicalMotorTimer,
                    'motorRunTimerHour' :result.recordset[i].motorRunTimerHour,
                    'motorRunTimerMinutes' :result.recordset[i].motorRunTimerMinutes,
                    'nowTime' :result.recordset[i].nowTime,
                    'vehicleID' :result.recordset[i].vehicleID,

                    
                }
                
                vehicleDataList.push(vehicleData);
            }

            res.render('vehicle', {"vehicleDataList": vehicleDataList});
        })
    
    })
var config = ({
    server: process.env.DATABASE_HOST,
    //port: 1433,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_password,
    database: process.env.DATABASE

})
mssql.connect(config, function (err) {
    
    if (err) console.log(err);

})
/*router.get('/fleet', function (req, res) => {
    res.send('fleet'/*, {vehicle: vehicle);
});*/

router.get('/vehicle', (req, res) => {
    res.render('vehicle');
});

module.exports = router;