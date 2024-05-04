import tls from 'tls'
import { lookup } from 'lookup-dns-cache'
import { getTargetOptions } from '../../utils'
// import { handleDebugWss } from '../../api/debugWss'

function getRawHeaders(headers) {
  var rawData = []
  Object.keys(headers).forEach(function (key) {
    var value = headers[key]
    if (Array.isArray(value)) {
      value.forEach(function (val) {
        rawData.push(key + ': ' + (val || ''))
      })
    } else {
      rawData.push(key + ': ' + (value || ''))
    }
  })
  return rawData.join('\r\n')
}
function formatHeaders(headers, rawHeaders) {
  if (!rawHeaders) {
    return headers
  }
  var newHeaders = {}
  if (Array.isArray(rawHeaders)) {
    var rawHeadersMap = {}
    for (var i = 0, len = rawHeaders.length; i < len; i += 2) {
      var name = rawHeaders[i]
      if (typeof name === 'string') {
        rawHeadersMap[name.toLowerCase()] = name
      }
    }
    rawHeaders = rawHeadersMap
  }
  Object.keys(headers).forEach(function (name) {
    newHeaders[(rawHeaders[name] || name).trim()] = headers[name]
  })
  return newHeaders
}

// 处理ws
const handleWebscoket = (req, client, head) => {
  const { hostname, port = 443, path = '/' } = getTargetOptions(req)
  // if (hostname === 'kimiproxy.takim.cn') {
  //   handleDebugWss(req, client, head)
  //   return
  // }
  lookup(hostname, {}, (err, ip, family) => {
    if (err) {
      client.destroy && client.destroy()
      return
    }
    console.log('upgrade', hostname, ip, family)

    const options = {
      rejectUnauthorized: false,
      host: ip,
      port,
      servername: hostname
    }

    client.pause()
    const reqSocket = tls.connect(options, () => {
      let rawData = [`GET ${path} HTTP/1.1`]
      let newHeaders = formatHeaders(req.headers, req.rawHeaders)
      rawData.push(getRawHeaders(newHeaders))
      rawData = Buffer.from(rawData.join('\r\n') + '\r\n\r\n')
      reqSocket.write(rawData)
      reqSocket.pipe(client).pipe(reqSocket)
      client.resume()
    })

    reqSocket.on('error', (err) => {
      console.log('tls.connect error', err)
    })
  })
}

export default handleWebscoket
