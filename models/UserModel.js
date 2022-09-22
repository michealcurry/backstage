/*
用于操作用户集合的model
*/
const mongoose = require('mongoose')

//引入模式对象
var Schema = mongoose.Schema

//创建约束对象
var UserModelSchema = new Schema({
    username:{
        required:true,
        type:String,
        minlength:4,
        maxlength:20
    },
    password:{
        required:true,
        type:String,
    },
    roleName : {
        required:true,
        type:String,
        default:'teacher',
        enum:['student','admin','superadmin']
    }
})

//定义model
const UserModel = mongoose.model('users',UserModelSchema)

//向外暴露
module.exports = UserModel