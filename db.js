const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://justgunno:QHMQqwxQiI3OHEQL@cluster0.bhlswzc.mongodb.net/Paytm")

const userSchema = new mongoose.Schema({
  username:{type:String,
    required:true,
    unique:true,
    lowercase:true,
    minlength:3 },  //more elegant way to write the below
  password: String,
  firstName: String,
  lastName: String,
});

const accountSchema= new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId, //puts constraint so if a corr object id doesnt exist, you cant see balance
    ref:'User',//creates reference to User table so that account schema only exists if a user in User table exists
    required:true
  },
  balance:{
    type:Number,
    required:true
  }
})

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);
module.exports = {
    User, Account
}
