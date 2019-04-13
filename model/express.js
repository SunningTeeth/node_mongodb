
//导入 url 模块
var url = require('url')


//封装一下 res发送头的方法
function changeRes(res) {

  res.send = function (datastr) {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" })

    res.end(datastr)
  }

}


var Server = function () {

  var G = this //全局

  //处理get请求
  G._get = {}

  //处理post请求
  G._post = {}

  var app = function (req, res) {

    //调用封装的 res发送头方法
    changeRes(res)

    //获取 url 路劲
    var pathname = url.parse(req.url).pathname

    if (pathname.startsWith('/')) {

      pathname = "/" + pathname

    }

    //获取请求的方法   get or post
    var method = req.method.toLowerCase()

    if (G["_"+method][pathname]) {//如果输入的路由存在

      if (method == "get") {
        //调用
        G["_" + method][pathname](req, res)


      } else if (method == "post") {

        var str = ""

        // post 请求获取用户输入的数据
        req.on("data", function (chunk) {

          str += chunk
        })

        req.on("end", function (chunk) {

          console.log(str)

          req.myData = str //表示获取post请求的数据

          G["_" + method][pathname](req, res)
        })

      }




    } else {//路由不存在

      res.send(' no this router')
    }


  }


  app.get = function (string, callback) {

    if (string.endsWith('/')) {

      string = string + "/"

    }

    if (string.startsWith('/')) {

      string = "/" + string

    }

    G._get[string] = callback
  }


  app.post = function (string, callback) {

    if (string.endsWith('/')) {

      string = string + "/"

    }

    if (string.startsWith('/')) {

      string = "/" + string

    }

    G._post[string] = callback
  }


  return app

}


module.exports = Server()