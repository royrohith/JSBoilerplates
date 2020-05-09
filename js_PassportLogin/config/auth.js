//Ensuring Dashboard cant be accessed without authentication
module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {      //isAuthenticated provided by passport
            return next();
        }
        req.flash('error_msg', 'Please login to continue')
        res.redirect('/users/login');
    }
}