import localServer from '../../api'
const fetchLocal = (req, res, next) => {
  const { options = {} } = req
  const { hostname } = options
  // 本地请求
  if (hostname === 'kimiproxy.takim.cn') {
    localServer(req, res)
  } else {
    next()
  }
}

export default fetchLocal
