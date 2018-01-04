var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

var books = [
        {
            name: "Dataclysm",
            image: "https://images-na.ssl-images-amazon.com/images/I/41p%2B6zsrd%2BL.jpg"
        },
        {
            name: "Made to Stick",
            image: "https://images-na.ssl-images-amazon.com/images/I/517I-tX7ThL._SX332_BO1,204,203,200_.jpg"
        },
        {
            name: "Sapiens",
            image: "https://images-na.ssl-images-amazon.com/images/I/41MJX6yzfeL._SX324_BO1,204,203,200_.jpg"
        },
        {
            name: "Dataclysm",
            image: "https://images-na.ssl-images-amazon.com/images/I/41p%2B6zsrd%2BL.jpg"
        },
        {
            name: "Made to Stick",
            image: "https://images-na.ssl-images-amazon.com/images/I/517I-tX7ThL._SX332_BO1,204,203,200_.jpg"
        },
        {
            name: "Sapiens",
            image: "https://images-na.ssl-images-amazon.com/images/I/41MJX6yzfeL._SX324_BO1,204,203,200_.jpg"
        },
        {
            name: "Dataclysm",
            image: "https://images-na.ssl-images-amazon.com/images/I/41p%2B6zsrd%2BL.jpg"
        },
        {
            name: "Made to Stick",
            image: "https://images-na.ssl-images-amazon.com/images/I/517I-tX7ThL._SX332_BO1,204,203,200_.jpg"
        },
        {
            name: "Sapiens",
            image: "https://images-na.ssl-images-amazon.com/images/I/41MJX6yzfeL._SX324_BO1,204,203,200_.jpg"
        }
       ];
       
       
app.get("/", function(req, res){
   res.render("landing"); 
});

app.get("/books", function(req, res){
       res.render("books", {books: books});
});

app.get("/books/new", function(req, res) {
   res.render("new");
});

app.post("/books", function(req, res) {
    //get data from form and add to books array
    var name = req.body.name;
    var image = req.body.image;
    var newBook = {name: name, image: image};
    books.push(newBook);
    //redirect user to books page
    res.redirect("/books");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});