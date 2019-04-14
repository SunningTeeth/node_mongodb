
//练习

//导入 http 模块
var http = require("http")

//引入 url 模块
var url = require("url")

//引入 ejs 引擎
var ejs = require("ejs")

//导入自己封装的类似于 node  的 express 框架
var app = require('./model/express.js')

//1.导入mongodb
var mongoClient = require("mongodb").MongoClient

//数据库url
var dbUrl = "mongodb://127.0.0.1:27017/"
//数据库名称
var dbName = "student"

//创建http服务
http.createServer(app).listen(8086)


//增加数据操作
app.get("/add", (req, res) => {

  mongoClient.connect(dbUrl, (err, client) => {

    if (err) {
      console.log("数据库连接失败！")
      console.log(err)
      return false
    }

    var db = client.db(dbName)

    db.collection("user").insertOne({
      "name": "yy",
      "age": 18
    }, (error, result) => {

      if (error) {
        console.log("增加数据失败")
        console.log(error)
        return false
      }

      console.log("增加数据成功")

      res.send('增加数据成功')

      client.close() //关闭数据库

    })



  })

})

//修改数据
app.get("/edit", (req, res) => {

  mongoClient.connect(dbUrl, (err, client) => {

    if (err) {
      console.log("连接数据库失败！")
      console.log(err)
      return false
    }

    var db = client.db(dbName)

    db.collection("user").updateOne({ "name": "daijiabao" }, { $set: { "age": 22 } }, (error, result) => {

      if (error) {

        console.log("修改数据失败！")
        console.log(error)
        return false
      }

      res.send("修改数据成功")

      console.log("修改数据成功")

      client.close()//关闭数据库
    })

  })


})

//删除数据
app.get("/del", (req, res) => {

  mongoClient.connect(dbUrl, (err, client) => {

    if (err) {

      console.log("连接数据库失败")

      console.log(err)

      return false
    }

    var db = client.db(dbName)

    db.collection("user").deleteOne({ "name": "daijiabao" }, (error, result) => {

      if (error) {
        console.log("删除数据失败")

        console.log(error)

        return false
      }

      res.send("删除数据成功")

      console.log("删除数据成功")

    })


  })
})

//查询数据
app.get("/find", (req, res) => {

  mongoClient.connect(dbUrl, (err, client) => {

    if (err) {
      console.log("连接数据库失败")
      console.log(err)
      return false
    }

    var db = client.db(dbName)

    var data = db.collection("user").find({})

    var list = []
    data.each(function (error, result) {

      if (error) {
        console.log(error)
      }

      if (result != null) {

        // 循环数据
        list.push(result)

      }else{
        // result == null 表示循环结束

        var msg = "<b>我就是我</b>"
        ejs.renderFile("./02-test.ejs",{list:list,msg:msg},function(errejs,datastr){

          // console.log(list)
          res.send(datastr)

        })
     

      }


    })

  })

})