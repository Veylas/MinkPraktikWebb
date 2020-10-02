const express = require('express');
const authController = require('../controllers/auth');


const router = express.Router();

// Here we get and render home page
router.get('/', (req, res) => {
    res.render('index');
});
router.get('/deleteMachine/:vehicleID', authController.deleteMachine);

router.get('/createMachine', (req, res) => {
    res.render('createMachine');
});
router.get('/editMachine/:vehicleID', authController.editMachineLoad);

// Register page is rendered
router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/service/:vehicleID', authController.serviceLoad);



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
router.get('/vehicle/:vehicleID', authController.vehicle)


module.exports = router;