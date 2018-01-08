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
router.get("/new", function(req, res) {
   res.render("books/new");
});

//CREATE -- create new book and add to DB
router.post("/", function(req, res) {
    //get data from form and add to books array
    var title = req.body.title;
    var image = req.body.image;
    var desc = req.body.description;
    //create new book
    var newBook = {title: title, image: image, description: desc};
    Book.create(newBook, function(err, newlyCreatedBook){
        if (err) {
            console.log (err);
        } else {
            //redirect user to books page
            res.redirect("books/index");
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
           console.log(foundBook);
           //render show template with that ID
           res.render("books/show", {book: foundBook});     
       }
   });
});

module.exports = router;