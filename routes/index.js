var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user.js"),
    passport    = require("passport");

//Display landing page
router.get("/", function(req, res){
   res.render("landing"); 
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
          console.log(err);
          return res.redirect("/register");
      } 
      passport.authenticate("local")(req, res, function(){
          res.redirect("/books");
      });
  });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
})

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
            res.redirect(redirectTo);
        });
    })(req, res, next);
});

//user logout
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

//middleware
function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.redirectTo = req.originalUrl;
    res.redirect("/login");
}

module.exports = router;