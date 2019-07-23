const koa=require('koa')
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors') 
const staticFile = require('koa-static') 
const router = require('./router/index')
const path = require('path')

const server= new koa()

//解决跨域
server.use(cors({
  origin: function (ctx) {
    // console.log(ctx.url)
    return '*';  // 接收来自所有域的请求
    // return 'http://localhost:3000'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],

  
}))

server.use(bodyParser());   //接受http请求数据
server.use(staticFile(path.join(__dirname + '/static'))) // 配置默认访问地址

server
  .use(router.routes())  // 登录
  // .use(router.allowedMethods());


server.listen(8080)






