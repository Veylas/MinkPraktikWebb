const express = require("express");
const path = require('path');
const mssql = require("mssql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
var bodyParser = require("body-parser"); 

dotenv.config({ path: './.env'})

const app = express();

var config = ({
    server: process.env.DATABASE_HOST,
    //port: 1433,
    database: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_password
    //Trusted_Connection: false
    //Encrypt=True

    /*host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_password,
    database: process.env.DATABASE*/

});

/*mssql.connect(config, function (err) {
    
    if (err) console.log(err);
})*/
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(cookieParser());

console.log(__dirname);

//app.set('view engine', 'pug');
app.set('view engine', 'hbs');

//app.set('view engine', 'pug');




mssql.connect(config, function (error) {
    if(error) {
        console.log(error)
    } else {
        console.log("MsSQL Connected...")
    }
})


//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen("3000", ()=>{
    console.log("Server started on port 3000");
})