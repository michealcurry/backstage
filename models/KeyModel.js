const mongoose = require('mongoose')

const Schema = mongoose.Schema

const KeySchema = new Schema({
    keyName : {
        type : String
    },
    detail : {
        type : String
    },
    modify : {
        type : Boolean
    }
})

const KeyModel = mongoose.model("keys",KeySchema)

module.exports = KeyModel