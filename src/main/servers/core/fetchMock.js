import { validateHeaderName } from 'http'
import intercept from './intercept'
import { sendRequestInfo } from './utils'

const fetchMock = (req, res, next) => {
  const { options } = req
  const mock = intercept.mocks.find((el) => {
    const { hostname: currentHostname, pathname: currentPath, method: currentMethod } = options

    const {
      hostname: targetHostname,
      path: targetPath = '/',
      method: targetMethod
      // baseUrl: targetBaseUrl
    } = el
    const isHostname =
      currentHostname === targetHostname || currentHostname === `www.${targetHostname}`
    const isPath = currentPath === targetPath
    const isMethod = currentMethod.toLowerCase() === targetMethod.toLowerCase()
    if (isHostname && isPath && isMethod) {
      return true
    }
    return false
  })
  if (mock) {
    const { response, statusCode, delay = 0, headers: resHeadersStr = '[]' } = mock
    let resHeaders = {
      'content-type': 'application/json; charset=utf-8'
    }
    try {
      const arr = JSON.parse(resHeadersStr)
      arr.forEach((item) => {
        res.setHeader(item.name, item.value)
        resHeaders[item.name] = item.value
      })
      res.setHeader('content-type', 'application/json; charset=utf-8')
      res.statusCode = statusCode
    } catch (error) {
      console.log(error)
    }

    const { headers, ...params } = req.options
    const startTime = new Date().getTime()

    setTimeout(() => {
      // 发射已拦截的数据
      sendRequestInfo({
        ...params,
        statusCode: statusCode,
        payload: req.reqBody.toString(),
        reqHeaders: headers,
        resHeaders,
        response,
        startTime,
        endTime: startTime + delay,
        size: response.length,
        reqStatus: 'success',
        resType: 'mock'
      })

      res.end(response)
    }, delay)
  } else {
    next()
  }
}

export default fetchMock
