import { ipcMain } from 'electron'
import intercept from '../servers/core/intercept'

export default () => {
  //用户最新精准匹配域名
  ipcMain.handle('ipc/rewrite/putRewriteList', async (event, args) => {
    const { list } = args
    intercept.updataRewrites(list)
    return {
      isSuccess: true
    }
  })
}
