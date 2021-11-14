const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const port = 5000;
const app = express();

const mongoose = require("mongoose");
const { mongoURI } = require("./config");
const uri = `${mongoURI}`;


mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`you are connected listening on port ${port}`);
    });
  })
  .catch(console.error);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.static("public"));



const Book = require('./models/Book');
const getAllBooks = async () => {
    const allBooks = await Book.find();
    console.log('allBooks----_>', allBooks);
    return allBooks;
}

app.get("/get", async (req, res) => {
    await getAllBooks().then((result) => {
        console.log('result---->', result);
        res.status(200).json(result);
      });
  });

app.post('/add', async (req, res) => {
    const bookItem = JSON.parse(req.body)
    console.log('bookItem====>', bookItem);
    console.log('book item id---->', bookItem.id);
    let formatBook;

    await Book.findOne({id: bookItem.id}).then( async(duplicate) => {
        if (duplicate) {
            console.log('there is a duplicate', bookItem.title);
            res.status(409).json({
                error: true,
                message: 'duplicate'
            });
        } 
        else {
            formatBook = {
                id: bookItem.id,
                key: bookItem.key,
              title: bookItem.title,
              author: bookItem.author[0] || "unknown",
              publishYear: bookItem.first_publish_year || "",
              isbn: bookItem.isbn[0],
              lccn: bookItem.lccn[0],
              userData: {
                rating: 0,
                wantToRead: bookItem.userData.wantToRead,
                hasRead: bookItem.userData.hasRead,
              },
            }

            console.log('formatBook---->', formatBook);
            res.status(200).json({
                message: 'success',
                newBook: formatBook
            })

            const newBook = await new Book(formatBook);
            newBook
            .save()
            .then(result => res.send(result[0]))
            .catch((err) => {
                console.log('err----->', err);
            })

            console.log('newBook---', newBook);
        }
    })

})

app.put('/:bookId', async (req, res) => {
    await Book.findOneAndUpdate({ id: req.params.bookId}, req.body)
    .then((result) => {
        console.log('result---->', result);
    })
})

