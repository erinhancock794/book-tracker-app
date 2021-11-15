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
    return allBooks;
}

app.get("/get", async (req, res) => {
    await getAllBooks().then((result) => {
        res.status(200).json(result);
      });
  });


app.get("/match/:bookId", async (req, res) => {
    await Book.findOne( {id: req.params.bookId}).then(async(match) => {
        if (match) {
            res.status(200).json(match)
        }
    })

  });

  app.put("/:bookId", async (req, res) => {
    const id = req.params.bookId
    const matchingBook = await Book.findOneAndUpdate({id: id}, req.body)
    .then((result) => {
        if (req.body.userData.hasRead) {
            _.set(result, 'userData.hasRead', true)
        } else if (!req.body.userData.hasRead) {
                _.set(result, 'userData.hasRead', false)
        } else if (req.body.userData.liked) {
            _.set(result, 'userData.liked', true)
        } else if (!req.body.userData.liked) {
            _.set(result, 'userData.liked', false)
        }
    })
    res.status(200).json(matchingBook)


  });

app.post('/add', async (req, res) => {
    const bookItem = JSON.parse(req.body)
    let formatBook;

    await Book.findOne({id: bookItem.id}).then( async(duplicate) => {
        if (duplicate) {
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
              userData: {
                liked: null,
                wantToRead: bookItem.userData.wantToRead,
                hasRead: bookItem.userData.hasRead,
              },
            }

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

        }
    })

})

app.put('/:bookId', async (req, res) => {
    await Book.findOneAndUpdate({ id: req.params.bookId}, req.body)
    .then((result) => {
        console.log('result---->', result);
    })
})

