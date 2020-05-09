const localStrategy = require('passport-local').Strategy;
//const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load User model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use( new localStrategy({usernameField: 'email'}, (email, password, done) => {
    //Match User    
        //Match Email
        User.findOne({ email: email })
        .then(user => {                   //either returns user or null (for email not registered)
            if(!user) {                   //if null returned !null becomes true(!false)
                return done(null, false, {message: 'Email not registered'});    //use vscode documentation for done()
            }

        //Match password
            bcrypt.compare(password, user.password, (err, match) => {
                if(err) throw err;
                
                if(match) {                  //match is boolean 
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Password is Incorrect'});
                }
            })
        })
        .catch(err => console.log(err))
    })
    );

    //Passport documentation: Sessions
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });

}