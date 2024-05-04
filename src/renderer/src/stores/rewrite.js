import { makeAutoObservable } from 'mobx'
import { putRewriteReq } from '../servers/rewrite'
import * as myDb from '../database'

class RewriteStore {
  rewriteList = []
  activeGroup = null
  activeCode = ''

  constructor() {
    makeAutoObservable(this)
  }

  setActiveGroup = async (item) => {
    const { id } = item
    const data = await myDb.getRewriteById(id)
    this.activeGroup = data
  }

  fetchRewriteList = async () => {
    const res = await myDb.getRewrites()
    this.rewriteList = res
    return res
  }

  putRewrite = async (data) => {
    const res = await myDb.addRewrite(data)
    return res
  }

  delRewrite = async (id) => {
    const res = await myDb.delRewrite(id)
    return res
  }

  updataRewriteServer = async () => {
    const res = await myDb.getActiveRewrites()
    let actives = []
    res.forEach((item) => {
      const row = item.code.split('\r\n')
      row.forEach((code) => {
        const str = code.trim()
        if (!str.startsWith('#') && str.split(/\s+/).length === 2) {
          actives.push(code)
        }
      })
    })
    putRewriteReq({ list: actives })
  }
}

const rewrite = new RewriteStore()

export default rewrite
