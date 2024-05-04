import { v4 } from 'uuid'
import { isNotApi } from './utils'
import { PAGEID_KEY } from './constant'
import { DEBUG_REQKEY } from '../../../constant'

export default () => {
  handleXhr()
  handleFetch()
}
// 是否IP
export const isIp = (domain) => {
  if (!domain) {
    return false
  }
  const ipReg = /^\/\/\d+?\.\d+?\.\d+?\.\d+?/
  return ipReg.test(domain)
}

export const handleXhr = () => {
  if (!window.XMLHttpRequest) {
    return
  }
  const pageid = sessionStorage.getItem(PAGEID_KEY)

  // 收集完信息 _fun.apply(this,arguments)防污染原型
  const _open = window.XMLHttpRequest.prototype.open

  window.XMLHttpRequest.prototype.open = function (method, url, boolen) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    // const args = [].slice.call(arguments)
    const _onreadystatechange =
      self.onreadystatechange ||
      function () {
        //
      }

    self.addEventListener('readystatechange', function () {
      if (self.readyState === 0) {
        // UNSENT
      } else if (self.readyState === 1) {
        // OPEN
        if (url && (typeof url === 'string' || url instanceof String)) {
          const isApi = !isNotApi(url)
          const reqId = v4()

          if (isApi && !isIp(url)) {
            self.setRequestHeader(DEBUG_REQKEY.reqid, reqId)
            self.setRequestHeader(DEBUG_REQKEY.pageid, pageid)
          }
        }
      } else if (self.readyState === 2) {
        // HEADERS_RECEIVED
      } else if (self.readyState === 3) {
        // LOADING
      } else if (self.readyState === 4) {
        // DONE
      }
      // eslint-disable-next-line prefer-rest-params
      return _onreadystatechange.apply(self, arguments)
    })

    // eslint-disable-next-line prefer-rest-params
    return _open.apply(self, arguments)
  }
}

// fetch的拦截
export const handleFetch = () => {
  const pageid = sessionStorage.getItem(PAGEID_KEY)
  const originFetch = fetch
  Object.defineProperty(window, 'fetch', {
    configurable: true,
    enumerable: true,
    // writable: true, // 不能同时设置 writable 与get
    get() {
      return (url, options) => {
        const reqId = v4()
        const isApi = !isNotApi(url)
        if (isApi && !isIp(url)) {
          if (options) {
            options.headers = {
              ...options?.headers,
              [DEBUG_REQKEY.reqid]: reqId,
              [DEBUG_REQKEY.pageid]: pageid
            }
          } else {
            options = {
              headers: {
                [DEBUG_REQKEY.reqid]: reqId,
                [DEBUG_REQKEY.pageid]: pageid
              }
            }
          }
        }
        return new Promise((resolve, reject) => {
          originFetch(url, {
            ...options
          })
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
      }
    },
    set() {
      //兼容业务的window.fetch重写问题
    }
  })
}
