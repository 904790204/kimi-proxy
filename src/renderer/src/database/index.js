import Dexie from 'dexie'

// 数据库版本
const lastVersion = 2

const db = new Dexie('myDataBase')

// 定义数据库结构
db.version(lastVersion).stores({
  rewrites: '++id, &name, status, code',
  mockApps: '++id, &name, status, describe, hostname',
  mockList: '++id, *appid, status, describe, path, method, statusCode, response, headers, delay',
  matchHosts: '++id, &name, status'
})

// 获取匹配域名列表
export const getMatchHosts = () => {
  return db.matchHosts.orderBy('id').toArray()
}

// 删除匹配域名列表
export const delMatchHosts = (id) => {
  return db.matchHosts.delete(id)
}

// 添加/编辑匹配域名列表
export const putMatchHosts = (data) => {
  return db.matchHosts.put(data)
}

// 获取转发列表
export const getRewrites = () => {
  return db.rewrites.orderBy('id').toArray()
}

// 获取转发模拟项目列表
export const getRewriteById = (id) => {
  return db.rewrites.where('id').equals(id).first()
}

// 获取有效的转发列表
export const getActiveRewrites = () => {
  return db.rewrites
    .orderBy('id')
    .and((item) => item.status)
    .toArray()
}

// 添加转发列表
export const addRewrite = (data) => {
  return db.rewrites.put(data)
}

// 添加转发列表
export const delRewrite = (id) => {
  return db.rewrites.delete(id)
}

// 获取转发模拟项目列表
export const getMockAppItem = (id) => {
  return db.mockApps.where('id').equals(id).first()
}

// 获取转发模拟项目列表
export const getMockApps = () => {
  return db.mockApps.orderBy('id').toArray()
}

// 添加/编辑模拟项目
export const putMockApps = (data) => {
  return db.mockApps.put(data)
}

// 删除mock项目
export const delMockApps = async (id) => {
  await db.mockList.where('appid').equals(id).delete()
  return db.mockApps.delete(id)
}

// 获取mock列表
export const getMockList = (appid) => {
  return db.mockList.where('appid').equals(appid).toArray()
}

// 获取有效的mock列表
// export const getActiveMockList = () => {
//   return db.mockList
//     .orderBy('id')
//     .and((item) => item.status)
//     .toArray()
// }

// 新增/编辑mock列表项
export const putMockList = (data) => {
  return db.mockList.put(data)
}

// 删除mock列表项
export const delMockList = (id) => {
  return db.mockList.delete(id)
}

// 获取mock列表
export const getMockItem = (id) => {
  return db.mockList.where('id').equals(id).first()
}

// 获取前全部生效的mock接口
export const getEffectiveMock = async () => {
  const res = await db.mockApps
    .orderBy('id')
    .and((item) => item.status)
    .toArray()
  const ids = []
  const infos = {}
  res.forEach((el) => {
    ids.push(el.id)
    infos[el.id] = el
  })

  const result = await db.mockList
    .where('appid')
    .anyOf(ids)
    .and((item) => item.status)
    .toArray()

  return result.map((el) => ({
    ...el,
    hostname: infos[el.appid]?.hostname
    // baseUrl: infos[el.appid]?.baseUrl
  }))
}
