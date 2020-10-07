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
router.get('/fleet', authController.isUserUser, authController.isUserUser, authController.fleet, (req, res, next) => {
    res.render('fleet')
});

// The router for vehicle is defined, now it can be used to get information to the page
router.get('/vehicle/:vehicleID', authController.isUserUser, authController.isUserUser, authController.vehicle, (req, res, next) => {
    res.render('vehicle')
});
module.exports = router;
/*
function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next() // pass the execution off to whatever request the client intended
    })
  }*/