import { REPORT_TYPE } from './constant'
const getDocumentHTML = () => document.documentElement.outerHTML

export default () => {
  window.onload = () => {
    sendMessage({
      type: REPORT_TYPE.ELEMENT,
      html: getDocumentHTML()
    })
    var targetNode = document.querySelector('html')
    pConsole.log(111111111, targetNode)
    //options：监听的属性
    var options = { attributes: true, childList: true, subtree: true, attributeOldValue: true }
    //回调事件
    function callback(mutationsList, observer) {
      pConsole.log(mutationsList)
      pConsole.log(observer)
      pConsole.log(111111111)
      sendMessage({
        type: REPORT_TYPE.ELEMENT,
        mutationsList,
        observer
      })
    }
    var mutationObserver = new MutationObserver(callback)
    mutationObserver.observe(targetNode, options)
  }
}
