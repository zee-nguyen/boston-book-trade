var express = require("express"),
    router  = express.Router(),
    Book    = require("../models/book.js");

//INDEX -- Display all current book trade
router.get("/", function(req, res){
    //Get all books from DB
    Book.find({}, function(err, allBooks){
        if (err) {
            console.log(err);
        } else {
            //render books page
            res.render("books/index", {books: allBooks});
        }
    });
});

//NEW -- Display form to create a new book trade
router.get("/new", isLoggedIn, function (req, res) {
   res.render("books/new");
});

//CREATE -- create new book and add to DB
router.post("/", isLoggedIn, function (req, res) {
    //get data from form and add to books array
    var title = req.body.title;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    //create new book
    var newBook = {title: title, image: image, description: desc, author: author};
    Book.create(newBook, function(err, newlyCreatedBook){
        if (err) {
            console.log (err);
        } else {
            //redirect user to books page
            res.redirect("/books");
        }
    });
});

//SHOW -- Display more info about one book
router.get("/:id", function(req, res){
   //find the book with provided ID
   Book.findById(req.params.id).populate("comments").exec(function(err, foundBook) {
       if (err) {
           console.log(err)
       } else {
           //render show template with that ID
           res.render("books/show", {book: foundBook});     
       }
   });
});

//EDIT book -- show edit form
router.get("/:id/edit", checkBookOwnership, function (req, res) {
    Book.findById(req.params.id, function(err, foundBook){
        res.render("books/edit", {book: foundBook});
    });
});    

//UPDATE book -- update book
router.put("/:id", checkBookOwnership, function(req, res) {
    //find and update the correct book
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook) {
        if (err) {
            res.redirect("/books");
        } else {
            //redirect to the showpage
            res.redirect("/books/" + req.params.id);
        }
    });
});

//DELETE book -- remove book from database
router.delete("/:id", checkBookOwnership, function (req, res) {
    Book.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/books");
        } else {
            res.redirect("/books");
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

function checkBookOwnership(req, res, next) {
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
};

module.exports = router;