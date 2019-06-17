const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_I = 10;
require("dotenv").config();

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    required: true,
    minlenght: 5
  },
  name: {
    type: String,
    required: true,
    maxlenght: 100
  },
  lastname: {
    type: String,
    required: true,
    maxlenght: 100
  },
  cart: {
    type: Array,
    default: []
  },
  history: {
    type: Array,
    default: []
  },
  role: {
    type: Number,
    default: 0
  },
  token: {
    type: String
  }
});

userSchema.pre("save", function(next) {
  var user = this;
  //In case user is modified, again encrypt
  if (user.isModified("password")) {
    bcrypt.genSalt(SALT_I, function(err, salt) {
      if (err) return next(err);
      //hash transform ny block of arbitrary data into new string of characters
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//cb connect with server user steps in app.post
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function(cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), process.env.SECRET);

  //user.id + pass
  //pass on the enviroment
  user.token = token;
  user.save(function(err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

//auth token
userSchema.statics.findByToken = function(token, cb) {
  var user = this;
  //verify correct token
  jwt.verify(token, process.env.SECRET, function(err, decode) {
    user.findOne({ "_id": decode, "token": token }, function(err, user) {
      if (err) return cb(err);
      //return user data from DB
      cb(null, user);
    });
  });
};

//MODEL-model, esquema, coleccion donde se guarda "users"
const User = mongoose.model("User", userSchema);
//EXPORT
module.exports = { User };
