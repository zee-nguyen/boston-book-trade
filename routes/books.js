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
            console.log(newlyCreatedBook);
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

//middleware
function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.redirectTo = req.originalUrl;
    res.redirect("/login");
}

module.exports = router;