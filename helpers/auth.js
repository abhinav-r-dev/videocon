module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()){
            return next(); //next helps to transfer control over to the next middleware which consist of another request and response cycle without disturbing the current one
        }
        req.flash('error_msg', 'not authorised');
        res.redirect('/users/login')
    }
}