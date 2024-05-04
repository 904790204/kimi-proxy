import url from 'url'
import http from 'http'
import https from 'https'

const INVALID_HEADERS = ['keep-alive', 'http2-settings', 'proxy-connection', 'transfer-encoding']

// 请求目标数据
const fetchData = (options, body) =>
  new Promise((resolve, reject) => {
    const { port } = options
    const protocol = port === 443 ? https : http
    const request = protocol.request(options, (response) => {
      const responsebody = []
      response.on('data', (chunk) => {
        responsebody.push(chunk)
      })
      response.on('end', () => {
        resolve([Buffer.concat(responsebody), response])
      })
      response.on('error', (e) => {
        console.log('fetchData response error', e)
        reject(e)
        response.destroy()
      })
    })
    request.on('error', (e) => {
      console.log('fetchData request error', e)
      reject(e)
    })
    request.write(body)
    request.end()
  })

// 获取请求体
const getReqBody = (req) =>
  new Promise((resolve, reject) => {
    let postbody = []
    req.on('data', (chunk) => {
      postbody.push(chunk)
    })
    req.on('end', () => {
      resolve(Buffer.concat(postbody))
    })
    req.on('error', (e) => {
      console.log('getReqBody error', e)
      reject(e)
      req.destroy()
    })
  })

const setResponse = (res, body, info) => {
  const { headers = {}, statusCode } = info
  const newHeaders = {}
  for (let key in headers) {
    if (
      Object.prototype.hasOwnProperty.call(headers, key) &&
      !INVALID_HEADERS.includes(key.toLowerCase())
    ) {
      newHeaders[key] = headers[key]
    }
  }

  res.writeHead(statusCode, newHeaders)
  res.end(body)
}

const handleHttps = async (req, res) => {
  const { headers, url: fullUrl, method } = req
  const { hostname, port, path: targetPath } = url.parse(fullUrl)
  const { host } = headers
  const targetHost = hostname || (host ? host.split(':')[0] : null) || headers[':authority']
  const targetPort = port || (hostname ? 80 : 443)
  const targetHeaders = { host: targetHost }
  Object.keys(headers).forEach((key) => {
    if (key.indexOf(':') === -1) {
      targetHeaders[key] = headers[key]
    }
  })
  const options = {
    method,
    hostname: targetHost,
    port: targetPort,
    path: targetPath,
    headers: targetHeaders
  }

  const reqBody = await getReqBody(req)
  const [resBody, resInfo] = await fetchData(options, reqBody)
  setResponse(res, resBody, resInfo)
  // const {
  //   socket: { alpnProtocol },
  // } = req.httpVersion === "2.0" ? req.stream.session : req;
}

export default handleHttps
