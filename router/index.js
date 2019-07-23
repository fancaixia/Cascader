const Router = require('koa-router')
let routerIndex = new Router();

routerIndex.post('/get/Province', async(ctx)=> {

  let {level} = ctx.request.body;

  // 根目录数据  parentID为0 
  let	province_data = [
    {id:'1',name:'山东',parentid:'0',level:1},
    {id:'2',name:'河南',parentid:'0',level:1},
    {id:'3',name:'河北',parentid:'0',level:1},

  ]

  let city_data =[
    {id:'4',name:'德州',parentid:'1',level:2},
    {id:'5',name:'聊城',parentid:'1',level:2},
    {id:'6',name:'济宁',parentid:'1',level:2},
  ]

  let county_data = [
    {id:'7',name:'夏津',parentid:'4',level:3},
    {id:'8',name:'平原',parentid:'4',level:3},
    {id:'9',name:'齐河',parentid:'4',level:3},
  ]
  // 根据层级返回对应数据
  let data = [];
  if(level == 1){
    data = province_data;
  }else if(level == 2){
    data = city_data;
  }else if(level == 3){
    data = county_data;
  }else{
    data = []
  }
  // 模拟数据返回
  ctx.body = {code:0,msg:'ok',data,}
});

module.exports = routerIndex;
