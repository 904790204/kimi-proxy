// https://www.bookstack.cn/read/https-mitm-proxy-handbook/doc-Chapter2.md
import http from 'http'
import myEmitter from '../utils/emitter'
import createHttpProxyServer from './http'
import createHttpsProxyServer from './https'
import { sendInterceptList } from '../ipc/push'
import { isRootCATrusted } from '../utils/certificate'
import { handleClientError, handleGlobalException } from '../utils/warning'
import { switchWebProxy } from '../electron/command'
import { MODES } from '../constant'

let proxyServer = null
let handleSendMessage = null
let port = 8878
let isAllProxy = true

// 监听所有拦截的请求，获取请求数据
myEmitter.on('request', (data) => {
  if (!handleSendMessage) {
    handleSendMessage = sendInterceptList()
  }
  handleSendMessage(data)
})

// 开启代理服务
export const serverStart = async () => {
  const state = await isRootCATrusted()
  console.log('是否信任证书', state)
  if (!state) {
    return Promise.reject({
      code: 'CA_NOT_TRUST'
    })
  }

  // 桌面端、移动端代理有一个启动的就不需要再次启动
  if (!proxyServer) {
    proxyServer = new http.Server()
    createHttpsProxyServer(proxyServer)
    createHttpProxyServer(proxyServer)

    proxyServer.listen(port, (err) => {
      if (err) {
        return Promise.reject(err)
      }
      console.log('proxy server start')
      return Promise.resolve(err)
    })

    proxyServer.on('clientError', handleClientError)

    proxyServer.on('error', (e) => {
      if (e.code == 'EADDRINUSE') {
        console.error('HTTP中间人代理启动失败！！')
        console.error(`端口：${port}，已被占用。`)
      } else {
        console.log('报错，需重启')
        console.error(e)
      }
    })
    if (isAllProxy) {
      switchWebProxy(true, port)
    }
  }
  return Promise.resolve()
}

// 关闭代理服务
export const serverEnd = () => {
  proxyServer && proxyServer.close()
  proxyServer = null
  switchWebProxy(false)
}

// 重启服务
export const serverReset = (p) => {
  if (p) {
    port = p
  }
  if (proxyServer) {
    serverEnd()
    serverStart()
  }
}

// 设置代理模式
export const setProxyMode = (val) => {
  isAllProxy = MODES.all === val
  // 代理服务开启，切换系统代理设置
  if (proxyServer) {
    switchWebProxy(isAllProxy, port)
  }
}

// 异常监听
process.on('unhandledRejection', (...arg) => handleGlobalException('unhandledRejection', ...arg))
process.on('uncaughtException', (...arg) => handleGlobalException('uncaughtException', ...arg))
