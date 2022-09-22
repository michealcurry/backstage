//1.引入外部包
const express = require('express')
const cors = require('cors')
const UserRouter = require('./router/user')
const StudentRouter = require('./router/student')
const joi = require('joi')
const mongoose = require('mongoose')
const expressJWT = require('express-jwt')
const config = require('./config')
const bodyParser = require('body-parser')

//2.实例化对象
const app = express()


//3.使用中间件te
//解决跨域中间件
app.use(cors())
//解决表单验证中间件
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
//验证token中间件
app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/api\//]}))
//使用路由组件中间件
app.use('/api',UserRouter)
app.use('/api',StudentRouter)
//抓取全局错误的中间件
app.use((err,req,res,next)=>{
    if(err instanceof joi.ValidationError) return res.send({status:1,message:err.message})
    //捕获token认证失败后的错误
    if(err.name === 'UnauthorizedError') return res.send({status:1,message:'身份认证失败'})
    res.send({status:1,message:err.message})
})


//4.连接数据库
const mongoDB = 'mongodb://192.168.111.100:27017/Amazon';
mongoose.connect(mongoDB).then(() => {
    console.log('数据库连接成功')
    app.listen(3007, function () {
        console.log('api server running at http://127.0.0.1:3007')
    })
}).catch((err) => {
    console.log('数据库连接失败'+err)
})