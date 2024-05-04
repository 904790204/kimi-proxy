import { report } from './utils'

const Methods = [
  'log',
  'debug',
  'info',
  'warn',
  'error',
  'table',
  'clear',
  'time',
  'timeEnd',
  'count',
  'assert',
  'command',
  'result',
  'dir'
]

const NativeMethod = {}

// 重写console
export default () => {
  for (let method of Methods) {
    const TargetConsole = window.console
    NativeMethod[method] = TargetConsole[method]

    TargetConsole[method] = function () {
      NativeMethod[method].apply(this, arguments)

      const args = [].slice.call(arguments)
      report({
        subclass: 'console',
        method,
        data: args
      })
    }
  }
  window.pConsole = NativeMethod
}
