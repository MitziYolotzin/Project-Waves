const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

//CONECTION AND SELL
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true, useCreateIndex: true },
  err => {
    if (err) return err;
    console.log("Connected with MongoDB");
  }
);

// mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true },  (err) => {
//     if (err){
//         return err
//     }
//     console.log("conectado a mongo")
//   });

//MIDDLEWARE
app.use(bodyParser.urlencoded({ useNewUrlParser: true, extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//MODELS
const { User } = require("./models/user");

//Middlewares
const { auth } = require("./middleware/auth");

//USERS

//AUTH
//in case react, client side, this info about user is going to be available for us to use in react
app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    //user: req.user
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    cart: req.user.cart,
    history: req.user.history
  });
});

// create new user
app.post("/api/users/register", (req, res) => {
  // res.status(200);
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true
      //passing user data
      //userdata: doc
    });
  });
});

//LOGIN - Send user and password
app.post("/api/users/login", (req, res) => {
  //find the email in DB, and user in DB
  User.findOne({ 'email': req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found"
      });


    //cb User schema comparePassword, passsword check with DB
    //check pass, isMatch is true
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      //generate token
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res
          .cookie("w_auth", user.token) //store cookie token
          .status(200)
          .json({
            loginSuccess: true
          });
      });
    });
  });
});

 //LOGOUT, first check DB, then auth middleware,
 app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user.id },
     { token: '' },
      (err, doc) => {
    if (err) return res.json({ success: false, err });
    //destroy token
    return res.status(200).json({
      success: true
    });
  });
});


//PORT
const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log("Server Running ");
});
