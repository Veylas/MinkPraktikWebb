const express = require('express');
const authController = require('../controllers/auth');
const mssql = require("mssql");



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
            }
            vehicleList.push(vehicle);
        }
        res.render('fleet', {"vehicleList": vehicleList});
    })
})
})
var request = new mssql.Request();

router.get("/vehicle/:vehicleID", (req, res, next)=>{
var vehicleID = req.params.vehicleID
console.log(vehicleID);
    var vehicleDataList = [];
    request.query("select * from [dbo].[VehicleDatas] where vehicleID ="+vehicleID, (err, result) =>{
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
                    'vehicleID' :result.recordset[0].vehicleID
                }
                console.log(result.recordset)
                vehicleDataList.push(vehicleData);

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
router.post('/vehicle', function (req, res, next){
    var vehicleID = req.body.vehicleID;
    res.redirect("/vehicle/" + vehicleID)
});

router.get('/vehicle', (req, res) => {
    res.render('vehicle');
});

module.exports = router;