import url from 'url'
import tls from 'tls'
import net from 'net'
import https from 'https'
import http2 from 'http2'
import { getHostCertificate } from '../utils/certificate'
import { isIp } from '../utils'
import { handleClientError } from '../utils/warning'
import handleRequest from './core'
import handleHttp2 from './core/Http2Server'
import handleWebscoket from './core/fetchWebsocket'
import myEmitter from '../utils/emitter'
import intercept from './core/intercept'
import { BLACK_HOST } from '../constant'

const LOCAL_IP = '127.0.0.1'

const fakeServers = {}

const getFakeServer = (name) => fakeServers[name]
const setFakeServer = (name, value) => (fakeServers[name] = value)
const removeFakeServer = (name) => delete fakeServers[name]

// 创建伪造的服务
const createFakeHttpsServer = (domain, successFun, errorFun) => {
  if (getFakeServer(domain)) {
    const fakeServer = getFakeServer(domain)
    return successFun(fakeServer.address().port, fakeServer)
  }
  const fakeServer = https.createServer({
    // const fakeServer = http2.createSecureServer({
    //   allowHTTP1: true,
    //   maxSessionMemory: 128,
    //   settings: { enablePush: false, enableConnectProtocol: false },
    SNICallback: (hostname, done) => {
      // 生成证书
      getHostCertificate(hostname)
        .then((certObj) => {
          try {
            const ctx = tls.createSecureContext({
              key: certObj.key,
              cert: certObj.cert
            })
            done(null, ctx)
          } catch (error) {
            return Promise.reject(error)
          }
        })
        .catch((e) => {
          done(e)
          console.log(e)
        })
    }
  })

  // 监听随机端口，执行回调函数
  fakeServer.listen(0, () => {
    setFakeServer(domain, fakeServer)
    successFun(fakeServer.address().port, fakeServer)
  })
  // 监听ws
  fakeServer.on('upgrade', handleWebscoket)
  // 监听发到伪造服务上的请求
  fakeServer.on('request', handleRequest)
  // fakeServer.on('request', handleHttp2)

  // 服务端错误
  fakeServer.on('error', (e) => {
    console.error('createFakeHttpsServer error', e)
    removeFakeServer(domain)
    try {
      fakeServer.close()
    } catch (error) {
      console.log(error)
    }
    errorFun({ errorType: 'serverError', event: e || {} })
  })
  // 客户端错误
  fakeServer.on('clientError', (e, socket) => {
    handleClientError(e, socket)
    console.error('createFakeHttpsServer clientError', e)
    errorFun({ errorType: 'clientError', event: e || {} })
  })
  fakeServer.on('close', () => {
    removeFakeServer(domain)
  })
  setTimeout(() => {
    removeFakeServer(domain)
    try {
      fakeServer.close()
    } catch (error) {
      console.log(error)
    }
  }, 6000)
}

// 启动https代理
const createHttpsProxyServer = (server) => {
  // https的请求通过http隧道方式转发
  server.on('connect', (req, cltSocket, head) => {
    const srvUrl = url.parse(`http://${req.url}`)
    const { port, hostname } = srvUrl
    cltSocket.write('HTTP/' + req.httpVersion + ' 200 OK\r\n\r\n', 'UTF-8')
    // 是否拦截
    if (intercept.isMatchHost(hostname) && !isIp(hostname) && !BLACK_HOST.includes(hostname)) {
      // if (isIntercept && !isIp(hostname)) {
      console.log(`CONNECT ${hostname}:${port}`)
      // 创建伪造的目标服务
      createFakeHttpsServer(
        hostname,
        (port) => {
          // 向目标服务器发起链接
          createTargetConnect(cltSocket, head, port)
        },
        (error) => {
          const { headers, method } = req
          const { errorType, event } = error
          const info = {
            href: hostname,
            hostname,
            method,
            statusCode: null,
            path: '/',
            reqHeaders: headers,
            resHeaders: {},
            response: '',
            startTime: new Date().getTime(),
            endTime: new Date().getTime(),
            size: 0,
            reqStatus: 'error',
            errorType: errorType,
            event: {
              error: event.toString(),
              ...event
            }
          }
          myEmitter.emit('request', info)
        }
      )
    } else {
      // 不伪造目标服务，拿不到请求数据
      createTargetConnect(cltSocket, head, port, hostname)
    }

    cltSocket.on('error', (e) => {
      console.error('createHttpsProxyServer error', e)
      cltSocket.destroy()
    })
  })
}

// 建立目标链接
const createTargetConnect = (cltSocket, head, port, hostname = LOCAL_IP) => {
  const srvSocket = net.connect(port, hostname, () => {
    srvSocket.write(head)
    srvSocket.pipe(cltSocket)
    cltSocket.pipe(srvSocket)
  })
  srvSocket.on('error', (e) => {
    console.error('createTargetConnect error', e)
    srvSocket.destroy()
  })
}

export default createHttpsProxyServer
