var express     = require("express"),
    //need to pass in {mergeParams: true} in order for comments to access parent's params, aka book's id
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
                    //associate the username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment
                    //add newly created comment to book's comment array
                    book.comments.push(comment);
                    //save the book with newly added comment
                    book.save();
                    //redirect to show page
                    res.redirect("/books/" + book._id);
                }
            });
        }
    });
});

//EDIT - show the edit form
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {book_id: req.params.id, comment: foundComment}); 
        }
    });
});

//UPDATE
router.put("/:comment_id/", checkCommentOwnership, function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/books/" + req.params.id);
       }
   });
});

//DELETE
router.delete("/:comment_id", checkCommentOwnership, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/books/" + req.params.id);
       }
   })
});


//middleware
function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.redirectTo = req.originalUrl;
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
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
};

module.exports = router;
