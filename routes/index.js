var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user.js"),
    Book        = require("../models/book.js"),
    passport    = require("passport");

//Display landing page
router.get("/", function(req, res){
    Book.find({}, function(err, allBooks){
        if(err) {
            console.log(err);
            req.flash("Oops! Something went wrong.");
        } else {
            res.render("landing", {books: allBooks})
        }
    })
});


//Show register form
router.get("/register", function(req, res) {
    res.render("register");
});

//handle user sign up
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("/register");
        } 
        passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome to Boston Book Trade " + user.username);
          res.redirect("/books");
        })
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handle user login
//app.post("/login", callback)
router.post("/login", function(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("/login");
        }
        req.login(user, function(err) {
            if (err) { return next(err) }
            var redirectTo = req.session.redirectTo ? req.session.redirectTo : "/books";
            delete req.session.redirectTo;
            req.flash("success", "Welcome back!");
            res.redirect(redirectTo);
        });
    })(req, res, next);
});

//user logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out successfully.");
    res.redirect("/");
});


//Display About Page
router.get("/about", function(req, res) {
    res.render("about");
})

//Display Terms and Conditions Page

router.get("/terms", function(req, res) {
    res.render("terms");
});

module.exports = router;