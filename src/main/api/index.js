import { downloadCertificate } from './download'
import { handleWebLog } from './debug'

export default (req, res) => {
  const { options = {} } = req
  const { pathname } = options

  // 下载证书
  if (pathname === '/local/download/certificate') {
    downloadCertificate()
  }

  // debug日志上报
  if (pathname === '/local/debug/log') {
    const data = req.reqBody.toString()
    handleWebLog(res, data)
  }
}
