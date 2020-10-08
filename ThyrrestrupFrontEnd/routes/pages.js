const express = require('express');
const authController = require('../controllers/auth');

const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const router = express.Router();


// Here we get and render home page
router.get('/', (req, res) => {
    res.render('index');
});
router.get('/deleteMachine/:vehicleID', authController.isUserOwner, authController.deleteMachine, (req, res, next) => {
    res.render('deleteMachine')
});
router.get('/createMachine', (req, res) => {
    res.render('createMachine');
});
router.get('/editMachine/:vehicleID', authController.isUserOwner, authController.editMachineLoad, (req, res, next) => {
    res.render('editMachine')
});

// Register page is rendered
router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/service/:vehicleID', authController.isUserOwner, authController.serviceLoad, (req, res, next) => {
    res.render('service')
});


// login page is rendered
router.get('/login', (req, res) => {
    res.render('login');
});


// contact page is rendered
router.get('/contact', function (req, res, next) {
    res.render('contact');
});

// fleet is rendered
router.get('/fleet', authController.isUserOrOwner, authController.fleet, (req, res, next) => {
    res.render('fleet')
});

// The router for vehicle is defined, now it can be used to get information to the page
router.get('/vehicle/:vehicleID', authController.isUserOrOwner, authController.vehicle, (req, res, next) => {
    res.render('vehicle')
});
module.exports = router;