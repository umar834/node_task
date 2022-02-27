const express = require("express");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
var crypto = require("crypto");
const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

//Storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

//Database connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_tasks_db",
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

//Basic settings for email
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "test.micromerger@gmail.com",
    pass: "umar@micromerger",
  },
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

router.get("/api/varify_email", (request, response) => {
  console.log(request.query);
  var email = request.query.email;
  var hash = request.query.hash;

  con.query(
    `SELECT * FROM users WHERE email= '${email}' AND hash='${hash}'`,
    function (err, result, fields) {
      if (err) throw err;
      if (result && result.length > 0) {
        var sql = `UPDATE users SET active=1 WHERE email= '${email}' AND hash='${hash}'`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Acount Activated");
          response.json({ status: "success", message: "Activated" });
        });
      } else {
        console.log("Invalid email/hash provided");
        response.json({
          status: "error",
          message: "Invalid email/hash provided",
        });
      }
    }
  );
});

router.get("/testlink", (request, response) => {
  console.log("testlink");
});

router.post("/api/register", upload.single("file"), (request, response) => {
  var imagename = request.file.filename;
  //check if provided email is already registered
  con.query(
    `SELECT * FROM users WHERE email= '${request.body.email}'`,
    function (err, result, fields) {
      if (err) throw err;
      if (result && result.length > 0) {
        console.log("Email already registered");
        unlinkAsync(request.file.path);
        response.json({
          status: "error",
          message: "Provided email is already registered",
        });
      } else {
        //create random hash key
        var hash = crypto.randomBytes(16).toString("hex");

        //save user information into database
        var sql = `INSERT INTO users (username, password, email, image, hash) VALUES ('${request.body.username}', '${request.body.password}', '${request.body.email}', '${imagename}', '${hash}')`;
        con.query(sql, function (err, result) {
          if (err) {
            unlinkAsync(request.file.path);
            response.json({
              status: "error",
              message: "Failed to create an account",
            });
            throw err;
          }
          console.log("saved to database");
        });

        //varification link
        var var_link =
          "http://localhost:3000/email_varify?email=" +
          request.body.email +
          "&hash=" +
          hash;
        //Mail options, subject, etc
        var mailOptions = {
          from: "noreply@umaas.com",
          to: request.body.email,
          subject: "Email varification required for account creatation",
          text:
            "Please varify your email. If you have created an account" +
            " with UMAAS then please click on below link to varify your account." +
            "<br />" +
            var_link,
        };

        //send activation email to the user
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            response.json({ status: "error", message: "Error. Mail not sent" });
          } else {
            console.log("Email sent: " + info.response);
            response.json({ status: "success", message: "Mail sent" });
          }
        });
      }
    }
  );
});

router.post(
  "/api/updateUser",
  [verifyToken, upload.single("file")],
  (request, response) => {
    jwt.verify(request.token, "secretkey", (err, verifiedJwt) => {
      if (err) {
        response.json({ status: "error", message: "Forbidden access" });
      } else {
        var image_name = "";
        if (
          request.body.file_url === "null" &&
          typeof request.file === "undefined"
        ) {
          if (
            request.body.image_name.length !== 0 &&
            typeof request.body.image_name !== "undefined"
          ) {
            var file_path = "public/images/" + request.body.image_name;
            console.log(file_path);
            unlinkAsync(file_path);
          }
          console.log("1");
        } else if (typeof request.file !== "undefined") {
          if (
            request.body.image_name.length !== 0 &&
            typeof request.body.image_name !== "undefined"
          ) {
            var file_path = "public/images/" + request.body.image_name;
            console.log(file_path);
            unlinkAsync(file_path);
          }
          image_name = request.file.filename;
          console.log("2");
        } else if (request.body.file_url !== "null") {
          image_name = request.body.image_name;
          console.log("3");
        }
        var sql = `UPDATE users SET username='${request.body.username}', email='${request.body.email}', password='${request.body.password}', image='${image_name}' where id='${request.body.user_id}'`;
        con.query(sql, function (err, result) {
          if (err) {
            response.json({
              status: "error",
              message: "Failed to create an account",
            });
            throw err;
          }
          console.log("saved to database");
        });
        response.json({ status: "success" });
      }
    });
  }
);

router.post("/api/forgotpassword", (request, response) => {
  var email_address = request.body.email;
  con.query(
    `SELECT * FROM users WHERE email= '${email_address}'`,
    function (err, result, fields) {
      if (err) throw err;
      if (result && result.length > 0) {
        var hash = crypto.randomBytes(16).toString("hex");
        var var_link =
          "http://localhost:3000/reset_password?email=" +
          email_address +
          "&hash=" +
          hash;
        var mailOptions = {
          from: "noreply@umaas.com",
          to: request.body.email,
          subject: "Reset Password link sent.",
          text:
            "To reset your password click on the link below" +
            " if it was not you who asked for it then please ignore the mail." +
            "<br />" +
            var_link,
        };
      } 
      else 
      {
        response.json({
          status: "error",
          message: "Email not registered with us",
        });
      }
    }
  );
});

router.post("/api/login", (request, response) => {
  //save user information into database
  var sql = `SELECT * FROM users WHERE email= '${request.body.email}' AND password='${request.body.password}' AND active=1`;
  con.query(sql, function (err, result) {
    if (err) {
      response.json({
        status: "error",
        message: "Failed to login. Internel Error",
      });
      throw err;
    }
    //SUCCESSFULLY LOGGED IN
    if (result && result.length > 0) {
      const user = {
        id: result[0].id,
        username: result[0].username,
        email: result[0].email,
        image: result[0].image,
        password: result[0].password,
      };

      jwt.sign({ user: user }, "secretkey", (err, token) => {
        response.json({
          status: "success",
          token: token,
          user: user,
        });
      });
    } else {
      var sql = `SELECT * FROM users WHERE email= '${request.body.email}' AND password='${request.body.password}' AND active=0`;
      con.query(sql, function (err, result) {
        if (err) {
          response.json({
            status: "error",
            message: "Failed to login. Internel Error",
          });
          throw err;
        }
        if (result && result.length > 0) {
          console.log("logged in");
          response.json({
            status: "error",
            message: "Email Varification Pending!",
          });
        } else {
          console.log("Invalid email/password provided");
          response.json({
            status: "error",
            message: "Invalid email/password provided",
          });
        }
      });
    }
  });
});

//Verify Token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.json({ status: "error", message: "403 Forbidden" });
  }
}
app.use("/", router);

app.listen(3001, () => {
  console.log("Server Listening on port 3001");
});
