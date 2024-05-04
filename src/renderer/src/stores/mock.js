import { makeAutoObservable } from 'mobx'
import {
  putMockApps,
  getMockApps,
  delMockApps,
  putMockList,
  getMockList,
  delMockList,
  getMockItem,
  getMockAppItem,
  getEffectiveMock
} from '../database'
import { putMockListReq } from '../servers/mock'

class MockStore {
  apps = []
  apis = []
  activeApp = {}
  activeApi = {}
  modalInfo = {
    type: '',
    visible: false,
    active: {}
  }

  constructor() {
    makeAutoObservable(this)
  }

  // 设置窗口信息
  setModalInfo = (info) => {
    const { visible = false, type = '', active = {} } = info
    this.modalInfo = {
      visible,
      type,
      active
    }
  }

  // 新建、编辑应用信息
  setMockApps = async (data) => {
    const app = await putMockApps(data)
    this.updataActiveMockList()
    return app
  }

  // 获取应用列表
  fetchMockApps = async () => {
    const res = await getMockApps()
    this.apps = res
    return res
  }

  // 删除应用
  delMockApp = async (id) => {
    await delMockApps(id)
    this.updataActiveMockList()
  }

  // 新建、编辑接口 by 列表
  setMockApi = async (data) => {
    const { headers } = data
    const api = await putMockList({ ...data, headers: JSON.stringify(headers) })
    this.updataActiveMockList()
    return api
  }

  // 获取接口列表
  fetchMockApis = async (id) => {
    const res = await getMockList(Number(id))
    this.apis = res
    return res
  }

  // 删除接口
  delMockApi = async (id) => {
    await delMockList(id)
    this.updataActiveMockList()
  }

  // 获取接口详情
  fetchMockDetails = async (id) => {
    if (id) {
      const res = await getMockItem(Number(id))
      const { headers = '[]' } = res
      this.activeApi = { ...res, headers: JSON.parse(headers) }
    } else {
      this.activeApi = {}
    }
  }

  // 获取应用详情
  fetchActiveApp = async (id) => {
    if (id) {
      const res = await getMockAppItem(Number(id))
      this.activeApp = { ...res }
    } else {
      this.activeApp = {}
    }
  }

  // 更新有效的mock列表
  updataActiveMockList = async () => {
    const list = await getEffectiveMock()
    putMockListReq({ list })
  }
}

const common = new MockStore()

export default common
