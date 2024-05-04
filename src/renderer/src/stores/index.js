import React from 'react'

import common from './common'
import intercept from './intercept'
import mock from './mock'
import rewrite from './rewrite'
import debug from './debug'

class RootStore {
  constructor() {
    this.commonStore = common
    this.interceptStore = intercept
    this.mockStore = mock
    this.rewriteStore = rewrite
    this.debugStore = debug
  }
}

const rootStore = new RootStore()

const context = React.createContext(rootStore)

const useStore = () => React.useContext(context)

export { useStore }
