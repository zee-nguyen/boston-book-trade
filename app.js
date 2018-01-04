var express     = require("express"),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    app         = express(),
    Book        = require("./models/book.js"),
    seedDB      = require("./seeds");


mongoose.connect("mongodb://localhost/book_trade");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

seedDB();

//Display landing page
app.get("/", function(req, res){
   res.render("landing"); 
});

//INDEX -- Display all current book trade
app.get("/books", function(req, res){
    //Get all books from DB
    Book.find({}, function(err, allBooks){
        if (err) {
            console.log(err);
        } else {
            //render books page
            res.render("index", {books: allBooks});
        }
    });
});

//NEW -- Display form to create a new book trade
app.get("/books/new", function(req, res) {
   res.render("new");
});

//CREATE -- create new book and add to DB
app.post("/books", function(req, res) {
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
            res.redirect("/books");
        }
    });
});

//SHOW -- Display more info about one book
app.get("/books/:id", function(req, res){
   //find the book with provided ID
   Book.findById(req.params.id).populate("comments").exec(function(err, foundBook) {
       if (err) {
           console.log(err)
       } else {
           console.log(foundBook);
           //render show template with that ID
           res.render("show", {book: foundBook});     
       }
   });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});