const joi = require('joi')

const username = joi.string().min(2).max(10).required()

const password = joi.string().required()

exports.req_login_schema = {
    body : {
        username,
        password
    }
}