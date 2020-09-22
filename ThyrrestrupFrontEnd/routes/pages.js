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
    var vehicleList = [];
    
    request.query("SELECT vehicleID, max(timeSinceMotService) timeSinceMotService FROM VehicleDatas group by vehicleID", (err, bongo) =>{
 if (err) {
    console.log("failed to query for vehicles: " + err)
    res.sendStatus(500)
    return
 }

 //var pong = bong.recordset


request.query("select * from Vehicles", (err, result) =>{
    if(err){
    console.log("failed to query for vehicles: " + err)
    res.sendStatus(500)
    return
    }
    
        for (var i = 0; i < result.recordset.length; i++){
            var vehicle = {
                'vehicleID' :result.recordset[i].vehicleID,
                'type' :result.recordset[i].type,
                'powerBILink' :result.recordset[i].powerBILink,
                'personID' :result.recordset[i].personID,
                'timeSinceMotService' :bongo.recordset[i].timeSinceMotService
               // 'timeSinceMotService' : result.recordset[i].timeSinceMotService
               //'timeSinceMotService' :"SELECT MAX(timeSinceMotService) FROM VehicleDatas WHERE VehicleID ="+result.recordset[i].vehicleID 
           
            }
            //console.log(result.recordset[1].timeSinceMotService)
           //console.log(result.recordset)
            vehicleList.push(vehicle);
        }

        //console.log(bongo.recordset.columns)
        res.render('fleet', {"vehicleList": vehicleList});
    })
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