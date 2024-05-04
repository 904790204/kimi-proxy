
// 向渲染进程发送请求拦截信息
// 每个请求都向渲染进程发消息太消耗性能，改成批量发，后面再优化
export const sendMessage = () => {
  let timer = null
  let items = []
  return (item) => {
    items.push(item)
    if(!timer) {
      timer = setTimeout(() => {
        timer = null
        global.mainWindow.webContents.send('api/intercept/list', items)
        // BrowserWindow.getFocusedWindow().webContents.send('api/intercept/list', items)
        items = []
      }, 1000)
    }
  }
}

// 向渲染进程发送消息
const handleSendMessage = (type) => (data) => {
  global.win.webContents.send(type, data)
}

export default {
  // 有更新时通知渲染进程
  sendUpdaterConfirm: handleSendMessage('updaterConfirm'),
  // 更新包下载进度
  sendUpdaterProgress: handleSendMessage('updaterProgress'),
  // 更新包下载完成
  sendUpdaterComplete: handleSendMessage('updaterComplete'),
  // 没有更新包
  sendNotUpdater: handleSendMessage('notUpdater'),
  // 更新报错
  sendUpdaterError: handleSendMessage('updaterError'),
  // 信任证书失败
  sendTrustCAComplete: handleSendMessage('trustCAComplete')
}