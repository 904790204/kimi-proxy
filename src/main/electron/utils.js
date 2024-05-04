const os = require('os')

export const getIPAdress = () => {
  let interfaces = os.networkInterfaces()
  return Object.keys(interfaces).reduce((result, key) => {
    var iface = interfaces[key]
    for (var i = 0; i < iface.length; i++) {
      let alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return { ...result, [key]: alias.address }
      }
    }
    return result
  }, {})
}
