import http from 'http'
import https from 'https'
import zlib from 'zlib'
import myEmitter from '../../utils/emitter'
import intercept from './intercept'
import { DEBUG_REQKEY } from '../../constant'

const requestConfig = {
  rejectUnauthorized: false
}

// 获取请求体
export const getReqBody = (req) =>
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

// 请求目标数据
export const fetchData = (options, body) =>
  new Promise((resolve, reject) => {
    const { port, protocol, headers } = options
    const isHttps = protocol === 'https:' || port === 443
    const protocolPkg = isHttps ? https : http
    const request = protocolPkg.request({ ...options, ...requestConfig }, (response) => {
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

// 设置返回值
export const setResponse = async (res, body, info, delay = 0) => {
  const { headers = {}, statusCode } = info
  for (let key in headers) {
    if (Object.prototype.hasOwnProperty.call(headers, key)) {
      res.setHeader(key, headers[key])
    }
  }
  if (delay) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, delay)
    })
  }
  res.statusCode = statusCode
  res.end(body)
}

// 解析zip数据
export const getZipData = (contentEncoding, data) =>
  new Promise((resolve) => {
    const isGzip = /gzip/i.test(contentEncoding)
    const isDeflate = /deflate/i.test(contentEncoding)
    const isBr = /br/i.test(contentEncoding)

    if (isGzip) {
      zlib.gunzip(data, function (err, decoded) {
        if (err) {
          resolve(data.toString())
          return
        }
        resolve(decoded ? decoded.toString() : decoded)
      })
    } else if (isDeflate) {
      zlib.inflate(data, (err, decoded) => {
        if (err) {
          resolve(data.toString())
          return
        }
        resolve(decoded ? decoded.toString() : decoded)
      })
    } else if (isBr) {
      zlib.brotliDecompress(data, (err, decoded) => {
        if (err) {
          resolve(data.toString())
          return
        }
        resolve(decoded ? decoded.toString() : decoded)
      })
    } else {
      resolve(data.toString())
    }
  })

// 解析zip数据
export const setZipData = (contentEncoding, data) =>
  new Promise((resolve, reject) => {
    const isGzip = /gzip/i.test(contentEncoding)
    const isDeflate = /deflate/i.test(contentEncoding)
    const isBr = /br/i.test(contentEncoding)

    if (isGzip) {
      zlib.gzip(data, function (err, encoded) {
        if (err) {
          reject(err)
          return
        }
        resolve(encoded)
      })
    } else if (isDeflate) {
      zlib.deflate(data, (err, encoded) => {
        if (err) {
          reject(err)
          return
        }
        resolve(encoded)
      })
    } else if (isBr) {
      zlib.brotliCompress(data, (err, encoded) => {
        if (err) {
          reject(err)
          return
        }
        resolve(encoded)
      })
    } else {
      resolve(data)
    }
  })

export const sendRequestInfo = (data) => {
  myEmitter.emit('request', data)
}

// 计算服务端延迟时间
export const getServerDelay = (start, end) => {
  const delay = (end - start) * intercept.serverDelay * 3
  const endTime = start + delay
  return {
    delay,
    end: endTime || end
  }
}
