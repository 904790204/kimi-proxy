import { WebSocketServer } from 'ws'
import { sendDebugInfo } from '../ipc/push'
const sendClientMsg = sendDebugInfo()

export const REPORT_TYPE = {
  START: 'start',
  CLOSE: 'close',
  LOG: 'log',
  INFO: 'info',
  ELEMENT: 'element',
  STORAGE: 'storage',
  VISIBLE: 'visible',
  HIDDEN: 'hidden'
}

const pageData = {}

// 清空数据对象
const clearMessage = (id) => {
  delete pageData[id]
  sendClientMsg(pageData)
}

// 初始化数据对象
const initMessage = (data) => {
  const { pageId, time } = data
  pageData[pageId] = {
    logs: [],
    info: {},
    time,
    visibility: true
  }
  sendClientMsg(pageData)
}

// 处理页面日志
const handlePageLog = (data) => {
  const { pageId, logs } = data
  pageData[pageId].logs?.push(...logs)
  sendClientMsg(pageData)
}

// 处理页面信息
const handlePageCommon = (data) => {
  const { pageId, type, info } = data
  pageData[pageId][type] = info
  sendClientMsg(pageData)
}

// 处理页面可见性
const handlePageVisibility = (data) => {
  const { type, pageId } = data
  const visibility = REPORT_TYPE.VISIBLE === type
  pageData[pageId].visibility = visibility
  sendClientMsg(pageData)
}

// 页面消息分发
const handlePageMessage = (data) => {
  const { type, pageId } = data
  switch (type) {
    case REPORT_TYPE.LOG:
      handlePageLog(data)
      break
    case REPORT_TYPE.START:
      clearMessage(pageId)
      initMessage(data)
      break
    case REPORT_TYPE.CLOSE:
      clearMessage(pageId)
      break
    case REPORT_TYPE.INFO:
    case REPORT_TYPE.ELEMENT:
    case REPORT_TYPE.STORAGE:
      handlePageCommon(data)
      break
    case REPORT_TYPE.VISIBLE:
    case REPORT_TYPE.HIDDEN:
      handlePageVisibility(data)
      break
    default:
      // handlePageCommon(data)
      break
  }
}

// 处理wss
export const handleDebugWss = (req, client, head) => {
  const wss = new WebSocketServer({
    noServer: true
  })
  // 连接事件
  wss.on('connection', (ws) => {
    // 往客户端发送 connected 事件，我们使用 type 来进行事件标识，这样方便客户端处理
    ws.send(JSON.stringify({ type: 'connected' }))
    ws.on('message', (data, isBinary) => {
      // 由于我们无法确定传过来的数据类型，因此要用 isBinary 区分 buffer 转化为字符串
      const receiveData = isBinary ? data : data.toString()
      try {
        handlePageMessage(JSON.parse(receiveData))
      } catch (error) {
        console.log('handleDebugWss', error)
      }
    })
  })
  wss.handleUpgrade(req, client, head, (ws) => {
    wss.emit('connection', ws, req)
  })
}
