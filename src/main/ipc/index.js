import commonApi from './common'
import mockApi from './mock'
import rewriteApi from './rewrite'

export default () => {
  commonApi()
  mockApi()
  rewriteApi()
}
