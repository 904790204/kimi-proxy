import { makeAutoObservable } from 'mobx'

class DebugStore {
  debugInfo = {}

  constructor() {
    makeAutoObservable(this)
  }

  updataDebugInfo = (data) => {
    this.debugInfo = data
  }
  updataNetworkList = (data = []) => {
    data.forEach((item) => {
      const pageId = item.reqHeaders['x-kimi-pageid']
      if (pageId && this.debugInfo[pageId]) {
        if (this.debugInfo[pageId].requests) {
          this.debugInfo[pageId].requests = [...this.debugInfo[pageId].requests, item]
        } else {
          this.debugInfo[pageId].requests = [item]
        }
      }
    })
  }
}

const debug = new DebugStore()

export default debug
