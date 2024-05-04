import fs from 'fs'
import { mkcertFilePath } from '../utils/certificate'

export const downloadCertificate = (options, res) => {
  const stats = fs.statSync(mkcertFilePath)
  res.setHeader('Content-Type', 'application/octet-stream')
  res.setHeader('Content-Disposition', 'attachment; filename=KimProxy.crt')
  res.setHeader('Content-Length', stats.size)
  fs.createReadStream(mkcertFilePath).pipe(res)
}
