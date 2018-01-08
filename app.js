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

//requiring routes
var indexRoutes         = require("./routes/index"),
    bookRoutes          = require("./routes/books"),
    commentRoutes       = require("./routes/comments");
    

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

//create custom middleware
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

seedDB();

app.use("/", indexRoutes);
app.use("/books", bookRoutes);
app.use("/books/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});