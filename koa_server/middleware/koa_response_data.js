const path = require('path')
const fileUtils = require('../utils/readFiles')

module.exports = async (ctx, next) => {
  // /api/map
  const url = ctx.request.url
  // console.log(url);
  let newUrl = url.replace('/api', '')
  // json文件相对路径格式 ../data/xxxx.json
  newUrl = '../data' + newUrl + '.json'
  let filePath = path.join(__dirname, newUrl)
  // console.log(filePath);
  try {
    let res = await fileUtils.readFiles(filePath)
    ctx.response.body = res
  } catch (error) {
    const errmsg = {
      message: error,
      status: 404
    }
    ctx.response.body = errmsg
  }
  await next()
}
