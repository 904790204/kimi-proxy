import log from './log'
import error from './error'
import storage from './storage'
import info from './info'
import request from './request'
import element from './element'
import { linkWss, visibility } from './utils'
import { PAGEID_KEY, REPORT_TYPE } from './constant'

// 初始化sdk
const initDebugSdk = () => {
  // 生成pageid，用于建立与服务端的链接
  const prevPid = sessionStorage.getItem(PAGEID_KEY)
  const pid = prevPid || window[PAGEID_KEY]
  window[PAGEID_KEY] = pid
  sessionStorage.setItem(PAGEID_KEY, pid)
  linkWss().then(() => {
    log()
    pConsole.log('kimiproxy_pageid', pid)
    info()
    error()
    storage()
    request()
    element()
  })
  visibility().listenStatus((status) => {
    const type = status ? REPORT_TYPE.VISIBLE : REPORT_TYPE.HIDDEN
    sendMessage({
      type
    })
  })
}

initDebugSdk()
