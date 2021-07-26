module.exports =async (ctx,next)=>{
    let contentType = 'application/json; charset=utf-8'
    ctx.set('Content-Type',contentType)
    // 跨域设置
    // Access-Control-Allow-Origin：*
    // Access-Control-Allow-Methods："POST, GET, OPTIONS, DELETE"
    ctx.set('Access-Control-Allow-Origin','*')
    ctx.set('Access-Control-Allow-Methods','POST, GET, OPTIONS, DELETE')
    await next()
}