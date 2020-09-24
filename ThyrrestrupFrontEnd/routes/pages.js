const express = require('express');
const authController = require('../controllers/auth');
const mssql = require("mssql");



const router = express.Router();
// Here we get and render home page
router.get('/', (req, res) => {
    res.render('index');
});
router.get('/deleteMachine', (req, res) => {
    res.render('deleteMachine');
});
router.get('/createMachine', (req, res) => {
    res.render('createMachine');
});
router.get('/editMachine', (req, res) => {
    res.render('editMachine');
});
// Register page is rendered
router.get('/register', (req, res) => {
    res.render('register');
});
// login page is rendered
router.get('/login', (req, res) => {
    res.render('login');
});
// contact page is rendered
router.get('/contact', (req, res) => {
    res.render('contact');
});


var request = new mssql.Request();
// fleet is rendered
router.get("/fleet", (req, res)=>{
    var vehicleList = []; // the list for vehicles is initiated
    
    request.query("select * from Vehicles", (err, vehiclesResult) =>{
 if (err) {
    console.log("failed to query for vehicles: " + err)
    res.sendStatus(500)
    return
 }
// query all vehicles

request.query("SELECT vehicleID, max(timeSinceMotService) timeSinceMotService FROM VehicleDatas where vehicleID is not null or timeSinceMotService is not null group by vehicleID order by vehicleID", (err, result) =>{
    if(err){
    console.log("failed to query for vehicles: " + err)
    res.sendStatus(500)
    return
    }

    // The list is populated using result.recordset and then looping through all the results
        for (var i = 0; i < result.recordset.length; i++){
            var vehicle = {
                'vehicleID' :vehiclesResult.recordset[i].vehicleID,
                'type' :vehiclesResult.recordset[i].type,
                'powerBILink' :vehiclesResult.recordset[i].powerBILink,
                'personID' :vehiclesResult.recordset[i].personID,
                'timeSinceMotService' :result.recordset[i].timeSinceMotService       
            }
            vehicleList.push(vehicle); // everytime the loop goes thorugh one vehicle it wil be pushed to the list
        }
        res.render('fleet', {"vehicleList": vehicleList}); // here the fleet is rendered and sending the vehicle list with it
    })
})
})

var request = new mssql.Request();

// The router for vehicle is defined, now it can be used to get information to the page
router.get("/vehicle/:vehicleID", (req, res, next)=>{
var vehicleID = req.params.vehicleID
console.log(vehicleID);
var vehicleDataList = [];
    var alarms = []; // vehicleDataList is initiated
    request.query("SELECT * from Alarms where vehicleID="+vehicleID, (err, alarmsResult) =>{
        if (err) {
           console.log("failed to query for vehicles: " + err)
           return
        }
        else if (alarmsResult.recordset.length > 0){
            for (var i = 0; i < result.recordset.length; i++){
        var alarm = {
        'airFilterClog' :alarmsResult.recordset[0].airFilterClog,
        'fuelLevelAlarm' :alarmsResult.recordset[0].fuelLevelAlarm,
        'hydraulicOilLevelLow' :alarmsResult.recordset[0].hydraulicOilLevelLow,
        'hydraulicTempSensorFault' :alarmsResult.recordset[0].hydraulicTempSensorFault,
        'hydraulicTempTooHi' :alarmsResult.recordset[0].hydraulicTempTooHi,
        'hydraulicTempWarning' :alarmsResult.recordset[0].hydraulicTempWarning,
        'motorOilPressureLow' :alarmsResult.recordset[0].motorOilPressureLow,
        'motorTempSensorFault' :alarmsResult.recordset[0].hydraulicTempWarning,
        'motorTempTooHi' :alarmsResult.recordset[0].motorTempTooHi,
        'motorTempWarning' :alarmsResult.recordset[0].motorTempWarning,
        'hydraulicServiceNow' :alarmsResult.recordset[0].hydraulicServiceNow,
        'hydraulicServieWarning' :alarmsResult.recordset[0].hydraulicServieWarning,
        'motorServiceNow' :alarmsResult.recordset[0].motorServiceNow,
        'motorServiceWarning' :alarmsResult.recordset[0].motorServiceWarning,
        'stopOilPressureTooHi' :alarmsResult.recordset[0].stopOilPressureTooHi,
        'stopHydMotTemperatureTooHi' :alarmsResult.recordset[0].stopHydMotTemperatureTooHi,
        'timestamp' :alarmsResult.recordset[0].timestamp,
        'vehicleID' :alarmsResult.recordset[0].vehicleID
        }
        console.log("alarms"+alarm)
        alarms.push(alarm); 
    }
    } 
      request.query("select * from [dbo].[VehicleDatas] where vehicleID ="+vehicleID, (err, result) =>{
        // Here is the error handling of the query, if an error or no result happens code will run the if statement
        if(err || result.recordset.length < 1){
        console.log("failed to query for vehicles: " + err)
        res.sendStatus(500)
        return
        }
                var vehicleData = {
                    'feedLevel' :result.recordset[0].feedLevel,
                    'fuelLevel' :result.recordset[0].fuelLevel,
                    'hydraulicPressure' :result.recordset[0].hydraulicPressure,
                    'hydraulicTemperature' :result.recordset[0].hydraulicTemperature,
                    'motorTemperature' :result.recordset[0].motorTemperature,
                    'motorSpeed' :result.recordset[0].motorSpeed,
                    'timeSinceHydService' :result.recordset[0].timeSinceHydService,
                    'timeSinceMotService' :result.recordset[0].timeSinceMotService,
                    'mechanicalMotorTimer' :result.recordset[0].mechanicalMotorTimer,
                    'motorRunTimerHour' :result.recordset[0].motorRunTimerHour,
                    'motorRunTimerMinutes' :result.recordset[0].motorRunTimerMinutes,
                    'nowTime' :result.recordset[0].nowTime,
                    'vehicleID' :result.recordset[0].vehicleID,

                    // alarms is thrown into result here
                }
                console.log(result.recordset)
                vehicleDataList.push(vehicleData); // the vehicleData is pushed to the list "vehicleDataList"

            res.render('vehicle', {"vehicleDataList": vehicleDataList, "alarms": alarms}); // the vehicle page is rendered and sending the list with it
        })
    
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
// this post will post the vehicle ID if it is in the url
router.post('/vehicle', function (req, res, next){
    var vehicleID = req.body.vehicleID;
    res.redirect("/vehicle/" + vehicleID) 
});


module.exports = router;