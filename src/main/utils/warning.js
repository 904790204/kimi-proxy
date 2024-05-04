import log from 'electron-log'

// 客户端异常
export const handleClientError = (err, socket) => {
  if (!socket.writable) {
    return socket.destroy(err)
  }
  const errCode = err && err.code
  const statusCode = errCode === 'HPE_HEADER_OVERFLOW' ? 431 : 400
  const hostname = socket && socket.hostname
  const config = require('../../package.json')
  let result = [
    'From: ' + config.name + '@' + config.version,
    'Node: ' + process.version,
    'Host: ' + hostname,
    'Date: ' + new Date().toLocaleString(),
    'clientError: Bad request' + (errCode ? ' (' + errCode + ')' : '')
  ]
  result = result.join('\r\n')
  socket.end('HTTP/1.1 ' + statusCode + ' Bad Request\r\n\r\n' + result)
}

// 移除服务
export const removeServer = function () {
  try {
    this.close()
  } catch (e) {
    console.log(e)
  } //重复关闭会导致异常
}

// 全局异常处理
export const handleGlobalException = (type, event, origin) => {
  log.error(`APP-ERROR:${type}; event: ${JSON.stringify(event)}; origin:${JSON.stringify(origin)}`)
  setTimeout(function () {
    process.exit(1)
  }, 360)
}
