const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
email:{
    type: String,
    required: true,
    trim: true,
    unique: 1
},
password:{
    type: String,
    required: true,
    minlenght: 5
},
name:{
    type: String,
    required: true,
    maxlenght: 100
},
lastname:{
    type: String,
    required: true,
    maxlenght: 100
},
cart: {
    type: Array,
    default: []
},
history:{
    type: Array,
    default: []
},
role:{
    type:Number,
    default: 0
},
token:{
    type:String
}

})

const User = mongoose.model('User', userSchema);

module.exports = { User }