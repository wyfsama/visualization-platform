export default class SocketService {
  /*
  单例
  */
  constructor () {
    this.ws = null
  }

  static instance = null

  static get Instance () {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  connect () {
    if (!window.WebSocket) {
      console.log('你的浏览器不支持websocket')
      return
    }
    this.ws = new WebSocket('ws://localhost:1112')
    this.ws.onopen = () => {
      console.log('连接成功')
    }
    this.ws.onclose = () => {
      console.log('连接失败')
    }
    this.ws.onmessage = msg => {
      console.log('从服务端获取数据')
      console.log(msg.data)
    }
  }
}
