const express = require('express');
const authController = require('../controllers/auth');
const mssql = require("mssql");
const { Result } = require('odbc');
//const { rows } = require('mssql');
var vehicleList = [];


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


router.get('/fleet', (req, res) => {
    console.log("dadsaw")
    res.end()
})

var request = new mssql.Request();


router.get("/vehicles", (req, res)=>{
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
            }
            console.log(result.recordset[i].vehicleID)
            vehicleList.push(vehicle);
        }
        res.render('fleet', {"vehicleList": vehicleList});
    })
console.log(vehicleList)

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
/*
router.get('/vehicle', (req, res) => {
    res.render('vehicle');
});*/

module.exports = router;