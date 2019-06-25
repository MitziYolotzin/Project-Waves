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


//MIDDLEWARE
app.use(bodyParser.urlencoded({ useNewUrlParser: true, extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//MODELS
const { User } = require("./models/user");
const { Brand } = require("./models/brand");
const { Wood } = require("./models/wood");
const { Product } = require("./models/product");

//Middlewares

const { auth } = require("./middleware/auth");
const { admin } = require("./middleware/admin");

//PRODUCTS

//BY ARRIVAL
//ARTICLE /articles?sortBy=createdAt&order=desc&limit=4
//BY SELL
// /articles?sortBy=sold&order=desc&limit=4, limit=100&skip=5
app.get("/api/product/articles", (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "";
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;

  Product.find()
    .populate("brand")
    .populate("wood")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, articles) => {
      if (err) return res.status(400).send(err);
      res.send(articles);
    });
});

//ID
///api/product/article?id=kdkd,kdkd,kdkd&type=single,array
app.get("/api/product/articles_by_id", (req, res) => {
  let type = req.query.type;
  let items = req.query.id;
  //it´s possible node for react
  if (type === "array") {
    let ids = req.query.id.split(",");
    items = [];
    items = ids.map(item => {
      return mongoose.Types.ObjectId(item);
    });
  }
  Product.find({ _id: { $in: items } })
    .populate("brand")
    .populate("wood")
    .exec((err, docs) => {
      return res.status(200).send(docs);
    });
});

//ARTICLE
app.post("/api/product/article", auth, admin, (req, res) => {
  const product = new Product(req.body);
  product.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      article: doc
    });
  });
});

//WOODS
app.post("/api/product/wood", auth, admin, (req, res) => {
  const wood = new Wood(req.body);

  wood.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      wood: doc
    });
  });
});

app.get("/api/product/woods", (req, res) => {
  Wood.find({}, (err, woods) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(woods);
  });
});

//BRAND
app.post("/api/product/brand", auth, admin, (req, res) => {
  const brand = new Brand(req.body);
  //doc back from mongoose, mongo DB. Save return whenever we just enter to the database
  brand.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      brand: doc
    });
  });
});

app.get("/api/product/brands", (req, res) => {
  Brand.find({}, (err, brands) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(brands);
  });
});

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
  User.findOneAndUpdate({ _id: req.user.id }, { token: '' }, (err, doc) => {
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
  console.log(`Server Running on ${port}` );
});
