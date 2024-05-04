import { makeAutoObservable } from 'mobx'
import { fetchSwitchProxy, putMatchHost, fetchAppInfo } from '../servers/common'
import * as myDb from '../database'
import { PROXY_PORT, PROXYMODE_OPTIONS, MENU_PAGES } from '@src/constant/common'

class CommonStore {
  proxyChecked = false
  proxyCheckedLoading = false
  matchHosts = []
  allConfig = {}
  appInfo = {}

  constructor() {
    makeAutoObservable(this)
  }

  // 代理服务开关
  switchProxyChecked = (status) => {
    this.proxyCheckedLoading = true
    return new Promise((resolve, reject) => {
      fetchSwitchProxy({ status })
        .then((data) => {
          this.proxyCheckedLoading = false
          this.proxyChecked = status
          resolve(data)
        })
        .catch((err) => {
          this.proxyCheckedLoading = false
          reject(err)
        })
    })
  }

  // 更新精准匹配host推送到代理服务
  updataMatchHosts = async () => {
    const list = this.matchHosts.filter((el) => el.status).map((el) => el.name)
    await putMatchHost({ list })
  }

  // 获取精准匹配host
  getMatchHosts = async () => {
    const list = await myDb.getMatchHosts()
    this.matchHosts = list
    this.updataMatchHosts()
  }

  // 增加精准匹配host
  addMatchHosts = async (name) => {
    const val = { name, status: true }
    const id = await myDb.putMatchHosts(val)
    this.matchHosts = [...this.matchHosts, { ...val, id }]
    this.updataMatchHosts()
  }

  // 删除精准匹配host
  delMatchHosts = async (id) => {
    await myDb.delMatchHosts(id)
    this.matchHosts = this.matchHosts.filter((el) => el.id !== id)
    this.updataMatchHosts()
  }

  // 切换精准匹配host
  switchMatchHosts = (id, name, status) => {
    myDb.putMatchHosts({ id, name, status })
    this.matchHosts = this.matchHosts.map((el) => {
      if (el.id === id) {
        return {
          ...el,
          status
        }
      }
      return el
    })
    this.updataMatchHosts()
  }

  // 获取全局配置
  getAllConfig = () => {
    const localConfig = localStorage.getItem('allConfig')
    const config = localConfig ? JSON.parse(localConfig) : {}
    const result = {
      mode: PROXYMODE_OPTIONS[0].value,
      port: PROXY_PORT,
      home: MENU_PAGES[0].value,
      update: true,
      ...config
    }
    this.allConfig = result
    return result
  }

  // 保存全局配置
  saveAllConfig = (key, value) => {
    const result = {
      ...this.allConfig,
      [key]: value
    }
    this.allConfig = result
    localStorage.setItem('allConfig', JSON.stringify(result))
  }

  // 获取应用信息
  getAppInfo = async () => {
    const { data } = await fetchAppInfo()
    this.appInfo = data
    return data
  }
}

const common = new CommonStore()

export default common
