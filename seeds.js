var mongoose    = require("mongoose"),
    Book = require("./models/book"),
    Comment = require("./models/comment");

var data = [
        {
            title: "Dataclysm",
            image: "https://images-na.ssl-images-amazon.com/images/I/41p%2B6zsrd%2BL.jpg",
            description: "An amazing book on data"
        },
        {
            title: "Made to Stick",
            image: "https://images-na.ssl-images-amazon.com/images/I/517I-tX7ThL._SX332_BO1,204,203,200_.jpg",
            description: "Why some ideas die and others don't"
        },
        {
            title: "Sapiens",
            image: "https://images-na.ssl-images-amazon.com/images/I/41MJX6yzfeL._SX324_BO1,204,203,200_.jpg",
            description: "A wonderful book for anyone"
        }
    ];

function seedDB() {
    //Remove all books
    Book.remove({}, function(err){
        if (err) {
            console.log(err);
        }
        console.log("removed books!");
        
        //add a few books
        //for each item in the data array, we create a new book in the DB
        data.forEach(function(seed) {
           Book.create(seed, function(err, book){
               if (err) {
                   console.log(err)
               } else {
                   console.log("new book is added!");
                   //create a comment for each book
                   Comment.create(
                       {
                           text: "This book is a must-read!",
                           author: "John Williams"
                        }, function(err, comment){
                               if (err) {
                                   console.log(err)
                               } else {
                                   //add comment to book
                                   book.comments.push(comment);
                                   book.save();
                                   console.log("Created a new comment!");
                               }
                   })
               }
           }) 
        });
    });
}

module.exports = seedDB;