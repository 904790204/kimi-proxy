import { REPORT_TYPE } from './constant'

// 不全
export const getCookies = () => {
  const cookies = {}
  const cookieList = document.cookie.split(';')
  for (let i = 0; i < cookieList.length; i++) {
    const cookie = cookieList[i].trim().split('=')
    const cookieName = cookie[0]
    const cookieValue = decodeURIComponent(cookie[1])
    cookies[cookieName] = cookieValue
  }
  pConsole.log('cookies: ', cookies)
  return cookies
}

export const getLocalStorageAll = () => {
  const len = localStorage.length
  const result = {}
  for (let i = 0; i < len; i++) {
    const getKey = localStorage.key(i)
    const getVal = localStorage.getItem(getKey)
    result[getKey] = getVal
  }
  pConsole.log('LocalStorage: ', result)
  return result
}

export const getSessionStorageAll = () => {
  const len = sessionStorage.length
  const result = {}
  for (let i = 0; i < len; i++) {
    const getKey = sessionStorage.key(i)
    const getVal = sessionStorage.getItem(getKey)
    result[getKey] = getVal
  }
  pConsole.log('SessionStorage: ', result)
  return result
}

const getStorage = () => {
  const cookie = getCookies()
  const localStorage = getLocalStorageAll()
  const sessionStorage = getSessionStorageAll()
  sendMessage({
    type: REPORT_TYPE.STORAGE,
    info: {
      cookie,
      localStorage,
      sessionStorage
    }
  })
}

export default getStorage
