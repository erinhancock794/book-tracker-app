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
        type: String || Array,
        default: ''
    },
    lccn: {
        type: String || Array,
        default: ''
    },
    userData: {
        liked: {
            type: Boolean
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