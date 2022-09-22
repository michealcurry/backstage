//引入外部包
const express = require('express')
const bcrypt = require('bcryptjs')
const expressJoi = require('@escook/express-joi')
const jwt = require('jsonwebtoken')
const config = require('../config')
const { req_login_schema } = require('../schema/login_user')
const { req_register_schema } = require('../schema/register_user')
const UserModel = require('../models/UserModel')


//创建实例对象
const UserRouter = express.Router()

//绑定路由事件
//用于用户注册的路由
UserRouter.post('/register',expressJoi(req_register_schema),(req,res)=>{
    const {username,password,roleName} = req.body
    UserModel.findOne({username}).then(user => {
        if(user){
            res.send({status:1,message:'用户已经存在'})
            return new Promise(()=>{})
        }
        else{
            return UserModel.insertMany({username,password:bcrypt.hashSync(password),roleName})
        }
    }).then((user)=>{
        res.send({status:0,data:user})
    }).catch((error)=>{
        res.send({status:1,message:error.message})
    })
})
//用于用户登录的路由
UserRouter.post('/login',expressJoi(req_login_schema),(req,res)=>{
    const {username,password} = req.body
    UserModel.findOne({username}).then(user=>{
        if(!user) res.send({status:1,message:'该用户尚未注册，请先注册或者输入正确的用户名！'})
        else if(bcrypt.compareSync(password,user.password)){
            //生成token字符串
            const tokenStr = jwt.sign({username:user.username},config.jwtSecretKey,{expiresIn:'10h'})
            res.send({status:0,data:user,token:'Bear '+tokenStr})
        }
        else res.send({status:1,message:'密码错误！'})
    })
})

//查看用户的路由
UserRouter.get('/get_user',(req,res)=>{
    UserModel.find({},{password:0}).then((users)=>{
        res.send({status:0,data:users})
    }).catch((error)=>{
        res.send({status:1,message:error.message})
    })
})

//删除用户
UserRouter.post('/delete_user',(req,res)=>{
    const {_id} = req.body
    UserModel.findOne({_id}).then((user)=>{
        if(user) {
            return UserModel.findOneAndDelete({_id})
        }
        else {
            res.send({status:1,message:'用户还未存在'})
            return new Promise(()=>{})
        }
    }).then((result)=>{
         res.send({status:0,data:result})
    }).catch((error)=>{
        res.send({status:1,message:error.message})
    })
})

//修改用户密码
UserRouter.post('/update_password',expressJoi(req_register_schema),(req,res)=>{
    const {username,password} = req.body
    UserModel.findOne({username}).then((user)=>{
        if(user) {
            return UserModel.updateOne({username},{$set:{password:bcrypt.hashSync(password)}})
        }
        else {
            res.send({status:1,message:'用户尚未注册'})
            return new Promise(()=>{})
        }
    }).then((result) => {
        res.send({ status: 0, data: result })
    }).catch((error) => {
        res.send({ status: 1, message: error.message })
    })
})

//修改用户权限
UserRouter.post('/update_role',(req,res)=>{
    const {username,roleName} = req.body
    UserModel.findOne({username}).then((user)=>{
        if(user) {
            return UserModel.updateOne({username},{$set:{roleName}})
        }
        else {
            res.send({status:1,message:'用户尚未注册'})
            return new Promise(()=>{})
        }
    }).then((result) => {
        res.send({ status: 0, data: result })
    }).catch((error) => {
        res.send({ status: 1, message: error.message })
    })
})


module.exports = UserRouter