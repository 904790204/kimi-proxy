export const handleWebLog = (res, data) => {
  console.log('handleWebLog', data)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end('ok')
}
