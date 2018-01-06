var express                 = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    bodyParser              = require("body-parser"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    Book                    = require("./models/book"),
    Comment                 = require("./models/comment"),
    User                    = require("./models/user"),
    seedDB                  = require("./seeds");


mongoose.connect("mongodb://localhost/book_trade", {useMongoClient: true});
mongoose.Promise = global.Promise;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// Passport configuration
app.use(require("express-session")({
    secret: "It's snowing today",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
            res.render("books/index", {books: allBooks});
        }
    });
});

//NEW -- Display form to create a new book trade
app.get("/books/new", function(req, res) {
   res.render("books/new");
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
            res.redirect("books/index");
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
           res.render("books/show", {book: foundBook});     
       }
   });
});

// ==========================
// COMMENT ROUTE
// ==========================
//NEW comments -- display form to create new comment
app.get("/books/:id/comments/new", isLoggedIn, function(req, res) {
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
app.post("/books/:id/comments", isLoggedIn, function(req, res) {
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
})


// ==========================
// AUTH ROUTE
// ==========================
//Show register form
app.get("/register", function(req, res) {
    res.render("register");
});

//handle user sign up
app.post("/register", function(req, res) {
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
app.get("/login", function(req, res){
    res.render("login");
})

//handle user login
app.post("/login", passport.authenticate("local", {
    successRedirect: "/books",
    failureRedirect: "/login"
    }), function(req, res) {
});

//user logout
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

//middleware
function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});