const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Login page 1
router.get('/login', (req, res) => {
 res.render('login')
})
//Register page 1
router.get('/register', (req, res) => {
    res.render('register')
   })

//Register Handle 2
router.post('/register', (req, res) => {     //since user details are posted
    const { name, email, password, password2 } = req.body;
    //Validation
    const err = [];
        //Check for blank fields
        if(!name || !email || !password || !password2) {
            err.push({msg: 'Please fill all fields'});
        }
        //Check for password match
        if(password !== password2) {
            err.push({msg: 'Passwords dont match'});       
        }
        //Check for passwords length
        if(password.length < 4) {
            err.push({msg: 'Password should have atleast 5 characters'});
        }
    if(err.length > 0) {
        res.render('register', {         //so that these values are passed back to fields
            err,                         //ES6 syntax for err: err, name: name...
            name,
            email,
            password,
            password2
        });
    } else {
        //Validation passes
        User.findOne( {email: email} )    //returns promise
        .then(user => {
            if(user){
                //User already exists
                err.push({msg: 'Email already registered'});
                res.render('register', {         
                    err,
                    name,
                    email,
                    password,
                    password2
                });
            }else {
                //Mongoose methods
                const newUser = new User({              //creates instance of model   
                    name,
                    email,
                    password
                });

                //Encrypt Password
                bcrypt.genSalt(10, (err, salt) => {
                    if(err) throw err;
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        
                        //Save user to db
                        newUser.save()                  //returns promise
                        .then(user => {  
                            req.flash('success_msg', 'Registered Successfully');      //creates flash(such that message is displayed in login ie since we are redirecting message in stored in 'session')            
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err))
                    })

                });


            }
        })
    }
})

//Login Handle 3
router.post('/login', (req, res, next) => {
    //Passport documentation: Authenticate
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true                //flash message on failure
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();   //passport middleware
    req.flash('success_msg', 'Logged Out Successfully');
    res.redirect('/users/login');
})

module.exports = router;