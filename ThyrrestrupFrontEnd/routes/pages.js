const express = require('express');

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
    res.render('fleet');
});

router.get('/vehicle', (req, res) => {
    res.render('vehicle');
});

module.exports = router;