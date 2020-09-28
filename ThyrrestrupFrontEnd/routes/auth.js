const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

// in this routes the posts are defined, these will take whatever the user's input and send it further to the register function in the auth controller
router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/deleteMachine', authController.deleteMachine);

router.post('/editMachine', authController.editMachine);

router.post('/createMachine', authController.createMachine);

router.post('/fleet', function (req, res) {authController.fleet});

router.post('/vehicle', function (req, res, next){
    var vehicleID = req.body.vehicleID;
    res.redirect("/vehicle/" + vehicleID) 
});

module.exports = router;