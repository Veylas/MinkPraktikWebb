const mssql = require("mssql");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
 


var request = new mssql.Request();

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
                    message: 'Please provide an email and password'
                })
            }

            const result = request.query("Select * FROM Persons WHERE email =('"+email+"')", async (error, results) => {
               // var arr = new Array();
                //results.recordset = arr;
                //console.log(results.recordset)

              

                if(!results || !(await bcrypt.compare(password, results.recordset[0].password) ) ){
                    console.log(results)
                    res.status(401).render('login', {
                        message: 'Email or Password is incorrect'
                    })
                } else {
                    const id = results.recordset[0].id;
                    console.log(id)
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });

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
    
    const { name, email, password, passwordConfirm } = req.body;

    request.query("SELECT email FROM Persons WHERE email = ('"+email+"')", async (error, results) => {
        if(error) {
            console.log(error);
        }

        if(results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            }) 

        } else if( password !== passwordConfirm){
            return res.render('register', {
             message: 'Passwords do not match'
            });
        }
    });

    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword)

    //"INSERT INTO Persons (surName, email, password) VALUES ('"+email+"'+'"+name+"'+'"hashedPassword"')"


    request.query("INSERT INTO Persons (email, surName, password) VALUES ('"+email+"',+'"+name+"',+'"+hashedPassword+"')", (error, results) =>{
        if(error){
            console.log(error);
        } else {
            return res.render('register', {
                message: 'User registered'
        });
    }
 })
}