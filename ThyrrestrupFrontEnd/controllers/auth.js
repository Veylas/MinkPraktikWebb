const mssql = require("mssql");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


var request = new mssql.Request();

// Database connection is defined here, this will take the information from the ".env" file, if another database is wanted it should be changed in the env file
var config = ({
    server: process.env.DATABASE_HOST,
    //port: 1433,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_password,
    database: process.env.DATABASE

});
mssql.connect(config, function (err) {
    
    if (err) console.log(err);

})

    exports.login = async (req, res) => {
        try{
            const {email, password} = req.body;
            if( !email || !password ) {
                return res.status(400).render('login', {
                    message: 'Please provide an email and password' // message is sent to html where it will handle it and show it
                })
            }
            
           // This query is for login and will check if the email exists in a user
            request.query("Select * FROM Persons WHERE email =('"+email+"')", async (error, results) => {

                      // here we have error handling for the query
                if(!results.recordset[0] || !(await bcrypt.compare(password, (results.recordset[0].password)) ) ){
                    res.status(401).render('login', {
                        message: 'Email or Password is incorrect' // message is sent to html where it will handle it and show it
                    })
                    
                    // if there's no error and both password and email is correct it will go in this else statement
                } else {
                    var id = results.recordset[0].id;
                    console.log(results.recordset[0].password)
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    })

                    console.log("The token is:" + token);

                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookieOptions);
                    res.status(200).redirect("/");
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    exports.register = async (req, res) => {
    console.log(req.body);
    
    const { name, email, password, passwordConfirm } = req.body; // here the input from the user is retrieved from the body of the html

    // this query will check if a user is registered under that email
    request.query("SELECT email FROM Persons WHERE email = ('"+email+"')", async (error, results) => {
        // error handling for the query
        if(error) {
            console.log(error);
        }
// if an email is allready used
        if(results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use' // message is sent to html where it will handle it and show it
            }) 
// here the password and confirmPassword is checked if they match
        } else if( password !== passwordConfirm){
            return res.render('register', {
             message: 'Passwords do not match' // message is sent to html where it will handle it and show it
            });
        }
    
// The password is hashed 8 times
    let hashedPassword = await bcrypt.hash(password, 8);
    // the hashed password is logged to check if it works, this loggin can be delete if wanted
    console.log(hashedPassword)

    // here we query email, name, hashedpassword and insert it into the database
    request.query("INSERT INTO Persons (email, surName, password) VALUES ('"+email+"',+'"+name+"',+'"+hashedPassword+"')", (error, results) =>{
        if(error){
            // logging if an error occurs
            console.log(error);
        } else {
            return res.render('register', {
                // This messege will be sent to the html called register and then the html will show it to the user
                message: 'User registered' // message is sent to html where it will handle it and show it
        });
    }
 })
});
}

exports.createMachine = async (req, res) => {
    console.log(req.body);
    
    const { type, vehicleID, powerBILink, personID } = req.body; // here the input from the user is retrieved from the body of the html

    // this query will check if a Vehicle is registered under that ID
    request.query("SELECT * FROM Vehicles WHERE powerBILink = ('"+powerBILink+"')", async (error, results) => {
        // error handling for the query
        if(error) {
            console.log(error);
        }
// if an ID is allready used
        if(results.recordset.length > 0) {
            return res.render('createMachine', {
                message: 'That PowerBI is already in use' // message is sent to html where it will handle it and show it
            }) 

        }
    });


    // here we query email, name, hashedpassword and insert it into the database
    request.query("INSERT INTO Vehicles (type, vehicleID, powerBILink, personID) VALUES ('"+type+"',+'"+vehicleID+"',+'"+powerBILink+"',+'"+personID+"')", (error, results) =>{
        if(error){
            // logging if an error occurs
            console.log(error);
        } else {
            return res.render('createMachine', {
                // This messege will be sent to the html called register and then the html will show it to the user
                message: 'Vehicle Registered' // message is sent to html where it will handle it and show it
        });
    }
 });
}

exports.deleteMachine = async (req, res) => {
    console.log(req.body);
    
    const { vehicleID } = req.body; // here the input from the user is retrieved from the body of the html

    // this query will check if a Vehicle is registered under that ID
    request.query("SELECT * FROM Vehicles where vehicleID ="+vehicleID, async (error, results) => {
        // error handling for the query
        console.log(results.recordset)
        if(error) {
            console.log(error);
            return res.render('deleteMachine', {
                message: 'Hov der skete en fejl under sletning' // message is sent to html where it will handle it and show it
            });
        }
// if an ID is allready used
       if(results.recordset.length <= 0) {
            return res.render('deleteMachine', {
                message: 'Maskinen findes ikke i databasen' // message is sent to html where it will handle it and show it
            });
        }
    })

    // here we query email, name, hashedpassword and insert it into the database
    request.query("delete from Vehicles where vehicleID ="+vehicleID, (error, results) =>{
        if(error){
            // logging if an error occurs
            console.log(error);
        } else {
            return res.render('deleteMachine', {
                // This messege will be sent to the html called register and then the html will show it to the user
                message: 'Maskine slettet' // message is sent to html where it will handle it and show it
        });
    }
 });
}


exports.editMachine = async (req, res) => {
    console.log(req.body);
    
    const { type, vehicleID, powerBILink, personID } = req.body; // here the input from the user is retrieved from the body of the html

    // this query will check if a Vehicle is registered under that ID
    request.query("SELECT * FROM Vehicles WHERE vehicleID ="+vehicleID, async (error, results) => {
        // error handling for the query
        if(error) {
            console.log(error);
        }
// if an ID is allready used
        if(results.recordset.length <= 0) {
            return res.render('editMachine', {
                message: 'Dette ID findes ikke i databasen' // message is sent to html where it will handle it and show it
            }) 
        }
    });


    // here we query email, name, hashedpassword and insert it into the database
    request.query("UPDATE Vehicles SET type ='"+type+"', powerBILink = '"+powerBILink+"', personID = '"+personID+"' WHERE vehicleID ="+vehicleID, (error, results) =>{
        if(error){
            // logging if an error occurs
            console.log(error);
        } else {
            return res.render('editMachine', {
                // This messege will be sent to the html called register and then the html will show it to the user
                message: 'Maskinen blev redigeret' // message is sent to html where it will handle it and show it
        });
    }
 });
}



