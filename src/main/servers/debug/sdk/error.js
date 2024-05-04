import { report } from './utils'

export default () => {
  window.addEventListener(
    'error',
    (event) => {
      // js错误
      if (event.error instanceof Error) {
        pConsole.log('jsError', event)
        report({
          subclass: 'jsError',
          message: event.message,
          stack: event.error?.stack || ''
        })
      }
      // 资源错误
      const target = event.target || event.srcElement
      if (
        target instanceof HTMLElement &&
        ['LINK', 'SCRIPT', 'IMG'].indexOf(target.nodeName) !== -1
      ) {
        const src = target.src || target.href
        if (window.location.href.indexOf(src) !== 0) {
          pConsole.log('resourceError', event, event.target.src)
          report({
            subclass: 'resourceError',
            message: event.message,
            tagName: event.target.tagName,
            src: event.target.src
          })
        }
      }
    },
    true
  )
  // promise错误
  window.addEventListener('unhandledrejection', (e) => {
    pConsole.log('unhandledrejection', e.reason)
    report({
      subclass: 'unhandledrejection',
      reason: e.reason
    })
  })
}
