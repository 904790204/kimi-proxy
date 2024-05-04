import url from 'url'
import { fetchData, setResponse, getZipData, sendRequestInfo, getServerDelay } from './utils'
import intercept from './intercept'

const fetchRewrite = async (req, res, next) => {
  const { options } = req
  // 循环生效的rewrite列表，寻找匹配项
  const rewrite = intercept.rewrites.find((el) => {
    const frist = el[0]
    const {
      protocol: currentProtocol,
      hostname: currentHostname,
      port: currentPort,
      path: currentPath,
      method: currentMethod
    } = options

    const hasProtocol = frist.startsWith('http')
    const {
      protocol: targetProtocol,
      hostname: targetHostname,
      port: targetPort,
      path: targetPath = '/'
    } = url.parse(hasProtocol ? frist : `http://${frist}`)
    // const { href, method: targetMethod, type } = el

    // 判断协议是否匹配
    let isProtocol = false
    // 用户没填协议，则不关注协议
    if (!hasProtocol) {
      isProtocol = true
    } else if (targetProtocol) {
      // 用户已填协议，则判断协议是否与当前协议匹配
      isProtocol = currentProtocol ? currentProtocol === targetProtocol : true
    }
    const isHostname = currentHostname === targetHostname
    const isPort = targetPort && currentPort ? currentPort === targetPort : true
    const isPath = currentPath.startsWith(targetPath)

    if (isProtocol && isHostname && isPort && isPath) {
      return true
    }
    return false
  })

  // 转发逻辑
  if (rewrite) {
    // 当前请求的req
    const {
      path: optionsPath,
      method: optionsMethod,
      headers: optionsHeaders,
      protocol: optionsProtocol
    } = options
    // 获取用户配置
    const [before, after] = rewrite
    // 用户配置中是否有填写协议
    const hasBeforeProtocol = before.startsWith('http')
    const hasAfterProtocol = after.startsWith('http')
    // 用户配置中是否转发到本地服务
    const isLocal = after.includes('localhost') || after.includes('127.0.0.1')
    const startTime = new Date().getTime()
    // 结构转发后的目标服务
    const {
      path: afterPath,
      hostname: afterHostname,
      protocol: afterProtocol,
      port: afterPort
    } = url.parse(
      hasAfterProtocol ? after : isLocal ? `http://${after}` : `${optionsProtocol}//${after}`
    )
    // 用户填写的匹配path
    const { path: beforePath } = url.parse(hasBeforeProtocol ? before : `http://${before}`)
    // 组合新的目标path
    const resultPath = afterPath + optionsPath.replace(beforePath, '')
    // 过滤地址中的重复/
    // resultPath = resultPath.split('/').filter((el, i) => el || i === 0 ).join('/')
    const afterOptions = {
      protocol: afterProtocol,
      hostname: afterHostname,
      method: optionsMethod,
      port: afterPort ? afterPort : afterProtocol.includes('https') ? 443 : 80,
      headers: optionsHeaders,
      path: resultPath,
      pathname: resultPath
    }
    try {
      // 请求目标服务器
      const [resBody, resInfo] = await fetchData(afterOptions, req.reqBody)
      // 后面看是否需要吧，不需要就不抛出解压的数据了
      let resdata = resBody.toString()
      const contentEncoding = resInfo.headers['content-encoding']
      if (contentEncoding) {
        resdata = await getZipData(contentEncoding, resBody)
      }
      const endTime = new Date().getTime()
      const { headers, ...params } = options
      const { delay, end } = getServerDelay(startTime, endTime)
      // 发射已拦截的数据
      sendRequestInfo({
        ...params,
        statusCode: resInfo.statusCode,
        payload: req.reqBody.toString(),
        reqHeaders: headers,
        resHeaders: resInfo.headers,
        response: resdata,
        startTime,
        endTime: end,
        size: resBody.length,
        reqStatus: 'success',
        resType: 'rewrite'
      })
      // 返回数据
      setResponse(res, resBody, resInfo, delay)
    } catch (error) {
      console.log('fetchRewrite fetchData', error)
    }
  } else {
    next()
  }
}

export default fetchRewrite
