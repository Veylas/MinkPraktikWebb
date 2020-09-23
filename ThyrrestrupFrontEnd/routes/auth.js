const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/fleet', function (req, res) {authController.fleet});

router.post('/vehicle', function (req, res, next) {authController.fleet
    var vehicleID = req.body.vehicleID;
    res.redirect("/vehicle/" + vehicleID)
});

module.exports = router;