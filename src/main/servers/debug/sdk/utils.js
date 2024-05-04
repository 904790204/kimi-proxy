import { PAGEID_KEY, REPORT_TYPE } from './constant'

// 批量上报
const logs = []
let timer
export const report = (params) => {
  logs.push(params)
  timer && clearTimeout(timer)
  timer = setTimeout(() => {
    sendMessage({
      logs,
      type: REPORT_TYPE.LOG
    })
    logs.splice(0, logs.length)
  }, 500)
}

// 链接服务端ws
export const linkWss = () =>
  new Promise((resolve, reject) => {
    const ws = new WebSocket('wss://kimiproxy.takim.cn/local/debug/log')
    // 连接成功后的回调函数
    ws.onopen = function () {
      // pConsole.log('客户端连接成功')
      // 向服务器发送消息
      window.sendMessage = (data) => {
        const params = {
          ...data,
          pageId: window[PAGEID_KEY],
          time: new Date().getTime()
        }
        // window.pConsole && pConsole.log(params)
        ws.send(JSON.stringify(params))
      }
      sendMessage({
        type: REPORT_TYPE.START
      })
      resolve()
    }

    // 从服务器接受到信息时的回调函数
    ws.onmessage = function (e) {
      // pConsole.log('收到服务器响应', e.data)
    }

    // 连接关闭后的回调函数
    ws.onclose = function (event) {
      // pConsole.log('关闭客户端连接')
      sendMessage({
        event,
        type: REPORT_TYPE.CLOSE
      })
    }

    // 连接失败后的回调函数
    ws.onerror = function (event) {
      // pConsole.log('连接失败了')
      sendMessage({
        event,
        type: REPORT_TYPE.CLOSE
      })
      reject()
    }

    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，这样服务端会抛异常。
    window.onbeforeunload = function () {
      sendMessage({
        type: REPORT_TYPE.CLOSE
      })
      ws.close()
    }
  })

export const isNotApi = (url) =>
  url?.indexOf('.js') !== -1 ||
  url?.indexOf('.css') !== -1 ||
  url?.indexOf('.html') !== -1 ||
  url?.indexOf('.ts') !== -1

// 监听页面是否切换到后台
class VisibilityStateObserve {
  constructor() {
    this.instance = null
    this.queue = []
    document.addEventListener(
      'visibilitychange',
      () => {
        this.queue.forEach((cb) => {
          cb(document.visibilityState === 'visible')
        })
      },
      false
    )
  }

  listenStatus(cb) {
    this.queue.push(cb)
  }

  // 获取IntersectionObserver的实例
  static getInstance() {
    if (!this.instance) {
      this.instance = new VisibilityStateObserve()
    }
    return this.instance
  }
}
export const visibility = () => {
  return VisibilityStateObserve.getInstance()
}
