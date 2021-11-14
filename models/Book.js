const { model, Schema } = require('mongoose');

const Book = new Schema({
    id: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
    publishYear: {
        type: Number
    },
    isbn: {
        type: String
    },
    lccn: {
        type: String
    },
    userData: {
        rating: {
            type: Number
        },
        wantToRead: {
            type: Boolean,
            default: false
        },
        hasRead: {
            type: Boolean,
            default: false
        }
    }


})

module.exports = model("book", Book)