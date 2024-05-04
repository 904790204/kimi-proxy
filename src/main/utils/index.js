import net from 'net'
import url from 'url'

// 随机端口号
export const getFreePort = () =>
  new Promise((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, () => {
      const port = server.address().port
      server.close(() => {
        resolve(port)
      })
    })
  })

// 是否IP
export const isIp = (domain) => {
  if (!domain) {
    return false
  }
  const ipReg = /^\d+?\.\d+?\.\d+?\.\d+?$/

  return ipReg.test(domain)
}

// 获取目标请求配置
export const getTargetOptions = (req) => {
  const { method, url: fullUrl, headers } = req
  const { host, ...others } = headers
  const { hostname, port, protocol, path: pathname } = url.parse(fullUrl)
  const finalHostname = hostname || host.split(':')[0]
  const finalPort = port || (hostname ? 80 : 443)
  const finalProtocol = protocol || 'https:'

  const options = {
    method,
    protocol: finalProtocol,
    hostname: finalHostname,
    port: finalPort,
    path: pathname,
    headers: {
      host,
      ...others
    }
  }
  return options
}

// 通过headers判断是否ws
export const isWsByHeaders = (headers) => {
  const upgrade = headers['upgrade' || headers['Upgrade']]
  const connection = headers['connection' || headers['Connection']]
  return (
    upgrade &&
    upgrade.toLowerCase() === 'websocket' &&
    connection &&
    connection.toLowerCase() === 'upgrade'
  )
}

// 不拦截名单，命中规则，不进行网络拦截
export const isNoIntercept = (host) => {
  const noIntercepts = ['kimiproxy.takim.cn']
  return noIntercepts.includes(host)
}
