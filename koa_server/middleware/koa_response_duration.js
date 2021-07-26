module.exports =async (ctx,next)=>{
    let start = Date.now()
    await next()
    let end = Date.now()
    let duration = end - start
    // console.log(duration);
    ctx.set('X-Response-Time',duration+'ms')
}