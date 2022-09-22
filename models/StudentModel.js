const mongoose = require('mongoose')

const Schema = mongoose.Schema

const phoneNumberSchemaModel = new Schema({
    phoneNumber : String
})

const StudentSchemaModel = new Schema({
    name : {
        required : true,
        type : String,
        minlength : 2,
        maxlength : 50,
    },
    age : {
        required : true,
        type : Number,
        min : 17,
        max : 25,
    },
    gender : {
        required : true,
        default : 'male',
        type : String,
        enum : ['male','female']
    },
    phone : [phoneNumberSchemaModel],
    birthday : {
        required : true,
        type : Date,
    },
    from : {
        type : String
    },
    alive : {
        required : true,
        type : Boolean,
        default : true,
    },
    id_card : {
        required : true,
        type : String,
        default : 0,
        match : /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/
    },
    Math : {
        type : Number,
        min:0,
        max:100
    },
    Chinese : {
        type : Number,
        min:0,
        max:100
    },
    English : {
        type : Number,
        min:0,
        max:100
    }
},{strict:"false"})

const StudentModel = mongoose.model('students',StudentSchemaModel)

module.exports =  StudentModel