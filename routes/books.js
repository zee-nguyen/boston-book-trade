var express     = require("express"),
    router      = express.Router(),
    Book        = require("../models/book.js"),
    //middleware = require("../middleware/index.js") -- code will automatically look into index
    middleware  = require("../middleware");

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
router.get("/new", middleware.isLoggedIn, function (req, res) {
   res.render("books/new");
});

//CREATE -- create new book and add to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
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
router.get("/:id/edit", middleware.checkBookOwnership, function (req, res) {
    Book.findById(req.params.id, function(err, foundBook){
        res.render("books/edit", {book: foundBook});
    });
});    

//UPDATE book -- update book
router.put("/:id", middleware.checkBookOwnership, function(req, res) {
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
router.delete("/:id", middleware.checkBookOwnership, function (req, res) {
    Book.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/books");
        } else {
            res.redirect("/books");
        }
    })
});

module.exports = router;