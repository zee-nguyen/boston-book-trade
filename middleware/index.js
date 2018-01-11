//all middleware goes here
var Book = require("../models/book"),
    Comment = require("../models/comment");

var middlewareObj = {
    checkBookOwnership: function(req, res, next) {
        //is the user logged in?
        if (req.isAuthenticated()) {
            Book.findById(req.params.id, function(err, foundBook){
                if (err) {
                    //if err, redirect back to the page they came from
                    req.flash("error", "Oops! Something goes wrong. Please try again in a few minutes.");
                    res.redirect("back");
                } else {
                    // if the user is logged in, does user own the book?
                    //req.user._id is a string 
                    //foundBook.author.id is a mongoose object --> has to use .equals() to compare
                    if (foundBook.author.id.equals(req.user._id)) {
                        //if so, proceed to the next step
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that.");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in to do that.");
            res.redirect("back");
        }
    },
    checkCommentOwnership: function(req, res, next) {
        //is the user logged in?
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if (err) {
                    //if err, redirect back to the page they came from
                    req.flash("error", "Oops! Something goes wrong. Please try again in a few minutes.");
                    res.redirect("back");
                } else {
                    // if the user is logged in, does user own the book?
                    if (foundComment.author.id.equals(req.user._id)) {
                        //if so, proceed to the next step
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that.");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in to do that.");
            res.redirect("back");
        }
    },
    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You need to be logged in to do that.");
        req.session.redirectTo = req.originalUrl;
        res.redirect("/login");
    }
};

module.exports = middlewareObj;