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

router.get('/fleet', function(req, res, next) {
    var data = {studentList: ["Johnson", "Mary", "Peter", "Chin-su"]};
    res.render('fleet', {students: data});
  })
  /*
router.get('/fleet', function(req, res, next) {
    res.render('fleet');
});*/

router.get('/vehicle', (req, res) => {
    res.render('vehicle', {title: 'Express'});
});

module.exports = router;