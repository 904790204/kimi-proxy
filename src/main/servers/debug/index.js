import mime from 'mime'
import fs from 'fs'
import path from 'path'
import { setZipData } from '../core/utils'
import { v1 } from 'uuid'

const sdk = fs.readFileSync(path.resolve(__dirname, '../../resources/sdk/index.js'))

const insertDebugSdk = async (resInfo, resData, resBody) => {
  const { headers } = resInfo
  const contentType = headers['content-type']
  const type = mime.getExtension(contentType)
  let result = resData
  // html文件，并且有指定标签
  if (type === 'html' && resData.includes('html')) {
    // 插入sdk逻辑
    result = resData.replace(
      '</head>',
      `<script>window.kimiproxy_pageid = '${v1()}'; ${sdk}</script></head>`
    )
    // 判断是否需要压缩内容返回
    const contentEncoding = headers['content-encoding']
    if (contentEncoding) {
      try {
        result = await setZipData(contentEncoding, result)
      } catch (error) {
        console.log(error)
      }
    }
    return result
  }
  return resBody
}

export default insertDebugSdk
