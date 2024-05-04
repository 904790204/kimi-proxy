import { makeAutoObservable } from 'mobx'
import { INTERCEPT_MAX } from '@src/constant/intercept'

class InterceptStore {
  interceptList = []
  hostname = ''
  type = 'all'
  isReferer = false

  constructor() {
    makeAutoObservable(this)
  }

  updataInterceptList = (list) => {
    // 超过最大值，停止更新
    if (this.interceptList.length >= INTERCEPT_MAX) return
    if (this.interceptList.length + list.length >= INTERCEPT_MAX) {
      const num = INTERCEPT_MAX - this.interceptList.length
      const val = list.slice(0, num)
      this.interceptList = [...this.interceptList, ...val]
      return
    }
    this.interceptList = [...this.interceptList, ...list]
  }

  clearInterceptList = () => {
    this.interceptList = []
  }

  setFilter = ({ hostname, type, isReferer }) => {
    this.hostname = hostname ?? this.hostname
    this.type = type || this.type
    this.isReferer = isReferer || this.isReferer
  }

  get list() {
    const result = this.interceptList.filter((el) => {
      const { hostname = '', resHeaders: { referer = '', accept = '' } = {} } = el
      let hostStatus = false
      let typeStatus = false
      // 需要过滤hostname
      if (this.hostname) {
        // 考虑referer，则看referer是否包含hostname
        if (this.isReferer && referer.includes(this.hostname)) {
          hostStatus = true
        }
        // 不考虑referer，则只看是否包含hostname
        if (!this.isReferer && hostname.includes(this.hostname)) {
          hostStatus = true
        }
      } else {
        hostStatus = true
      }
      const type = el.resHeaders['content-type'] || ''
      const isJson = type.includes('json')
      const isJs = type.includes('javascript')
      const isCss = type.includes('css')
      const isImg = type.includes('image')
      const isHtml = type.includes('html')
      const isOther = !isJson && !isJs && !isCss && !isImg && !isHtml
      if (this.type === 'all') {
        typeStatus = true
      }
      if (this.type === 'json' && isJson) {
        typeStatus = true
      }
      if (this.type === 'js' && isJs) {
        typeStatus = true
      }
      if (this.type === 'css' && isCss) {
        typeStatus = true
      }
      if (this.type === 'img' && isImg) {
        typeStatus = true
      }
      if (this.type === 'html' && isHtml) {
        typeStatus = true
      }
      if (this.type === 'other' && isOther) {
        typeStatus = true
      }
      return hostStatus && typeStatus
    })
    return result
  }
}

const common = new InterceptStore()

export default common
