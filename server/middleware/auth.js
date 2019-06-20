const { User } = require("./../models/user");

//middleware is a function
//next cb in server
let auth = (req, res, next) => {
  let token = req.cookies.w_auth;
  //User model. Receive token from the cookies
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    //if could user connect with react, redux
    if (!user)
      return res.json({
        isAuth: false,
        error: true
      });
    //check with auth function in server, request to receive from rout
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
