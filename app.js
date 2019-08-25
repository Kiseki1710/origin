//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const encrypt = require('mongoose-encryption');
const mongoose = require("mongoose");
const app = express();
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine' , 'ejs');
app.use(express.static("public"));
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']})
const User = mongoose.model("User", userSchema);


app.get('/',function(req,res){
  res.render("home");
});
app.get('/login',function(req,res){
  res.render("login");
});
app.get('/register',function(req,res){
  res.render("register");
});
app.post('/register', function(req,res){
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });
  user.save(function(err){
    if(!err)
    res.render("secrets");
    else
    console.log(err);
  })
});
app.post('/login',function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username} , function(err,result){
    if(err)
    console.log(err);
    else{
      if(result)
      if(result.password === password)
      res.render('secrets');
    }
  });
});




app.listen(3000,function(){
  console.log("Server has started on port 3000");
});
