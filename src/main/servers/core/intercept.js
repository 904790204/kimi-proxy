import url from 'url'

class Intercept {
  constructor() {
    this.intercepts = {}
    this.rewrites = []
    this.mocks = []
    this.matchhost = []
    this.serverDelay = 0
  }

  updataRewrites(list) {
    this.rewrites = list.map((el) => el.split(/\s+/))
  }

  updataMocks(list) {
    this.mocks = list
  }

  updataMatchHost(list) {
    this.matchhost = list
  }

  isMatchHost(host) {
    if (!this.matchhost.length) return true
    return this.matchhost.includes(host)
  }

  updataServerDelay(ratio) {
    this.serverDelay = ratio
  }
}

const intercept = new Intercept()

export default intercept
