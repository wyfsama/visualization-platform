// 1.引入koa
const Koa = require('koa')
// 2.创建koa实例
const app = new Koa()
// 3.绑定中间件
// 3.1 加入计算运行时间中间件 koa_response_duration
const duration = require('./middleware/koa_response_duration')
app.use(duration)
// 3.2 加入处理响应头中间件 koa_response_header
const header = require('./middleware/koa_response_header')
app.use(header)
// 3.3 加入数据处理逻辑中间件 koa_response_data
const data = require('./middleware/koa_response_data')
app.use(data)
// 监听1111端口，成功返回ok
var port = process.env.PORT || 3000

app.listen(port, function () {
  console.log("Listening on " + port)

});

// const WebSocketServer = require('./service/web_socket_service')
// WebSocketServer.listen()

