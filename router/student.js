const express = require('express')
const KeyModel = require('../models/KeyModel')
const { db } = require('../models/StudentModel')
const StudentModel = require('../models/StudentModel')
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://hadoop100:27017/'
const StudentRouter = express.Router()


//添加学生的属性
StudentRouter.post('/add_keys',(req,res)=>{
    const {key,value,detail,modify} = req.body
    MongoClient.connect(url).then(conn=>{
        const students = conn.db("Amazon").collection("students")
        students.updateMany(
            {},
            {$set:{[key]:value}},
            false,
            true
        ).then(()=>{
            KeyModel.findOne({keyName:key}).then((result)=>{
                if(result) res.send({status:1,message:"属性已经存在！"})
                else{
                    KeyModel.insertMany({keyName:key,detail,modify})
                    res.send({status:0,message:key+"在学生表和字段表中添加成功，且值已经修改为"+value})
                }
            })
        }).catch(error=>{
            res.send({status:1,message:error.message})
        })
    })
})
//删除学生的属性
StudentRouter.post('/delete_keys',(req,res)=>{
    const {key} = req.body
    
    KeyModel.findOne({keyName:key}).then((result)=>{
        if (!result) res.send({ status: 1, message: "还没有创立这个属性" })
        else {
            MongoClient.connect(url).then(conn => {
                const students = conn.db("Amazon").collection("students")
                students.updateMany(
                    {},
                    { $unset: { [key]: '' } },
                    false,
                    true
                ).then(() => {
                    KeyModel.deleteOne({ keyName: key }).then((result) => {
                        res.send({ status: 0, message: result })
                    }).catch((error) => {
                        res.send({ status: 1, message: error.message })
                    })
                }).catch((error) => {
                    res.send({ status: 1, message: error.message })
                })
            })
        }
    })
})
//修改学生属性名
StudentRouter.post('/update_keys',(req,res)=>{
    const {key,newKey} = req.body
    
    KeyModel.findOne({keyName:key}).then((result)=>{
        if (!result) res.send({ status: 1, message: "还没有创立这个属性" })
        else {
            MongoClient.connect(url).then(conn => {
                const students = conn.db("Amazon").collection("students")
                students.updateMany(
                    {},
                    { $rename: { [key]: newKey } },
                    false,
                    true
                ).then(() => {
                    KeyModel.updateOne({ keyName: key },{$set : {keyName : newKey}}).then((result) => {
                        res.send({ status: 0, message: "修改成功！" })
                    }).catch((error) => {
                        res.send({ status: 1, message: error.message })
                    })
                }).catch((error) => {
                    res.send({ status: 1, message: error.message })
                })
            })
        }
    })
})


StudentRouter.post('/add_student',(req,res)=>{
    const {id_card} = req.body
    StudentModel.findOne({id_card}).then((student)=>{
        if(student){
            res.send({status:1,message:`该身份证${id_card}已存在`})
            return new Promise(()=>{})
        }
        else{
            return StudentModel.insertMany(req.body)
        }
    }).then((student)=>{
        res.send({status:0,data:student})
    }).catch((error)=>{
        res.send({status:1,message:error.message})
    })
})

StudentRouter.get('/get_student',(req,res)=>{
    StudentModel.find({alive:true}).then((students)=>{
        res.send({status:0,data:students})
    }).catch((error)=>{
        res.send({status:1,message:error})
    })
})

StudentRouter.post('/delete_student',(req,res)=>{
    const {key} = req.body
    StudentModel.updateOne({_id:key},{$set:{alive:false}}).then((student)=>{
        res.send({status:0,message:'删除成功'})
    }).catch(error=>res.send({status:1,message:error.message}))
})

StudentRouter.post('/update_student',(req,res)=>{
    const {_id} = req.body
    StudentModel.updateOne({_id},{$set:req.body}).then((student)=>{
        res.send({status:0,data:student}) 
    }).catch(error=>res.send({status:1,message:error.message}))
})

StudentRouter.post('/add_score',(req,res)=>{
    const {_id,Math,Chinese,English} = req.body
    StudentModel.findOne({_id}).then((student)=>{
        if(student){
            return StudentModel.updateOne({_id},{$set:{Math,Chinese,English}})
        }
        else {
            res.send({status:1,message:'不存在改学生的信息'})
            return new Promise(()=>{})
        }
    }).then((response)=>{
        res.send({status:0,data:response
    })}).catch((error=>{
        res.send({status:1,message:error.message})
    }))
})

StudentRouter.get('/get_score',(req,res)=>{
    StudentModel.find({alive:true},{_id:1,name:1,Math:1,Chinese:1,English:1}).then((students_score)=>{
        res.send({status:0,data:students_score})
    }).catch((error=>{
        res.send({status:1,message:error.message})
    }))
})

StudentRouter.get('/get_aver',(req,res)=>{
    StudentModel.aggregate([
        {
          '$match': {
            'alive': true, 
            'Chinese': {
              '$exists': true
            }, 
            'English': {
              '$exists': true
            }, 
            'Math': {
              '$exists': true
            }
          }
        }, {
          '$group': {
            '_id': null, 
            'Chinese': {
              '$avg': '$Chinese'
            }, 
            'Math': {
              '$avg': '$Math'
            }, 
            'English': {
              '$avg': '$English'
            }
          }
        }
      ]).then((aver)=>{
        res.send({status:0,data:aver})
      }).catch((error=>{
        res.send({status:1,message:error.message})
    }))
})

StudentRouter.post('/get_preScore',(req,res)=>{
    const {_id} = req.body
    StudentModel.find({_id},{_id:1,Math:1,Chinese:1,English:1}).then((preScore)=>{
        res.send({status:0,data:preScore})
    }).catch((error=>{
        res.send({status:1,message:error.message})
    }))
})

module.exports = StudentRouter