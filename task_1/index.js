const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
var crypto = require("crypto");

//Database connection 
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_tasks_db"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

//Basic settings for email
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'test.micromerger@gmail.com',
        pass: 'umar@micromerger'
    }
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/api/varify_email', (request, response) => {
    console.log(request.query);
    var email = request.query.email;
    var hash = request.query.hash;

    con.query(`SELECT * FROM users WHERE email= '${email}' AND hash='${hash}'`, function (err, result, fields) {
        if (err) throw err;
        if (result && result.length > 0) {
            var sql = `UPDATE users SET active=1 WHERE email= '${email}' AND hash='${hash}'`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log('Acount Activated');
                response.json({ status: "success", message: 'Activated' });
            });
        } else {
            console.log('Invalid email/hash provided');
            response.json({ status: "error", message: 'Invalid email/hash provided' });
        }
    });
});

router.get('/testlink', (request, response) => {
    console.log('testlink');
});

router.post('/api/register', (request, response) => {

    //create random hash key
    var hash = crypto.randomBytes(16).toString('hex');

    //save user information into database
    var sql = `INSERT INTO users (username, password, email, hash) VALUES ('${request.body.username}', '${request.body.password}', '${request.body.user.email}', '${hash}')`;
    con.query(sql, function (err, result) {
        if (err) {
            response.json({ status: "error", message: 'Failed to create an account' });
            throw err;
        };
        console.log("saved to database");
    });

    //varification link
    var var_link = 'http://localhost:3000/email_varify?email=' + request.body.user.email + '&hash=' + hash;
    //Mail options, subject, etc
    var mailOptions = {
        from: 'noreply@umaas.com',
        to: request.body.user.email,
        subject: 'Email varification required for account creatation',
        text: 'Please varify your email. If you have created an account' +
            ' with UMAAS then please click on below link to varify your account.' +
            '<br />' + var_link
    };

    //send activation email to the user
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            response.json({ status: "error", message: 'Error. Mail not sent' });
        } else {
            console.log('Email sent: ' + info.response);
            response.json({ status: "success", message: 'Mail sent' });
        }
    });
});

router.post('/api/login', (request, response) => {

    //save user information into database
    var sql = `SELECT * FROM users WHERE email= '${request.body.email}' AND password='${request.body.password}' AND active=1`;
    con.query(sql, function (err, result) {
        if (err) {
            response.json({ status: "error", message: 'Failed to login. Internel Error' });
            throw err;
        };
        if (result && result.length > 0) {
            console.log('logged in');
            response.json({ status: "success", message: 'logged in' });
        } else {
            console.log('Invalid email/password provided');
            response.json({ status: "error", message: 'Invalid email/password provided' });
        }
    });
});

app.use("/", router);

app.listen(3001, () => {
    console.log('Server Listening on port 3001');
});