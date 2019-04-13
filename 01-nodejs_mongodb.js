//导入 http 模块
var http = require("http")

//引入 url 模块
var url = require("url")

//引入 ejs 引擎
var ejs = require("ejs")

//导入自己封装的类似于 node  的 express 框架
var app = require('./model/express.js')

// 1.引入数据库 MongoClient
var MongoClient = require("mongodb").MongoClient;

// 2.数据库的连接地址  student表示数据库的名称
var dbUrl = "mongodb://127.0.0.1:27017/"

//数据库名称
var dbName = "student"



//创建http服务
http.createServer(app).listen(8088)


//增加数据
app.get('/add', function (req, res) {

  //连接数据库
  MongoClient.connect(dbUrl, function (err, client) {

    if (err) {
      console.log(err)
      console.log("连接数据库失败！")
      return false
    }

    let db = client.db(dbName)

    db.collection("user").insertOne({
      "name": "dw",
      "age": 18
    }, function (error, result) {
      if (error) {
        console.log("增加数据失败")
        return false
      }

      res.send("增加数据成功")

      client.close() //关闭数据库
    })


  })

})


//修改数据
app.get('/edit', function (req, res) {

  //连接数据库
  MongoClient.connect(dbUrl, function (err, client) {

    if (err) {
      console.log(err)
      console.log("连接数据库失败！")
      return false
    }

    let db = client.db(dbName)

    db.collection("user").updateOne({
      "name": "dw",
      "age": 18
    }, {
        $set: { "age": 20 }
      }
      , function (error, result) {
        if (error) {
          console.log("修改数据失败")
          return false
        }

        res.send("修改数据成功")

        client.close() //关闭数据库
      })


  })
})


//删除数据
app.get('/del', function (req, res) {

  //获取地址栏用户输入的参数
  var query = url.parse(req.url, true).query;

  //连接数据库
  MongoClient.connect(dbUrl, function (err, client) {

    if (err) {
      console.log(err)
      console.log("连接数据库失败！")
      return false
    }

    let db = client.db(dbName)

    db.collection("user").deleteOne({
      "name": query.name
    }, function (error, result) {
      if (error) {
        console.log("删除数据失败")
        return false
      }

      res.send("删除数据成功")

      client.close() //关闭数据库
    })


  })
})


//查询数据
app.get("/find", function (req, res) {

  MongoClient.connect(dbUrl, function (err, client) {

    if (err) {
      console.log("连接数据库失败！")
      return false
    }

    db = client.db(dbName)

    var result = db.collection("user").find({})

    var list = [] // 存放查询的数据

    result.each((error, doc) => {

      // 注意： 每次查询完成数据之后，doc 就等于 null
      // console.log(doc)
      

      if (error) {
        console.log(error)
      } else {

        if (doc != null) {

          list.push(doc)

        }else if( doc == null ){ //doc == null  表示数据循环完成

          // console.log(list)

          ejs.renderFile("./views/demo.ejs",{list:list},function(ejserr,ejsData){

            if( ejserr ){
              console.log(ejserr)
              return false
            }

            res.send(ejsData)

          })


        }

      }
    })

  })

})