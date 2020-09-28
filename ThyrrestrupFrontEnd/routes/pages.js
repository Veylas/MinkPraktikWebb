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
// fleet is rendered
router.get('/fleet', authController.fleet);

// The router for vehicle is defined, now it can be used to get information to the page
router.get("/vehicle/:vehicleID", authController.vehicle)

// this post will post the vehicle ID if it is in the url



module.exports = router;