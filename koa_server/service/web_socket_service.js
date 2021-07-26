const WebSocket = require('ws')
const path = require('path')
const fileUtils = require('../utils/readFiles')
const wss = new WebSocket.Server({
    port: 1112
})

module.exports.listen = () => {
    wss.on('connection', ws => {
        console.log('客户端连接成功')
        ws.on('message', async msg => {
            console.log('客户端发送数据到服务端：' + msg)
            let payload = JSON.parse(msg)
            const action = payload.action
            if (action === 'getData') {
                let chartName = payload.chartName
                let filePath = '../data/' + chartName + '.json'
                filePath = path.join(__dirname, filePath)
                let res = await fileUtils.readFiles(filePath)
                payload.data = res
                ws.send(JSON.stringify(payload))
            } else {
                wss.clients.forEach(ws => {
                    ws.send(msg)
                })
            }
        })
    })
}

