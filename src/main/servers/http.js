import handleRequest from './core'

// 创建http代理服务
const createHttpProxyServer = (server) => {
  // 拦截请求
  server.on('request', handleRequest)

  server.on('error', (e) => {
    console.error('createHttpProxyServer error', e)
  })
}

export default createHttpProxyServer
