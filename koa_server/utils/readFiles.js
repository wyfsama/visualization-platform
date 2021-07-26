const fs = require('fs')

module.exports.readFiles = function (filePath){
    return new Promise((res,rej)=>{
        fs.readFile(filePath,'utf-8',(err,data)=>{
            if(err){
                rej('读取出现错误')
            }else{
                // console.log(data);
                res(data)
            }
        })
    })
}