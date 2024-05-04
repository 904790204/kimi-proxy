import url from 'url'
import MyKoa from './myKoa'
import { fetchTarget } from './fetchTarget'
import fetchMock from './fetchMock'
import fetchRewrite from './fetchRewrite'
import { getReqBody } from './utils'
import fetchLocal from './fetchLocal'

const app = new MyKoa()

// 处理req参数
app.use((req, res, next) => {
  const { method, url: fullUrl, headers } = req
  const { host, ...others } = headers
  const { hostname, port, protocol, pathname, path: fullPath, search, hash } = url.parse(fullUrl)
  const finalHostname = hostname || host.split(':')[0]
  const finalPort = port || (hostname ? 80 : 443)
  const finalProtocol = protocol || 'https:'
  const href = hostname ? fullUrl : `${finalProtocol}//${finalHostname}${fullUrl}`

  const options = {
    href,
    method,
    protocol: finalProtocol,
    hostname: finalHostname,
    port: finalPort,
    path: fullPath,
    pathname,
    search,
    hash,
    headers: {
      host,
      ...others
    }
  }
  req.options = options
  next()
})

// 处理请求体
app.use(async (req, res, next) => {
  const reqBody = await getReqBody(req)
  req.reqBody = reqBody
  next()
})

// 处理本地请求
app.use(fetchLocal)

// 处理mock
app.use(fetchMock)

// 处理转发
app.use(fetchRewrite)

// 请求目标服务
app.use(fetchTarget)

export default (req, res) => {
  app.handleRequest(req, res)
}
