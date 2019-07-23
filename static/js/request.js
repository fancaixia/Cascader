// promise 封装request 请求
function Request(options){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:options.url,
            data:options.data,
            dataType:'json',
            method:'POST',
            success:function(data){
                resolve(data)
            },
            error:function(err){
                reject(err)
                console.log(err, "获取数据失败")
            }
        })
    })
}