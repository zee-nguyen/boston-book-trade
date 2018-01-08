var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Book        = require("../models/book.js"),
    Comment     = require("../models/comment.js");

//NEW comments -- display form to create new comment
router.get("/new", isLoggedIn, function(req, res) {
    //find book by id
    Book.findById(req.params.id, function(err, foundBook) {
        if (err) {
            console.log(err)
        } else {
            //render page 
            res.render("comments/new", {book: foundBook});
        }
    })
});

//CREATE comments -- create new comment and add to db
router.post("/", isLoggedIn, function(req, res) {
    //look up book by id
    Book.findById(req.params.id, function(err, book) {
        if(err) {
            console.log(err);
            res.redirect("/books");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add comment to book
                    book.comments.push(comment);
                    book.save();
                    //redirect to show page
                    res.redirect("/books/" + book._id);
                }
            });
        }
    });
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
