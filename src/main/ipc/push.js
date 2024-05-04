// 向渲染进程发送请求拦截信息
// 每个请求都向渲染进程发消息太消耗性能，改成批量发，后面再优化
export const sendInterceptList = () => {
  let timer = null
  let items = []
  return (item) => {
    items.push(item)
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        global.mainWindow.webContents.send('ipc/intercept/list', items)
        // BrowserWindow.getFocusedWindow().webContents.send('ipc/intercept/list', items)
        items = []
      }, 1000)
    }
  }
}

export const sendDebugInfo = () => {
  let timer
  let result = {}
  return (data) => {
    if (!timer) {
      global.mainWindow.webContents.send('ipc/debug/info', data)
      timer = setTimeout(() => {
        clearTimeout(timer)
        global.mainWindow.webContents.send('ipc/debug/info', result)
        timer = null
      }, 500)
    } else {
      result = data
    }
  }
}
