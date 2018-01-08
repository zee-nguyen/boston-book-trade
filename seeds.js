var mongoose    = require("mongoose"),
    Book = require("./models/book"),
    Comment = require("./models/comment");

var data = [
        {
            title: "Dataclysm",
            image: "https://images-na.ssl-images-amazon.com/images/I/41p%2B6zsrd%2BL.jpg",
            description: "Bacon ipsum dolor amet swine sausage chuck shoulder picanha fatback jerky strip steak ribeye beef ribs turducken. Beef ribs ground round buffalo frankfurter, tri-tip meatball ham andouille drumstick brisket filet mignon picanha. Biltong ham rump andouille bresaola tail alcatra chuck pig jowl brisket. Meatball ribeye short loin kielbasa ground round prosciutto buffalo turkey bacon jowl turducken shoulder brisket picanha ball tip. Prosciutto salami corned beef beef brisket jowl frankfurter cow kielbasa ground round tenderloin. Capicola ribeye kevin short ribs, turducken sausage tenderloin ground round pork spare ribs tail tongue alcatra."
        },
        {
            title: "Made to Stick",
            image: "https://images-na.ssl-images-amazon.com/images/I/517I-tX7ThL._SX332_BO1,204,203,200_.jpg",
            description: "Bacon ipsum dolor amet swine sausage chuck shoulder picanha fatback jerky strip steak ribeye beef ribs turducken. Beef ribs ground round buffalo frankfurter, tri-tip meatball ham andouille drumstick brisket filet mignon picanha. Biltong ham rump andouille bresaola tail alcatra chuck pig jowl brisket. Meatball ribeye short loin kielbasa ground round prosciutto buffalo turkey bacon jowl turducken shoulder brisket picanha ball tip. Prosciutto salami corned beef beef brisket jowl frankfurter cow kielbasa ground round tenderloin. Capicola ribeye kevin short ribs, turducken sausage tenderloin ground round pork spare ribs tail tongue alcatra."
        },
        {
            title: "Sapiens",
            image: "https://images-na.ssl-images-amazon.com/images/I/41MJX6yzfeL._SX324_BO1,204,203,200_.jpg",
            description: "Bacon ipsum dolor amet swine sausage chuck shoulder picanha fatback jerky strip steak ribeye beef ribs turducken. Beef ribs ground round buffalo frankfurter, tri-tip meatball ham andouille drumstick brisket filet mignon picanha. Biltong ham rump andouille bresaola tail alcatra chuck pig jowl brisket. Meatball ribeye short loin kielbasa ground round prosciutto buffalo turkey bacon jowl turducken shoulder brisket picanha ball tip. Prosciutto salami corned beef beef brisket jowl frankfurter cow kielbasa ground round tenderloin. Capicola ribeye kevin short ribs, turducken sausage tenderloin ground round pork spare ribs tail tongue alcatra."
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