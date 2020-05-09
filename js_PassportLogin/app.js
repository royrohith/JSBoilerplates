const express = require('express');
const expressLayouts = require('express-ejs-layouts');   //template layouts
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Passport config 7
require('./config/passport')(passport);      //passing 'passport' as arguement to exported function

//DB Config 3
const db = require('./config/keys').MongoURI; 
mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser:true})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//EJS Middleware 2
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser Middleware 4
app.use(express.urlencoded({ extended: false }));    //You need to use bodyParser() if you want the form data to be available in req.body.

//Session Middleware 5
app.use(session({             //available in github repository
    secret: 'secret',         //set anything
    resave: true,             //set true
    saveUninitialized: true,
    }));

//Passport Middleware 7
app.use(passport.initialize());
app.use(passport.session());

//Flash middleware 6
app.use(flash());            //    

//Global Variable (User-defined) Middleware for flash message 6
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');             //variable for passport error

    next();
})

//Routes 1
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in port ${PORT}`));