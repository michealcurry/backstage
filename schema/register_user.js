const joi = require('joi')

const username = joi.string().min(2).max(10).required()

const password = joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/).required()

exports.req_register_schema = {
    body : {
        username,
        password
    }
}