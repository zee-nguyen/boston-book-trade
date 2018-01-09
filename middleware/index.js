//all middleware goes here
var Book = require("../models/book"),
    Comment = require("../models/comment");

var middlewareObj = {
    checkBookOwnership: function(req, res) {
        //is the user logged in?
        if (req.isAuthenticated()) {
            Book.findById(req.params.id, function(err, foundBook){
                if (err) {
                    //if err, redirect back to the page they came from
                    res.redirect("back");
                } else {
                    // if the user is logged in, does user own the book?
                    //req.user._id is a string 
                    //foundBook.author.id is a mongoose object --> has to use .equals() to compare
                    if (foundBook.author.id.equals(req.user._id)) {
                        //if so, proceed to the next step
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            });
        } else {
            res.redirect("back");
        }
    },
    checkCommentOwnership: function(req, res) {
        //is the user logged in?
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if (err) {
                    //if err, redirect back to the page they came from
                    res.redirect("back");
                } else {
                    // if the user is logged in, does user own the book?
                    if (foundComment.author.id.equals(req.user._id)) {
                        //if so, proceed to the next step
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            });
        } else {
            res.redirect("back");
        }
    },
    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.session.redirectTo = req.originalUrl;
        res.redirect("/login");
    }
};

module.exports = middlewareObj;