import mime from 'mime/lite'

// 转换字节单位
export const byteConvert = (bytes) => {
  if (isNaN(bytes)) {
    return ''
  }
  let symbols = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let exp = Math.floor(Math.log(bytes) / Math.log(2))
  if (exp < 1) {
    exp = 0
  }
  let i = Math.floor(exp / 10)
  bytes = bytes / Math.pow(2, 10 * i)

  if (bytes.toString().length > bytes.toFixed(2).toString().length) {
    bytes = bytes.toFixed(2)
  }
  return bytes + ' ' + symbols[i]
}

export const getContentType = (data) => {
  const { reqHeaders, resHeaders } = data
  const contentType = resHeaders['content-type'] || reqHeaders['content-type']
  const type = mime.getExtension(contentType) || 'other'

  return type
}
// 复制内容到剪贴板
export const copyContent = (content) => {
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.value = content
  input.focus()
  input.select()
  document.execCommand('copy')
  input.parentNode.removeChild(input)
}

// 代理转对象
export const getProxyData = (proxy, val) => {
  try {
    const data = JSON.parse(JSON.stringify(proxy))
    return data
  } catch (error) {
    return val || {}
  }
}
