const LocalStrategy = require('passport-local').Strategy; //we are assigning the object 'strategy from the passport-local package to LocalStrategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//load model
const User = mongoose.model('users')

module.exports = function(passport){ //function is being passed with the instance of passport from app.js
//defining the local strategy
passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
     //match user
    User.findOne({ //this startegy will be called when logging in
        email:email
    }) .then(user => { //returns a promise with a user
        if(!user) {
            return done (null, false, {message: 'no user found'}) //done takes error as its first parameter, 2nd param - since there is no user we will return false
        }
        //match passwords
        bcrypt.compare(password, user.password, (err, isMatch)=>{
            if(err) throw err;
            if(isMatch){
                return done (null, user) 
            } else {
                return done (null, false, {message: 'password is incorrect'})
            }
        })
    });
  })) 
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
} //since we are not using username as a login field, we need to define the that "email" is being used as a usernamefield