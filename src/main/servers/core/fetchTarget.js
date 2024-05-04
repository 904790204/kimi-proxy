import { fetchData, setResponse, getZipData, sendRequestInfo, getServerDelay } from './utils'
import insertDebugSdk from '../debug'
import { DEBUG_REQKEY } from '../../constant'
import { parse } from 'url'

// 处理错误
const handleError = (res, err) => {
  res.statusCode = 500
  res.end(`proxy error: ${JSON.stringify(err)}`)
}

// 处理请求
const fetchTarget = async (req, res, next) => {
  try {
    const startTime = new Date().getTime()
    const { options } = req
    const { headers: reqHeaders, ...params } = options
    // 带debug自定义header的请求
    // const isOptions = options.method === 'OPTIONS'
    // const isDebug =
    //   (reqHeaders['access-control-request-headers'] || '').includes(DEBUG_REQKEY.reqid) ||
    //   reqHeaders[DEBUG_REQKEY.reqid]
    // 请求目标服务时，处理debug的header
    // if (isDebug) {
    //   const reqMethod = (reqHeaders['access-control-request-method'] || '').toLowerCase()
    //   const acrh = reqHeaders['access-control-request-headers']
    //   const acrhArr = acrh
    //     ? acrh
    //         .split(',')
    //         .filter((el) => ![DEBUG_REQKEY.reqid, DEBUG_REQKEY.pageid].includes(el) && el)
    //     : undefined
    //   // 有值时
    //   if (acrhArr) {
    //     const methods = ['get', 'post', 'head']
    //     // 简单请求，不需要预检，直接返回成功
    //     if (acrhArr.length === 0 && methods.includes(reqMethod)) {
    //       res.setHeader(
    //         'access-control-allow-headers',
    //         `${DEBUG_REQKEY.reqid}, ${DEBUG_REQKEY.pageid}`
    //       )
    //       const referer = parse(reqHeaders['referer'])
    //       res.setHeader('access-control-allow-origin', `${referer.protocol}//${referer.hostname}`)
    //       res.setHeader('access-control-allow-credentials', true)
    //       res.statusCode = 200
    //       res.end('')
    //       return
    //     } else {
    //       reqHeaders['access-control-request-headers'] = acrhArr.join(',')
    //     }
    //   }
    // }
    // 请求目标服务器
    const [resBody, resInfo] = await fetchData(options, req.reqBody)
    // 后面看是否需要吧，不需要就不抛出解压的数据了
    let resdata = resBody.toString()
    const { headers: resHeaders, statusCode } = resInfo
    const contentEncoding = resInfo.headers['content-encoding']
    if (contentEncoding) {
      resdata = await getZipData(contentEncoding, resBody)
    }
    const endTime = new Date().getTime()
    const { delay, end } = getServerDelay(startTime, endTime)
    // 发射已拦截的数据
    sendRequestInfo({
      ...params,
      statusCode: statusCode,
      payload: req.reqBody.toString(),
      reqHeaders: reqHeaders,
      resHeaders: resHeaders,
      response: resdata,
      startTime,
      endTime: end,
      size: resBody.length,
      reqStatus: 'success',
      resType: 'normal'
    })
    // 插入debug sdk
    // const body = await insertDebugSdk(resInfo, resdata, resBody)
    // 返回时处理debug情况下的header
    // if (isDebug) {
    //   // 取出允许携带的header，将debug自定义header插入
    //   const acah = resHeaders['access-control-allow-headers'] || ''
    //   const keys = acah ? acah.split(',') : []
    //   keys.push(DEBUG_REQKEY.pageid)
    //   keys.push(DEBUG_REQKEY.reqid)
    //   // console.log(options.hostname, options.method, keys)
    //   resInfo.headers['access-control-allow-headers'] = keys.join(',')
    // }
    // 返回数据
    setResponse(res, resBody, resInfo, delay)
  } catch (error) {
    handleError(res, error)
  }
}

export { fetchTarget, handleError }
