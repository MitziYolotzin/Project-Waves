const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const app = express();
const mongoose = require ('mongoose');
require ('dotenv').config();

//CONECCTION AND SELL
 mongoose.Promise = global.Promise;
 mongoose.connect(process.env.DATABASE);


// mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true },  (err) => {
//     if (err){
//         return err
//     }
//     console.log("conectado a mongo")
//   });


//MIDDLEWARE
app.use(bodyParser.urlencoded({useNewUrlParser: true, extended:true}));
 app.use(bodyParser.json());
app.use(cookieParser());

//MODELS
const { User } = require ('./models/user');


//USERS
app.post('/api/users/register', (req, res) => {
   // res.status(200);
   const user = new User (req.body);

   user.save((err, doc) => {
       if(err) return res.json({success:false,err});
       res.status(200).json({
           success: true,
           userdata: doc
       })
   })
})



//PORT
const port = process.env.PORT || 3002;

app.listen(port, () => {
    console.log('Server Runing ')
})