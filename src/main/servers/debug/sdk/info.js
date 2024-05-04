import { REPORT_TYPE } from './constant'

export default () => {
  const navigatorObject = window.navigator
  const { appCodeName, appName, appVersion, userAgent } = navigatorObject
  let system = 'other'
  if (!!userAgent.match(/compatible/i) || userAgent.match(/Windows/i)) {
    system = 'windows'
  }
  if (!!userAgent.match(/Macintosh/i) || userAgent.match(/MacIntel/i)) {
    system = 'macOS'
  }
  if (!!userAgent.match(/iphone/i) || userAgent.match(/Ipad/i)) {
    system = 'ios'
  }
  if (userAgent.match(/android/i)) {
    system = 'android'
  }

  const screenWidth =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  const screenHeight =
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

  const data = {
    system,
    appCodeName,
    appName,
    appVersion,
    width: screenWidth,
    height: screenHeight,
    hostname: location.hostname,
    pathname: location.pathname,
    href: location.href
  }
  sendMessage({
    type: REPORT_TYPE.INFO,
    info: data
  })
  pConsole.log(REPORT_TYPE.INFO, data)
}
